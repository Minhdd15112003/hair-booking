import React from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface BookingAlertDialogProps {
    triggerText: string;
    title: string;
    description: string;
    handleCancel?: () => void;
    handleConfirm?: () => void;
    handleComplete?: () => void;
    handleDelaying?: () => void;
    handleProgress?: () => void;
    onSuccess?: () => void;
    icon?: React.ReactNode;
    variant?: 'link' | 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | null;
    currentStatus?: string;
    isOpen?: boolean;
    onClose?: () => void;
}

export default function BookingAlertDialog({
    triggerText,
    title,
    description,
    handleCancel,
    handleConfirm,
    handleComplete,
    handleDelaying,
    handleProgress,
    onSuccess,
    currentStatus,
    icon,
    variant,
}: BookingAlertDialogProps) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant={variant}>
                    {icon && <span>{icon}</span>}
                    {triggerText}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="sm:max-w-[500px]">
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-col sm:flex-row justify-center items-center gap-2">
                    {currentStatus !== 'COMPLETED' && (
                        <>
                            <div className="flex flex-col gap-4">
                                <AlertDialogAction
                                    onClick={handleConfirm}
                                    className={`bg-green-500 text-white hover:bg-green-600 ${
                                        currentStatus === 'CANCELED' ||
                                        currentStatus === 'CONFIRMED' ||
                                        currentStatus === 'DELAYING' ||
                                        currentStatus === 'PENDING'
                                            ? 'opacity-50 cursor-not-allowed'
                                            : ''
                                    }`}
                                    disabled={
                                        currentStatus === 'CANCELED' ||
                                        currentStatus === 'CONFIRMED' ||
                                        currentStatus === 'DELAYING' ||
                                        currentStatus === 'PENDING'
                                    }
                                >
                                    Xác nhận
                                </AlertDialogAction>
                                <AlertDialogAction
                                    onClick={handleCancel}
                                    className={`bg-red-500 text-white hover:bg-red-600 ${
                                        currentStatus === 'CANCELED' ||
                                        currentStatus === 'CONFIRMED' ||
                                        currentStatus === 'DELAYING' ||
                                        currentStatus === 'PENDING'
                                            ? 'opacity-50 cursor-not-allowed'
                                            : ''
                                    }`}
                                    disabled={
                                        currentStatus === 'CANCELED' ||
                                        currentStatus === 'CONFIRMED' ||
                                        currentStatus === 'DELAYING' ||
                                        currentStatus === 'PENDING'
                                    }
                                >
                                    Hủy
                                </AlertDialogAction>
                            </div>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                className="size-6"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                />
                            </svg>
                            <div className="flex flex-col gap-4">
                                <AlertDialogAction
                                    onClick={handleDelaying}
                                    className={`bg-gray-500 text-white hover:bg-gray-600 ${
                                        currentStatus === 'CANCELED' ||
                                        currentStatus === 'DELAYING' ||
                                        currentStatus === 'PENDING'
                                            ? 'opacity-50 cursor-not-allowed'
                                            : ''
                                    }`}
                                    disabled={
                                        currentStatus === 'CANCELED' ||
                                        currentStatus === 'DELAYING' ||
                                        currentStatus === 'PENDING'
                                    }
                                >
                                    Hoãn
                                </AlertDialogAction>
                                <AlertDialogAction
                                    onClick={handleProgress}
                                    className={`bg-purple-500 text-white hover:bg-purple-600 ${
                                        currentStatus === 'CANCELED' || currentStatus === 'IN_PROGRESS'
                                            ? 'opacity-50 cursor-not-allowed'
                                            : ''
                                    }`}
                                    disabled={currentStatus === 'CANCELED' || currentStatus === 'IN_PROGRESS'}
                                >
                                    Đang làm
                                </AlertDialogAction>
                            </div>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                className="size-6"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                />
                            </svg>
                            <AlertDialogAction
                                onClick={handleComplete}
                                className={`bg-blue-500 text-white hover:bg-blue-600 ${
                                    currentStatus === 'CANCELED' ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                                disabled={currentStatus === 'CANCELED'}
                            >
                                Hoàn thành
                            </AlertDialogAction>
                        </>
                    )}
                    {currentStatus === 'COMPLETED' && <p className="text-green-600 font-semibold">Đơn hàng đã hoàn thành</p>}
                </AlertDialogFooter>
                <AlertDialogCancel className="mt-2 sm:mt-0">Đóng</AlertDialogCancel>
            </AlertDialogContent>
        </AlertDialog>
    );
}
