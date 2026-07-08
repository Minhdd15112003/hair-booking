'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit, Loader, Plus } from 'lucide-react';
import { createBooking, updateBooking } from '@/app/api/core/booking';
import { convertVietnamTimeToUTC, dateToUTCString } from '@/utils';
import { Calculate } from '@/utils/timeCalculator';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// --------------- Zod Schema Definition ---------------
const bookingSchema = z.object({
    start_time: z.string().nonempty('Start time is required'),
    end_time: z.string().nonempty('End time is required'),
    combo_id: z.string().nonempty('Please select a combo'),
    stylist_id: z.string().nonempty('Please select a stylist'),
    full_name: z
        .string()
        .min(2, 'Họ và tên phải có ít nhất 2 ký tự')
        .max(100, 'Họ và tên không được vượt quá 100 ký tự')
        .regex(/^[A-Za-zÀ-ỹ\s]+$/, 'Họ và tên không được chứa số hoặc ký tự đặc biệt'),
    phone_number: z
        .string()
        .min(10, 'Số điện thoại phải có ít nhất 10 số')
        .max(15, 'Số điện thoại tối đa 15 số')
        .regex(/^\d+$/, 'Số điện thoại chỉ được chứa chữ số'),
});

// Infer the form data type from the schema
type BookingFormData = z.infer<typeof bookingSchema>;

// --------------- Type Definitions ---------------
interface BookingFormProps {
    booking?: {
        full_name: string | null;
        phone_number: string | null;
        id: string;
        start_time: string;
        end_time: string;
        combo_id: string;
        stylist_id: string;
    };
    onSuccess?: () => void;
    combos: { id: string; name: string; total_time: number }[];
    stylists: { id: string; full_name: string }[];
}

