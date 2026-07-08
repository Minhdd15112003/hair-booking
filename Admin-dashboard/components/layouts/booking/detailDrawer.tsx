/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, UserCircle2, CreditCard, Phone, MapPin, Cake, Star, CalendarCheck2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CustomAlertDialog from '@/components/customComponents/CustomAlertDialog';
import { deleteBooking, updatePaymentStatusBooking, updateStatusBooking } from '@/app/api/core/booking';
import BookingAlertDialog from '@/components/customComponents/AlertDialogBooking';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import AlertDialogPaymentBooking from '@/components/customComponents/AlertDialogPaymentBooking';
import { toast } from 'react-toastify';
import { convertToDisplayTime, formatCurrency, formatDate } from '@/utils';
import { DrawerClose, DrawerFooter } from '@/components/ui/drawer';

interface BookingDetailsDrawerProps {
    booking: {
        id: string;
        start_time: string;
        end_time: string;
        status: string;
        createdAt: string;
        updatedAt: string;
        deleted: boolean;
        full_name: string;
        phone_number: string;
        payment_status: string;
        combo: {
            services: any[];
            id: string;
            name: string;
            description: string;
            picture: string;
        };
        customer: {
            id: string;
            gender: string;
            role: string;
            full_name: string;
            phone_number: string;
            avatar: string | null;
            date_of_birth: string | null;
            address: string | null;
            profile: any | null;
            createdAt: string;
            updatedAt: string;
        };
        stylist: {
            id: string;
            gender: string;
            role: string;
            full_name: string;
            phone_number: string;
            avatar: string;
            date_of_birth: string | null;
            address: string | null;
            profile: {
                customer: any | null;
                stylist: {
                    experience: string;
                    reviews: number;
                    isWorking: boolean;
                };
            };
            createdAt: string;
            updatedAt: string;
        };
        total_time: number;
        total_price: number;
    };
    onSuccess?: (a?: any) => void;
}

