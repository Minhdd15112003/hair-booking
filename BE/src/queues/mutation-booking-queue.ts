import { Booking, BookingStatus, BookingType } from '@prisma/client';
import * as Queue from 'bull';
import { logger, selectFileds, utcDate } from 'src/common/utils';
import { broadcastNotification } from 'src/main';
import { ExpoNotiService } from 'src/modules/expo-noti/expo-noti.service';
import { PrismaDB } from 'src/modules/prisma/prisma.extensions';

const bookingQueue = new Queue('mutation-booking-queue', {
    redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
        // port: 6379,
    },
});

bookingQueue.process(1, async (job: any) => {
    const payload: Booking = job.data.data;
    const action = job.data.action;

    const newEndTime = new Date(payload.end_time as any);
    const newStartTime = new Date(payload.start_time as any);
    const statusOption = { status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED, BookingStatus.DELAYING] } };

    try {
        // Check if stylist has another booking at the same time
        const conflictingStylist = await PrismaDB.booking.findMany({
            where: {
                stylist_id: payload.stylist_id as any,
                ...(action === 'create' && statusOption),
                AND: [{ start_time: { lt: newEndTime } }, { end_time: { gt: newStartTime } }],
            },
        });

        // check if customer has booked the stylist > 3 times in a day
        const tooManyBookingInAday = await PrismaDB.booking.findMany({
            where: {
                stylist_id: payload.stylist_id as any,
                start_time: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0)),
                    lt: new Date(new Date().setHours(23, 59, 59, 999)),
                },
                OR: [
                    {
                        customer_id: payload.customer_id,
                    },
                    {
                        phone_number: payload.phone_number,
                    },
                ],
            },
        });

        // Check if customer has another booking at the same time
        let conflictingCustomer;
        if (payload.customer_id) {
            conflictingCustomer = await PrismaDB.booking.findMany({
                where: {
                    OR: [
                        {
                            customer_id: payload.customer_id,
                        },
                        {
                            phone_number: payload.phone_number,
                        },
                    ],
                    ...(action === 'create' && statusOption),
                    AND: [{ start_time: { lt: newEndTime } }, { end_time: { gt: newStartTime } }],
                },
            });
        }

        if (tooManyBookingInAday.length > 3) {
            return {
                success: false,
                message: 'Không thể  đặt lịch với stylist này quá 3 lần 1 ngày!',
            };
        }

        switch (action) {
            case 'create':
                if (conflictingStylist.length > 0) {
                    return {
                        success: false,
                        message: 'Stylist này đã có lịch hẹn khác vào thời gian này vui lòng chọn stylist hoặc khung giờ khác!',
                    };
                }

                if (conflictingCustomer && conflictingCustomer.length > 0) {
                    return { success: false, message: 'Bạn đã có lịch hẹn vào khung giờ này, vui lòng chọn khung giờ khác!' };
                }
                return await handleCreateBooking({
                    ...payload,
                    ...(payload.customer_id ? { booking_type: BookingType.REGISTERED } : { booking_type: BookingType.GUEST }),
                });
            case 'update':
                const id = payload.id;
                if (conflictingStylist.length > 0 && conflictingStylist[0].id !== payload.stylist_id) {
                    return {
                        success: false,
                        message: 'Stylist này đã có lịch khác vào thời gian này vui lòng chọn stylist hoặc khung giờ khác!',
                    };
                }

                if (conflictingCustomer && conflictingCustomer.length > 0 && conflictingCustomer[0].id !== id) {
                    return { success: false, message: 'Bạn đã có lịch hẹn vào khung giờ này, vui lòng chọn khung giờ khác!' };
                }
                return await handleUpdateBooking(payload);
            default:
                return { success: false, message: 'Invalid action!' };
        }
    } catch (error) {
        logger.debug(error);
        return { success: false, message: error.message };
    }
});

const notifyExpoService = new ExpoNotiService();

async function handleUpdateBooking(payload) {
    const id = payload.id;
    delete payload.id;

    try {
        const newBooking = await PrismaDB.booking.update({
            where: { id },
            data: payload as any,
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
                    select: { ...selectFileds, notify_token: true },
                },
                stylist: {
                    select: selectFileds,
                },
            },
        });

        if (newBooking && newBooking.customer) {
            if (payload.status === BookingStatus.CONFIRMED && newBooking.customer?.notify_token) {
                notifyExpoService.sendExpoNotify(
                    'Lịch hẹn đã được xác nhận!',
                    'Lịch hẹn đã được xác nhận!',
                    'success',
                    'high',
                    newBooking.customer.notify_token,
                    newBooking.customer_id,
                );
            }

            return { success: true, data: newBooking };
        } else {
            return { success: false, message: 'Không tìm thấy booking này!' };
        }
    } catch (error) {
        return { success: false, message: error.message };
    }
}

async function handleCreateBooking(payload) {
    try {
        if (!payload.customer_id) {
            payload.booking_type = BookingType.GUEST;
        }

        const newBooking = await PrismaDB.booking.create({
            data: payload as any,
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

        broadcastNotification({
            type: 'default',
            msg: 'Khách hàng đã đặt lịch hẹn mới!',
        });

        return { success: true, data: newBooking };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

export function addBookingQueue(data: any, action: string) {
    logger.info('[+] Mutation booking...');
    return bookingQueue.add({ data, action });
}
