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
import { ScrollArea } from '@/components/ui/scroll-area';
import { createBooking, updateBooking } from '@/app/api/core/booking';

import { toast } from 'react-toastify';
import { Calculate } from '@/utils/timeCalculator';
import { convertToDisplayTime, convertVietnamTimeToUTC, dateToUTCString } from '@/utils';

interface BookingFormProps {
    booking?: {
        full_name: string | null;
        phone_number: string | null;
        id: string;
        start_time: string;
        end_time: string;
        combo_id: string;
        customer_id: string;
        stylist_id: string;
    };
    onSuccess?: () => void;
    combos: { id: string; name: string; total_time: number }[];
    customers: { id: string; full_name: string }[];
    stylists: { id: string; full_name: string }[];
}

export default function BookingForm({ booking, onSuccess, combos, customers, stylists }: BookingFormProps) {
    const [bookingState, setBookingState] = useState({
        start_time: '',
        end_time: '',
        combo_id: '',
        customer_id: '',
        stylist_id: '',
    });
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false); // Loading state
    const [calculatedEndTime, setCalculatedEndTime] = useState<string | null>(null);

    useEffect(() => {
        if (booking) {
            setBookingState({
                start_time: booking.start_time,
                end_time: booking.end_time,
                combo_id: booking.combo_id,
                customer_id: booking.customer_id,
                stylist_id: booking.stylist_id,
            });
        }
    }, [booking]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setBookingState((prevState) => ({
            ...prevState,
            [name]: value,
        }));

        if (name === 'start_time' || name === 'combo_id') {
            calculateEndTime(
                name === 'start_time' ? value : bookingState.start_time,
                name === 'combo_id' ? value : bookingState.combo_id,
            );
        }
    };

    const calculateEndTime = (startTime: string, comboId: string) => {
        if (startTime && comboId) {
            const selectedCombo = combos.find((combo) => combo.id === comboId);
            if (selectedCombo) {
                const calculator = Calculate(new Date(startTime + ':00.000Z'), selectedCombo.total_time);

                setCalculatedEndTime(calculator.toISOString());
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const bookingCreateData = {
            start_time: convertVietnamTimeToUTC(bookingState.start_time + ':00.000Z'),
            end_time: convertVietnamTimeToUTC(calculatedEndTime ? calculatedEndTime : bookingState.end_time + ':00.000Z'),
            combo_id: bookingState.combo_id,
            customer_id: bookingState.customer_id,
            stylist_id: bookingState.stylist_id,
        };

        try {
            await createBooking(bookingCreateData as any);
            toast.success('Thêm lịch hẹn thành công');

            setIsOpen(false);
            if (onSuccess) onSuccess();
        } catch (error: any) {
            toast.error(error.message);
            console.error('Combo operation error:', error);
        } finally {
            setLoading(false); // End loading
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center">
                    {booking ? <Edit className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                    {booking ? 'Sửa' : 'Tạo'} Lịch hẹn
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle> {booking ? 'Sửa' : 'Tạo'} Lịch hẹn</DialogTitle>
                    <DialogDescription>
                        {booking ? 'Thay đổi thông tin lịch hẹn của bạn tại đây.' : 'Tạo lịch hẹn mới tại đây.'} Nhấn lưu khi
                        bạn hoàn tất.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="start_time" className="text-right">
                                Start Time
                            </Label>
                            <Input
                                type="datetime-local"
                                id="start_time"
                                name="start_time"
                                onChange={handleInputChange}
                                value={bookingState.start_time}
                                className="col-span-3"
                                required
                            />
                        </div>

                        {calculatedEndTime && (
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="end_time" className="text-right">
                                    End Time
                                </Label>
                                <Input
                                    type="text"
                                    id="end_time"
                                    name="end_time"
                                    value={convertToDisplayTime(calculatedEndTime)}
                                    className="col-span-3"
                                    disabled
                                />
                            </div>
                        )}

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="combo_id" className="text-right">
                                Combo
                            </Label>
                            <select
                                id="combo_id"
                                name="combo_id"
                                onChange={handleInputChange}
                                value={bookingState.combo_id}
                                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="customer_id" className="text-right">
                                Customer
                            </Label>
                            <select
                                id="customer_id"
                                name="customer_id"
                                onChange={handleInputChange}
                                value={bookingState.customer_id}
                                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                required
                            >
                                <option value=""> Select a customer</option>
                                {customers && customers.length > 0 ? (
                                    customers.map((customer) => (
                                        <option key={customer.id} value={customer.id}>
                                            {customer.full_name}
                                        </option>
                                    ))
                                ) : (
                                    <option disabled>No customers available</option>
                                )}
                            </select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="stylist_id" className="text-right">
                                Stylist
                            </Label>
                            <select
                                id="stylist_id"
                                name="stylist_id"
                                onChange={handleInputChange}
                                value={bookingState.stylist_id}
                                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                required
                            >
                                <option value="">Select a stylist</option>
                                {stylists.map((stylist) => (
                                    <option key={stylist.id} value={stylist.id}>
                                        {stylist.full_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">
                            {loading && <Loader className="mr-2 h-4 w-4 animate-spin" />} {/* Loader icon */}
                            {loading ? 'Saving...' : 'Save changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
