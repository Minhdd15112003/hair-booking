/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Trash2, Edit } from 'lucide-react';
import CustomAlertDialog from '@/components/customComponents/CustomAlertDialog';
import { deleteStylist } from '@/app/api/core/stylist'; // Assuming you have this function
import { TStylistResponse } from '@/app/api/types/stylist';
import { StylistForm } from './formData';

interface StylistDetailsDialogProps {
    stylist: TStylistResponse;
    onSuccess?: () => void;
}

export function DetailsDialog({ stylist, onSuccess }: StylistDetailsDialogProps) {
    const [stylistState, setStylistState] = useState(stylist);
    const formatDate = (date: Date) => {
        return date.toLocaleString('vi-VN', {
            dateStyle: 'medium',
            timeStyle: 'short',
        });
    };

    const handleDelete = async () => {
        try {
            await deleteStylist(stylist.id);
            // window.location.reload();
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <DialogContent className="sm:max-w-[800px] sm:max-h-[700px] w-full h-full">
            <DialogHeader>
                <DialogTitle>{stylist.full_name}</DialogTitle>
                <DialogDescription>Stylist details and information.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4 ml-5">
                    <img
                        src={stylist.avatar || '/placeholder.svg?height=200&width=200'}
                        alt={stylist.full_name}
                        className="w-[400px] h-[200px] rounded-md object-cover"
                    />
                    <div className="space-y-2">
                        <div>
                            <Label className="font-bold text-xl">Giới tính</Label>
                            <p className="text-lg">{stylist.gender}</p>
                        </div>
                        <div>
                            <Label className="font-bold text-xl">Phân quyền</Label>
                            <p className="text-lg">{stylist.role}</p>
                        </div>
                        <div>
                            <Label className="font-bold text-xl">Số điện thoại</Label>
                            <p className="text-lg">{stylist.phone_number}</p>
                        </div>
                        <div>
                            <Label className="font-bold text-xl">Ngày sinh</Label>
                            <p className="text-lg">
                                {stylist.date_of_birth ? formatDate(new Date(stylist.date_of_birth)) : 'Not provided'}
                            </p>
                        </div>
                    </div>
                </div>
                <div>
                    <Label className="font-bold text-xl">Địa chỉ</Label>
                    <p className="text-sm whitespace-pre-line break-words">{stylist.address}</p>
                </div>
                {stylist.profile && stylist.profile.stylist && (
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <Label className="font-medium">Kinh nhiệm</Label>
                            <p>{stylist.profile.stylist.experience}</p>
                        </div>
                        <div>
                            <Label className="font-medium">Đánh giá</Label>
                            <p>{stylist.profile.stylist.reviews}</p>
                        </div>
                        <div>
                            <Label className="font-medium">Trạng thái làm việc</Label>
                            <p>{stylist.profile.stylist.isWorking ? 'Hoạt động' : 'Không hoạt động'}</p>
                        </div>
                    </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label className="font-medium">Tạo lúc</Label>
                        <p>{new Date(stylist.createdAt).toLocaleString()}</p>
                    </div>
                    <div>
                        <Label className="font-medium">Cập nhật lúc</Label>
                        <p>{new Date(stylist.updatedAt).toLocaleString()}</p>
                    </div>
                </div>
                <div className="flex justify-end space-x-2 mt-6">
                    <StylistForm stylist={stylist as any} onSuccess={onSuccess} />
                    {/* <StylisAvatarForm customer={stylist as any} />
                    <StylisNumberPhoneForm customer={stylist as any} /> */}
                    {/* <CustomAlertDialog
                        triggerText="Delete"
                        title="Are you absolutely sure?"
                        description="This action cannot be undone. This will permanently delete the stylist's account and remove their data from our servers."
                        icon={<Trash2 className="mr-2 h-4 w-4" />}
                        variant="destructive"
                        handleConfirm={handleDelete}
                    /> */}
                </div>
            </div>
        </DialogContent>
    );
}