export function BookingDetailsDrawer({ booking, onSuccess }: BookingDetailsDrawerProps) {
    const startTime = new Date(booking.start_time);
    const endTime = new Date(booking.end_time);
    const createdAt = new Date(booking.createdAt);
    const updatedAt = new Date(booking.updatedAt);
    const [loading, setLoading] = useState(false);
    const [currentBooking, setCurrentBooking] = useState(booking);

    const handleDelete = async () => {
        setLoading(true);
        try {
            await deleteBooking(booking.id);
            toast.success('Xóa đặt lịch thành công');
            if (onSuccess) onSuccess();
        } catch (error: any) {
            toast.error(error.message);
            console.error('Lỗi khi xóa đặt lịch', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (status: string) => {
        try {
            await updateStatusBooking(currentBooking.id, {
                phone_number: currentBooking?.customer?.phone_number,
                status,
            });
            setCurrentBooking((prevBooking) => ({
                ...prevBooking,
                status: status,
            }));
            toast.success('Thay đổi trạng thái thành công');
            if (onSuccess) onSuccess({ ...currentBooking, action: 'update-status', status: status });
        } catch (error: any) {
            toast.error(error.message);
            console.log('Lỗi khi cập nhật trạng thái đặt lịch', error);
        }
    };

    const handleUpdatePaymentStatus = async (payment_status: string) => {
        try {
            await updatePaymentStatusBooking(currentBooking.id, {
                phone_number: currentBooking?.customer?.phone_number,
                payment_status,
            });
            setCurrentBooking((prevBooking) => ({
                ...prevBooking,
                payment_status: payment_status,
            }));
            toast.success('Thay đổi trạng thái thanh toán thành công');
            if (onSuccess) onSuccess();
        } catch (error: any) {
            toast.error(error.message);
            console.log('Lỗi khi cập nhật trạng thái thanh toán', error);
        }
    };

    const handleCancel = () => handleUpdateStatus('CANCELED');
    const handleConfirm = () => handleUpdateStatus('CONFIRMED');
    const handleComplete = () => handleUpdateStatus('COMPLETED');
    const handleDelaying = () => handleUpdateStatus('DELAYING');
    const handleProgress = () => handleUpdateStatus('PENDING');

    const handlePaymentCancel = () => handleUpdatePaymentStatus('CANCELED');
    const handlePaymentPending = () => handleUpdatePaymentStatus('PENDING');
    const handlePaymentPaid = () => handleUpdatePaymentStatus('PAID');

    return (
        <>
            <div className="flex gap-6 justify-center items-start">
                {/* left side */}
                <div className="grid gap-8">
                    {/* Thời gian đặt lịch */}
                    <div className="grid gap-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center space-x-2">
                                <Calendar className="w-5 h-5 text-gray-500" />
                                <div>
                                    <Label className="block text-xs text-gray-600">Bắt đầu</Label>
                                    <p>{convertToDisplayTime(startTime.toISOString())}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Clock className="w-5 h-5 text-gray-500" />
                                <div>
                                    <Label className="block text-xs text-gray-600">Kết thúc</Label>
                                    <p>{convertToDisplayTime(endTime.toISOString())}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Chi tiết Combo */}
                    <div className="flex max-w-sm items-center space-x-4 bg-gray-100 p-4 rounded-md">
                        <img
                            src={currentBooking.combo.picture || 'https://placehold.co/400x400'}
                            alt={currentBooking.combo.name}
                            className="w-24 h-24 rounded-md object-cover"
                        />
                        <div>
                            <h3 className="text-lg font-bold">{currentBooking.combo.name}</h3>
                            <p className="text-sm text-gray-600">{currentBooking.combo.description}</p>
                        </div>
                    </div>
                    {/* Trạng thái đặt lịch và thanh toán */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="block mb-1">Trạng thái đặt lịch</Label>
                            <div
                                className={`
                px-3 py-1 rounded-full text-sm text-center font-medium
                ${
                    currentBooking.status === 'CANCELED'
                        ? 'inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-sm font-medium text-red-600 ring-1 ring-inset ring-gray-500/10'
                        : currentBooking.status === 'DELAYING'
                        ? 'inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-sm font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20'
                        : currentBooking.status === 'CONFIRMED'
                        ? 'inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-sm font-medium text-green-700 ring-1 ring-inset ring-green-600/20'
                        : currentBooking.status === 'COMPLETED'
                        ? 'inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-sm font-medium text-gray-700 ring-1 ring-inset ring-blue-700/10'
                        : currentBooking.status === 'PENDING'
                        ? 'inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-sm font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10'
                        : currentBooking.status === 'UNCONFIRMED'
                        ? 'inline-flex items-center rounded-md bg-amber-50 px-2 py-1 text-sm font-medium text-amber-700 ring-1 ring-inset ring-indigo-700/10'
                        : 'inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-sm font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10'
                }
              `}
                            >
                                {currentBooking.status === 'CANCELED'
                                    ? 'Đã hủy'
                                    : currentBooking.status === 'COMPLETED'
                                    ? 'Hoàn thành'
                                    : currentBooking.status === 'CONFIRMED'
                                    ? 'Đã xác nhận'
                                    : currentBooking.status === 'DELAYING'
                                    ? 'Hoãn'
                                    : currentBooking.status === 'UNCONFIRMED'
                                    ? 'Chưa xác nhận'
                                    : currentBooking.status === 'PENDING'
                                    ? 'Đang làm'
                                    : 'Không xác định'}
                            </div>
                        </div>
                        <div>
                            <Label className="block mb-1">Trạng thái thanh toán</Label>
                            <div
                                className={`
                px-3 py-1 rounded-full text-sm text-center font-medium
                ${
                    currentBooking.payment_status === 'PAID'
                        ? 'bg-green-100 text-green-700'
                        : currentBooking.payment_status === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-700'
                        : currentBooking.payment_status === 'CANCELED'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-700'
                }
              `}
                            >
                                {currentBooking.payment_status === 'PAID'
                                    ? 'Đã thanh toán'
                                    : currentBooking.payment_status === 'PENDING'
                                    ? 'Chờ thanh toán'
                                    : currentBooking.payment_status === 'CANCELED'
                                    ? 'Đã hủy'
                                    : 'Không xác định'}
                            </div>
                        </div>
                    </div>

                    {/* Tổng giá và thời gian */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                            <CreditCard className="w-5 h-5 text-gray-500" />
                            <div>
                                <Label className="block text-xs text-gray-600">Tổng giá</Label>
                                <p className="text-xl font-bold text-blue-600">{formatCurrency(currentBooking.total_price)}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Clock className="w-5 h-5 text-gray-500" />
                            <div>
                                <Label className="block text-xs text-gray-600">Tổng thời gian</Label>
                                <p className="text-xl font-bold">{currentBooking.total_time} phút</p>
                            </div>
                        </div>
                    </div>

                    {/* Thời gian tạo và cập nhật */}
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                            <Label className="block">Tạo lúc</Label>
                            <p>{formatDate(createdAt)}</p>
                        </div>
                        <div>
                            <Label className="block">Cập nhật lúc</Label>
                            <p>{formatDate(updatedAt)}</p>
                        </div>
                    </div>
                </div>

                {/* right side */}
                <div className="grid gap-8">
                    {/* Thông tin khách hàng */}
                    <div className="bg-blue-50 p-4 rounded-md">
                        <h4 className="text-lg font-semibold mb-2">Thông tin khách hàng</h4>
                        <div className="flex items-start space-x-4">
                            <Avatar className="w-16 h-16">
                                <AvatarImage
                                    src={currentBooking.customer?.avatar || 'https://placehold.co/400x400'}
                                    alt={currentBooking.customer?.full_name}
                                />
                                <AvatarFallback>Đang tải...</AvatarFallback>
                            </Avatar>
                            <div className="grid grid-cols-2 gap-4 flex-grow">
                                <div className="flex items-center space-x-2">
                                    <UserCircle2 className="w-5 h-5 text-gray-500" />
                                    <p>{currentBooking.customer?.full_name || currentBooking.full_name}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Phone className="w-5 h-5 text-gray-500" />
                                    <p>{currentBooking.customer?.phone_number || currentBooking.phone_number}</p>
                                </div>
                                {currentBooking.customer?.address && (
                                    <div className="flex items-center space-x-2 col-span-2">
                                        <MapPin className="w-5 h-5 text-gray-500" />
                                        <p>{currentBooking.customer?.address}</p>
                                    </div>
                                )}
                                {currentBooking.customer?.date_of_birth && (
                                    <div className="flex items-center space-x-2">
                                        <Cake className="w-5 h-5 text-gray-500" />
                                        <p>{new Date(currentBooking.customer.date_of_birth).toLocaleDateString('vi-VN')}</p>
                                    </div>
                                )}
                                <div className="flex items-center space-x-2">
                                    <Label className="text-gray-600">Giới tính:</Label>
                                    <p>
                                        {' '}
                                        {currentBooking.customer?.gender === 'MALE'
                                            ? 'Nam'
                                            : currentBooking.customer?.gender === 'FEMALE'
                                            ? 'Nữ'
                                            : 'Không xác định'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Thông tin Stylist */}
                    <div className="bg-green-50 p-4 rounded-md">
                        <h4 className="text-lg font-semibold mb-2">Thông tin Stylist</h4>
                        <div className="flex items-center space-x-4">
                            <img
                                src={currentBooking.stylist.avatar || 'https://placehold.co/100x100'}
                                alt={currentBooking.stylist.full_name}
                                className="w-16 h-16 rounded-full object-cover"
                            />
                            <div className="grid gap-2">
                                <div className="flex items-center space-x-2">
                                    <UserCircle2 className="w-5 h-5 text-gray-500" />
                                    <p className="font-medium">{currentBooking.stylist.full_name}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Phone className="w-5 h-5 text-gray-500" />
                                    <p>{currentBooking.stylist.phone_number}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Star className="w-5 h-5 text-gray-500" />
                                    <p>Kinh nghiệm: {currentBooking.stylist.profile.stylist.experience}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Label className="text-gray-600">Đánh giá:</Label>
                                    <p>{currentBooking.stylist.profile.stylist.reviews}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Label className="text-gray-600">Trạng thái:</Label>
                                    <p>
                                        {currentBooking.stylist.profile.stylist.isWorking ? 'Đang làm việc' : 'Không làm việc'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <DrawerFooter>
                {/* <Button>Submit</Button> */}
                <div className="flex justify-end space-x-2 mt-6">
                    <CustomAlertDialog
                        triggerText="Lưu trũ"
                        title="Bạn có chắc chắn không?"
                        description="Hành động này không thể hoàn tác. Điều này sẽ xóa vĩnh viễn lịch hẹn của bạn."
                        icon={<Trash2 className="mr-2 h-4 w-4" />}
                        variant="destructive"
                        loading={loading}
                        handleConfirm={handleDelete}
                        onSuccess={onSuccess}
                    />
                    <BookingAlertDialog
                        triggerText="Trạng thái"
                        title="Cập nhật trạng thái đặt lịch"
                        description="Bạn có chắc chắn muốn thay đổi trạng thái không?"
                        icon={<CalendarCheck2 className="mr-2 h-4 w-4" />}
                        variant="default"
                        handleCancel={handleCancel}
                        handleConfirm={handleConfirm}
                        handleComplete={handleComplete}
                        handleDelaying={handleDelaying}
                        handleProgress={handleProgress}
                        currentStatus={currentBooking.status}
                        onSuccess={onSuccess}
                    />
                    <AlertDialogPaymentBooking
                        triggerText="Thanh toán"
                        title="Cập nhật trạng thái thanh toán"
                        description="Bạn có chắc chắn muốn thay đổi trạng thái không?"
                        icon={<CreditCard className="mr-2 h-4 w-4" />}
                        variant="outline"
                        handleCancel={handlePaymentCancel}
                        handlePAID={handlePaymentPaid}
                        handlePending={handlePaymentPending}
                        currentPaymentStatus={currentBooking.payment_status}
                        onSuccess={onSuccess}
                    />
                    <DrawerClose className="w-fit" asChild>
                        <Button variant="outline">Close</Button>
                    </DrawerClose>
                </div>
            </DrawerFooter>
        </>
    );
}

export default BookingDetailsDrawer;
