/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { TCustomerResponse } from '@/app/api/types/customer';
import { Trash2 } from 'lucide-react';
import CustomAlertDialog from '@/components/customComponents/CustomAlertDialog';
import { deleteCustomer, unBannedCustomer } from '@/app/api/core/customer';
import { toast } from 'react-toastify';

interface CustomerDetailsDialogProps {
    customer: TCustomerResponse;
    onSuccess?: () => void;
}

export function DetailsDialogBanned({ customer, onSuccess }: CustomerDetailsDialogProps) {
    const [customerState, setCustomerState] = useState(customer);

    const handleUnBanned = async () => {
        try {
            await unBannedCustomer(customer.id);
            toast.success('Khách hàng đã được bỏ chặn');
            if (onSuccess) onSuccess();
        } catch (error) {
            toast.error('Có lỗi xảy ra'+error);
            console.error(error);
        }
    };

    return (
        <DialogContent className="sm:max-w-[800px] sm:max-h-[600px] w-full h-full">
            <DialogHeader>
                <DialogTitle>{customer.full_name}</DialogTitle>
                <DialogDescription>Thông tin khách hàng.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4 ml-5">
                    <img
                        src={customer.avatar || '/placeholder.svg?height=200&width=200'}
                        alt={customer.full_name}
                        className="w-[400px] h-[200px] rounded-md object-cover"
                    />
                    <div className="space-y-2">
                        <div>
                            <Label className="font-bold text-xl">Giới tính</Label>
                            <p className="text-lg">{customer.gender}</p>
                        </div>
                        <div>
                            <Label className="font-bold text-xl">Phân quyền</Label>
                            <p className="text-lg">{customer.role}</p>
                        </div>
                        <div>
                            <Label className="font-bold text-xl">Số điện thoại</Label>
                            <p className="text-lg">{customer.phone_number}</p>
                        </div>
                        <div>
                            <Label className="font-bold text-xl">Ngày sinh</Label>
                            <p className="text-lg">{customer.date_of_birth || 'Not provided'}</p>
                        </div>
                    </div>
                </div>
                <div>
                    <Label className="font-bold text-xl">Địa chỉ</Label>
                    <p className="text-sm whitespace-pre-line break-words">{customer.address}</p>
                </div>
                {customer.profile && customer.profile.customer && (
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <Label className="font-medium">Kinh nghiệm</Label>
                            <p>{customer.profile.customer.rank}</p>
                        </div>
                        <div>
                            <Label className="font-medium">Đánh giá</Label>
                            <p>{customer.profile.customer.rewards}</p>
                        </div>
                    </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label className="font-medium">Tạo lúc</Label>
                        <p>{new Date(customer.createdAt).toLocaleString()}</p>
                    </div>
                    <div>
                        <Label className="font-medium">Cập nhật lúc</Label>
                        <p>{new Date(customer.updatedAt).toLocaleString()}</p>
                    </div>
                </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
                {/* <CustomerForm customer={customer} />
                <CustomerAvatarForm customer={customer as any} />
                <CustomerNumberPhoneForm customer={customer as any} /> */}
                <CustomAlertDialog
                    triggerText="Bỏ Chặn"
                    title="Bạn có chắc muốn bỏ chặn khách hàng này"
                    // description="This action cannot be undone. This will permanently delete the customer's account and remove their data from our servers."
                    icon={<Trash2 className="mr-2 h-4 w-4" />}
                    variant="secondary"
                    handleConfirm={handleUnBanned}
                />
            </div>
        </DialogContent>
    );
}
