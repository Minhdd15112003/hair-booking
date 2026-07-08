import React from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface PaymentBookingAlertDialogProps {
    triggerText: string;
    title: string;
    description: string;
    handleCancel?: () => void;
    handlePending?: () => void;
    handlePAID?: () => void;
    icon?: React.ReactNode;
    variant?: 'link' | 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | null;
    currentPaymentStatus?: string;
    onSuccess?: () => void;
}

export default function AlertDialogPaymentBooking({
    triggerText,
    title,
    description,
    handleCancel,
    handlePending,
    handlePAID,
    icon,
    variant,
    currentPaymentStatus,
    onSuccess,
}: PaymentBookingAlertDialogProps) {
    const isCanceled = currentPaymentStatus === 'CANCELED';
    const isPaid = currentPaymentStatus === 'PAID';
    const isPending = currentPaymentStatus === 'PENDING';

    const disableCancel = isCanceled || isPaid;
    const disablePending = isCanceled || isPaid;
    const disablePaid = isCanceled || isPaid;

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant={variant}>
                    {icon && <span className="mr-2">{icon}</span>}
                    {triggerText}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="sm:max-w-[400px]">
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                    {/* Hủy (Cancel) Button */}
                    <AlertDialogAction
                        onClick={handleCancel}
                        className={`bg-red-500 text-white hover:bg-red-600 ${
                            disableCancel ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        disabled={disableCancel}
                    >
                        Hủy
                    </AlertDialogAction>

                    {/* Chờ thanh toán (Pending) Button */}
                    <AlertDialogAction
                        onClick={handlePending}
                        className={`bg-yellow-500 text-white hover:bg-yellow-600 ${
                            disablePending ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        disabled={disablePending}
                    >
                        Chờ thanh toán
                    </AlertDialogAction>

                    {/* Đã thanh toán (PAID) Button */}
                    <AlertDialogAction
                        onClick={handlePAID}
                        className={`bg-green-500 text-white hover:bg-green-600 ${
                            disablePaid ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        disabled={disablePaid}
                    >
                        Đã thanh toán
                    </AlertDialogAction>
                </AlertDialogFooter>
                <AlertDialogCancel className="mt-2 sm:mt-0">Đóng</AlertDialogCancel>
            </AlertDialogContent>
        </AlertDialog>
    );
}
