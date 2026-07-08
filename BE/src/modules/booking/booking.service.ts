import { Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { formatPrice, isDateInRange, logger, selectFileds, utcDate } from 'src/common/utils';
import { PrismaDB } from 'src/modules/prisma/prisma.extensions';
import { BookingStatus, PaymentStatus, Roles } from '@prisma/client';
import { addBookingQueue } from 'src/queues/mutation-booking-queue';
import { BookingQuery } from 'src/modules/booking/constant';
import { removeJob } from 'src/queues/check-booking-queue';
import { ExpoNotiService } from 'src/modules/expo-noti/expo-noti.service';

export const populateBookingData = async (validBooking) => {
    if (!validBooking) {
        throw new Error('Combo không tồn tại!.');
    }

    const services = [];
    if (validBooking && validBooking.combo?.services && validBooking.combo?.services.length > 0) {
        services.push(
            ...(await PrismaDB.service.findMany({
                where: {
                    id: {
                        in: validBooking.combo?.services,
                    },
                },
            })),
        );
    }

    delete validBooking.customer_id;
    delete validBooking.stylist_id;
    delete validBooking.combo_id;

    return {
        ...validBooking,
        combo: {
            ...validBooking.combo,
            services,
        },
        total_time: services.reduce((sum, service) => sum + parseFloat(service.time) || 0, 0),
        total_price: services.reduce((sum, service) => sum + parseFloat(service.price) || 0, 0),
    };
};

const validTransitions = {
    [BookingStatus.UNCONFIRMED]: [BookingStatus.CONFIRMED, BookingStatus.CANCELED],
    [BookingStatus.CONFIRMED]: [BookingStatus.DELAYING, BookingStatus.PENDING],
    [BookingStatus.DELAYING]: [BookingStatus.PENDING],
    [BookingStatus.PENDING]: [BookingStatus.COMPLETED],
    [BookingStatus.COMPLETED]: [],
    [BookingStatus.CANCELED]: [],
};

function canChangeStatus(currentStatus, newStatus) {
    const allowedStatuses = validTransitions[currentStatus] || [];
    return allowedStatuses.includes(newStatus);
}

@Injectable()
export class BookingService {
    constructor(private expoNotiService: ExpoNotiService) {}

    async cancelBooking(phone: string, booking_id: string) {
        const booking = await PrismaDB.booking.findUnique({
            where: {
                id: booking_id,
            },
            include: {
                customer: {
                    select: {
                        notify_token: true,
                        ...selectFileds,
                    },
                },
            },
        });

        if (!booking) {
            throw new Error('Không tìm thấy booking!.');
        }

        if (booking.status === BookingStatus.CANCELED) {
            throw new Error('Đang ở trạng thái này rồi.');
        }

        // không thể hủy nếu đã được xác nhận và thời gian hiện tại tới thời gian bắt đầu booking nhỏ hơn 2 tiếng
        if (
            booking.status === BookingStatus.CONFIRMED &&
            new Date(booking.start_time).getTime() - new Date().getTime() < 2 * 60 * 60 * 1000
        ) {
            throw new Error('Không thể hủy booking khi còn ít hơn 2 tiếng nữa!.');
        }

        // if (!canChangeStatus(booking.status, BookingStatus.CANCELED)) {
        //     throw new Error('Lịch hẹn đã được xác nhận, không thể hủy!.');
        // }

        removeJob(booking_id);

        const notify_token = booking.customer?.notify_token;

        if (notify_token) {
            this.expoNotiService.sendExpoNotify(
                'Booking đã bị hủy',
                'Đã hủy booking của bạn',
                'success',
                'high',
                booking.customer.notify_token,
                booking.customer_id,
            );
        }

        return await PrismaDB.booking.update({
            where: {
                id: booking_id,
            },
            data: {
                status: BookingStatus.CANCELED,
                payment_status: PaymentStatus.CANCELED,
            },
        });
    }

    async changeBookingStatus(phone: string, booking_id: string, status: BookingStatus, user: User) {
        const booking = await PrismaDB.booking.findUnique({
            where: {
                id: booking_id,
            },
            include: {
                customer: {
                    select: {
                        notify_token: true,
                        ...selectFileds,
                        id: true,
                    },
                },
                combo: {
                    select: {
                        services: true,
                        name: true,
                    },
                },
            },
        });
        if (!booking) {
            throw new Error('Booking không hợp lệ!.');
        }

        if (booking.status === status) {
            throw new Error('Đang ở trạng thái này rồi.');
        } else if (!canChangeStatus(booking.status, status)) {
            throw new Error('Không thể chuyển trạng thái từ ' + booking.status + ' sang ' + status);
        }
        const tranformedData = await populateBookingData(booking);

        if (!booking) {
            throw new Error('Không tìm thấy booking!.');
        }

        const notify_token = tranformedData?.customer?.notify_token;

        if (notify_token && notify_token.trim() !== '') {
            if ((user.role === Roles.ADMIN || user.role === Roles.STYLIST) && status === BookingStatus.CANCELED) {
                this.expoNotiService
                    .sendExpoNotify(
                        'Booking đã bị hủy',
                        'Đã hủy booking của bạn',
                        'success',
                        'high',
                        tranformedData.customer.notify_token,
                        tranformedData.customer.id,
                    )
                    .then((res) => res.json())
                    .then((res) => {})
                    .catch(logger.debug);
            } else if (status === BookingStatus.COMPLETED) {
                this.expoNotiService
                    .sendExpoNotify(
                        'Thanh toán thành công',
                        `Đã thanh toán thành công ${formatPrice(tranformedData.total_price)} cho dịch vụ: ${tranformedData?.combo?.name}`,
                        'success',
                        'high',
                        tranformedData.customer.notify_token,
                        tranformedData.customer.id,
                    )
                    .then((res) => res.json())
                    .then((res) => {
                        console.log(res);
                    })
                    .catch((err) => {
                        console.log({ errorSendNotify: err });
                    });
            } else if (status === BookingStatus.CONFIRMED) {
                this.expoNotiService
                    .sendExpoNotify(
                        'Lịch hẹn của bạn đã được xác nhận',
                        `Lịch hẹn vào lúc  ${utcDate(tranformedData.start_time).toLocaleString()} của bạn đã được xác nhận. Chúc bạn có một trải nghiệm tuyệt vời`,
                        'success',
                        'high',
                        tranformedData.customer.notify_token,
                        tranformedData.customer.id,
                    )
                    .then((res) => {
                        try {
                            console.log({ res });
                            res.json();
                        } catch (error) {
                            console.log(error);
                            return { error: error };
                        }
                    })
                    .then((res) => {
                        console.log(res);
                    })
                    .catch((err) => {
                        console.log({ errorSendNotify: err });
                    });
            }
        }

        return await PrismaDB.booking.update({
            where: {
                id: booking_id,
            },
            data: {
                status,
                ...(status === BookingStatus.CANCELED && {
                    payment_status: PaymentStatus.CANCELED,
                }),
                ...(status === BookingStatus.COMPLETED && {
                    payment_status: PaymentStatus.PAID,
                }),
            },
        });
    }

    async changeBookingPaymentStatus(phone: string, booking_id: string, payment_status: PaymentStatus) {
        const booking = await PrismaDB.booking.findUnique({
            where: {
                id: booking_id,
            },
            include: {
                customer: {
                    select: {
                        notify_token: true,
                        ...selectFileds,
                        id: true,
                    },
                },
                combo: {
                    select: {
                        services: true,
                        name: true,
                    },
                },
            },
        });

        if (!booking) {
            throw new Error('Không tìm thấy booking!.');
        }

        // if (booking.status === BookingStatus.CANCELED) {
        //     throw new Error('Booking này đã bị hủy!.');
        // }

        const notify_token = booking.customer?.notify_token;

        // console.log(booking);
        if (notify_token) {
            const data = await populateBookingData(booking);
            payment_status === PaymentStatus.PAID &&
                this.expoNotiService
                    .sendExpoNotify(
                        'Thanh toán thành công',
                        ' Đã thanh toán thành công ' + formatPrice(data.total_price) + ' cho dịch vụ: ' + data?.combo?.name,
                        'success',
                        'high',
                        booking.customer.notify_token,
                        booking.customer.id,
                    )
                    .then((res) => res.json())
                    .then((res) => {
                        console.log(res);
                    })
                    .catch((err) => {
                        console.log({ errorSendNotify: err });
                    });
        }

        return await PrismaDB.booking.update({
            where: {
                id: booking_id,
            },
            data: {
                payment_status,
                ...(payment_status === PaymentStatus.CANCELED && {
                    status: BookingStatus.CANCELED,
                }),
                ...(payment_status === PaymentStatus.PAID && {
                    status: BookingStatus.COMPLETED,
                }),
            },
        });
    }

    async create(createBookingDto: CreateBookingDto) {
        const newEndTime = new Date(createBookingDto.end_time as string);
        const newStartTime = new Date(createBookingDto.start_time as string);

        console.log({ newStartTime, currentTime: new Date() });

        if (newEndTime <= newStartTime) {
            throw new Error('Thời gian kết thúc phải sau thời gian bắt đầu!.');
        }

        const stylist = await PrismaDB.user.findUnique({
            where: {
                id: createBookingDto.stylist_id as string,
                role: Roles.STYLIST,
            },
            select: { profile: true },
        });

        const combo = await populateBookingData(
            await PrismaDB.combo.findUnique({
                where: {
                    id: createBookingDto.combo_id as string,
                },
                select: {
                    services: true,
                },
            }),
        );

        if (createBookingDto.customer_id) {
            const customer = await PrismaDB.user.findUnique({
                where: {
                    id: createBookingDto.customer_id as string,
                },
            });

            if (!customer) {
                throw new Error('Không tìm thấy khách hàng này!');
            }
        }

        if (!combo) {
            throw new Error('Combo không tồn tại!.');
        }

        if (!combo?.services || combo.services.length === 0) {
            throw new Error('Combo này không có dịch vụ!.');
        }

        if (!isDateInRange(createBookingDto.start_time, combo.total_time)) {
            throw new Error('Ngày và giờ này tiệm đã đóng cửa!.');
        }

        if (!stylist || !stylist.profile || stylist.profile.stylist.isWorking === false) {
            throw new Error('Stylist này không còn làm việc!.');
        }

        const job = await addBookingQueue(createBookingDto, 'create');
        const result = await job.finished();

        if (!result.success) {
            throw new Error(result.message);
        }

        return await populateBookingData(result.data);
    }

    async findAll(key, value) {
        const coditions = [];

        switch (key) {
            case BookingQuery.phone_number:
                coditions.push({
                    customer: {
                        phone_number: value,
                    },
                });
                break;
            case BookingQuery.user_id:
                coditions.push({
                    customer: {
                        id: value,
                    },
                });
                break;
            case BookingQuery.stylist_id:
                coditions.push({
                    stylist: {
                        id: value,
                    },
                });
                break;
            case BookingQuery.status:
                coditions.push({
                    status: value,
                });
                break;
            case BookingQuery.combo_id:
                coditions.push({
                    combo_id: value,
                });

                break;
            case BookingQuery.combo_name:
                coditions.push({
                    combo: {
                        name: value,
                    },
                });
                break;
            case BookingQuery.combo_name:
                coditions.push({
                    combo: {
                        name: value,
                    },
                });
                break;
            case BookingQuery.service_id:
                coditions.push({
                    combo: {
                        services: {
                            has: value,
                        },
                    },
                });

                break;
            case BookingQuery.service_name:
                coditions.push({
                    combo: {
                        services: {
                            has: value,
                        },
                    },
                });
                break;
            default:
                break;
        }

        const booking = await PrismaDB.booking.findMany({
            where: {
                AND: coditions,
            },
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                combo: {
                    select: {
                        services: true,
                        id: true,
                        name: true,
                        description: true,
                        picture: true,
                    },
                },
                customer: {
                    select: selectFileds,
                },
                stylist: {
                    select: selectFileds,
                },
            },
        });

        return await Promise.all(booking.map(async (item) => await populateBookingData(item)));
    }

    async findOne(id: string) {
        const validBooking = await PrismaDB.booking.findUnique({
            where: {
                id,
            },
            include: {
                combo: {
                    select: {
                        services: true,
                        id: true,
                        name: true,
                        description: true,
                        picture: true,
                    },
                },
                customer: {
                    select: selectFileds,
                },
                stylist: {
                    select: selectFileds,
                },
            },
        });

        if (!validBooking) {
            throw new Error('Không tìm thấy booking này!.');
        }

        return await populateBookingData(validBooking);
    }

    async update(id: string, updateBookingDto: UpdateBookingDto) {
        const newEndTime = new Date(updateBookingDto.end_time as any);
        const newStartTime = new Date(updateBookingDto.start_time as any);

        const currentBooking = await PrismaDB.booking.findUnique({
            where: { id },
        });

        if (!currentBooking) {
            throw new Error('Booking không hợp lệ!.');
        }

        if (currentBooking.start_time !== newStartTime && currentBooking.end_time !== newEndTime) {
            if (newEndTime <= newStartTime) {
                throw new Error('Thời gian kết thúc phải sau thời gian bắt đầu!.');
            }

            // if (newStartTime < new Date()) {
            //     throw new Error('Thời gian bắt đầu không thể nhỏ hơn thời gian hiện tại!.');
            // }
        }

        // if (newEndTime <= newStartTime) {
        //     throw new Error('Thời gian kết thúc phải sau thời gian bắt đầu!.');
        // }

        // if (!isDateInRange(newStartTime)) {
        //     throw new Error('Ngày và giờ này tiệm đã đóng cửa!.');
        // }

        if (updateBookingDto.stylist_id && updateBookingDto.stylist_id !== currentBooking.stylist_id) {
            const stylist = await PrismaDB.user.findUnique({
                where: {
                    id: updateBookingDto.stylist_id as any,
                    role: Roles.STYLIST,
                },
                select: { profile: true },
            });

            if (stylist == null || !stylist.profile || stylist.profile.stylist.isWorking === false) {
                throw new Error('Stylist này không còn làm việc!.');
            }
        }

        const job = await addBookingQueue({ ...updateBookingDto, id }, 'update');
        const result = await job.finished();

        if (!result.success) {
            throw new Error(result.message);
        }

        return result;
    }

    async remove(id: string) {
        return await PrismaDB.booking.delete({
            where: {
                id,
            },
        });
    }
}