// --------------- BookingUnknownCustomerForm Component ---------------
export default function BookingUnknownCustomerForm({
    booking,
    onSuccess,
    combos,
    stylists,
}: BookingFormProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false); // Loading state
    const [calculatedEndTime, setCalculatedEndTime] = useState<string | null>(null);

    // Initialize React Hook Form
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm<BookingFormData>({
        resolver: zodResolver(bookingSchema),
        defaultValues: {
            start_time: '',
            end_time: '',
            combo_id: '',
            stylist_id: '',
            full_name: '',
            phone_number: '',
        },
    });

    // Watch relevant fields
    const watchStartTime = watch('start_time');
    const watchComboId = watch('combo_id');

    useEffect(() => {
        if (booking) {
            reset({
                start_time: booking.start_time,
                end_time: booking.end_time,
                combo_id: booking.combo_id,
                stylist_id: booking.stylist_id,
                full_name: booking.full_name || '',
                phone_number: booking.phone_number || '',
            });
            calculateEndTime(booking.start_time, booking.combo_id);
        } else {
            reset(); // Reset to default values if creating a new booking
            setCalculatedEndTime(null);
        }
    }, [booking, reset]);

    useEffect(() => {
        if (watchStartTime && watchComboId) {
            calculateEndTime(watchStartTime, watchComboId);
        }
    }, [watchStartTime, watchComboId]);

    const calculateEndTime = (startTime: string, comboId: string) => {
        if (startTime && comboId) {
            const selectedCombo = combos.find((combo) => combo.id === comboId);
            if (selectedCombo) {
                const calculator = Calculate(
                    new Date(startTime + ':00.000Z'),
                    selectedCombo.total_time
                );
                setCalculatedEndTime(calculator.toISOString());
                setValue('end_time', calculator.toISOString());
            }
        } else {
            setCalculatedEndTime(null);
            setValue('end_time', '');
        }
    };

    const onSubmit = async (data: BookingFormData) => {
        setLoading(true);
        const start_time = convertVietnamTimeToUTC(data.start_time + ':00.000Z');
        const end_time = convertVietnamTimeToUTC(data.end_time + ':00.000Z');
        const bookingCreateData = {
            start_time,
            end_time,
            combo_id: data.combo_id,
            stylist_id: data.stylist_id,
            full_name: data.full_name,
            phone_number: data.phone_number,
            status: 'pending', // Add status field with a default value
        };

        try {
            if (booking) {
                // Update existing booking
                await updateBooking(booking.id, bookingCreateData);
                toast.success('Cập nhật lịch hẹn thành công');
            } else {
                // Create new booking
                await createBooking(bookingCreateData);
                toast.success('Thêm lịch hẹn thành công');
            }
            setIsOpen(false);
            if (onSuccess) onSuccess();
            // Optionally, refresh the page or data
            // window.location.reload();
        } catch (error: any) {
            toast.error(error.message || 'Có lỗi xảy ra!');
            console.error('Booking operation error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center">
                    {booking ? (
                        <Edit className="mr-2 h-4 w-4" />
                    ) : (
                        <Plus className="mr-2 h-4 w-4" />
                    )}
                    {booking ? 'Sửa' : 'Tạo'} Lịch hẹn cho vãng lai
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        {booking ? 'Sửa' : 'Tạo'} Lịch hẹn cho vãng lai
                    </DialogTitle>
                    <DialogDescription>
                        {booking
                            ? 'Thay đổi thông tin lịch hẹn của bạn tại đây.'
                            : 'Tạo lịch hẹn mới tại đây.'}{' '}
                        Nhấn lưu khi bạn hoàn tất.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-4 py-4">
                        {/* Start Time */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="start_time" className="text-right">
                                Start Time
                            </Label>
                            <div className="col-span-3">
                                <Input
                                    type="datetime-local"
                                    id="start_time"
                                    {...register('start_time')}
                                    className="w-full"
                                    required
                                />
                                {errors.start_time && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.start_time.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* End Time */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="end_time" className="text-right">
                                End Time
                            </Label>
                            <div className="col-span-3">
                                <Input
                                    type="text"
                                    id="end_time"
                                    {...register('end_time')}
                                    value={calculatedEndTime ? new Date(calculatedEndTime).toLocaleString() : ''}
                                    className="w-full"
                                    disabled
                                />
                                {errors.end_time && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.end_time.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Combo Selection */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="combo_id" className="text-right">
                                Combo
                            </Label>
                            <div className="col-span-3">
                                <select
                                    id="combo_id"
                                    {...register('combo_id')}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                    required
                                >
                                    <option value="">Select a combo</option>
                                    {combos && combos.length > 0 ? (
                                        combos.map((combo) => (
                                            <option key={combo.id} value={combo.id}>
                                                {combo.name}
                                            </option>
                                        ))
                                    ) : (
                                        <option disabled>No combos available</option>
                                    )}
                                </select>
                                {errors.combo_id && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.combo_id.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Full Name */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="full_name" className="text-right">
                                Họ và tên
                            </Label>
                            <div className="col-span-3">
                                <Input
                                    id="full_name"
                                    {...register('full_name')}
                                    className="w-full"
                                    required
                                />
                                {errors.full_name && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.full_name.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Phone Number */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phone_number" className="text-right">
                                Số điện thoại
                            </Label>
                            <div className="col-span-3">
                                <Input
                                    id="phone_number"
                                    {...register('phone_number')}
                                    className="w-full"
                                    required
                                />
                                {errors.phone_number && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.phone_number.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Stylist Selection */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="stylist_id" className="text-right">
                                Stylist
                            </Label>
                            <div className="col-span-3">
                                <select
                                    id="stylist_id"
                                    {...register('stylist_id')}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                    required
                                >
                                    <option value="">Select a stylist</option>
                                    {stylists.map((stylist) => (
                                        <option key={stylist.id} value={stylist.id}>
                                            {stylist.full_name}
                                        </option>
                                    ))}
                                </select>
                                {errors.stylist_id && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.stylist_id.message}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader className="mr-2 h-4 w-4 animate-spin" />} {/* Loader icon */}
                            {loading ? 'Saving...' : 'Save changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
    }

