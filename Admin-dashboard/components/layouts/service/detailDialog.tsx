/* eslint-disable @next/next/no-img-element */
'use client';

import { use, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Trash2, Edit } from 'lucide-react';
import { TServiceResponse } from '@/app/api/types/service';
import ServiceForm from './formData';
import CustomAlertDialog from '@/components/customComponents/CustomAlertDialog';
import { deleteService } from '@/app/api/core/service';
import { toast } from 'react-toastify';

interface ProductDetailsDialogProps {
    product: TServiceResponse;
    onSuccess?: () => void;
}

export function DetailsDialog({ product, onSuccess }: ProductDetailsDialogProps) {
    const [productState, setProductState] = useState(product);

    const handleDelete = async () => {
        try {
            await deleteService(product.id);
            toast.success('dịch vụ đã chuyển sang lưu trữ thành công');
            // window.location.reload();
            if (onSuccess) onSuccess();
        } catch (error: any) {
            toast.error(error.message);
            console.error(error);
        }
    };

    const amount = parseFloat(product.price);

    const formatted = new Intl.NumberFormat('VND', {
        style: 'currency',
        currency: 'VND',
    }).format(amount);

    return (
      
            <DialogContent className="sm:max-w-[800px] sm:max-h-[600px] w-full h-full">
                <DialogHeader>
                    <DialogTitle>{product.name}</DialogTitle>
                    <DialogDescription>Thông tin dịch vụ.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4 ml-5">
                        <img
                            src={product.picture}
                            alt={product.name}
                            className=" w-[400px] h-[200px] rounded-md object-cover"
                        />
                        <div className="space-y-2">
                            <div>
                                <Label className="font-bold text-xl">Giá</Label>
                                <p className="text-2xl ">{formatted}</p>
                            </div>

                            <div>
                                <Label className="font-bold text-xl">Mô tả</Label>
                                <p className="text-sm  whitespace-pre-line break-words">{product.description}</p>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="font-medium">Tạo lúc</Label>
                            <p>{new Date(product.createdAt).toLocaleString()}</p>
                        </div>
                        <div>
                            <Label className="font-medium">Cập nhật lúc</Label>
                            <p>{new Date(product.updatedAt).toLocaleString()}</p>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end space-x-2 mt-6">
                    {/* <ServiceForm service={product} /> */}

                    <CustomAlertDialog
                        triggerText="Ngừng cung cấp dịch vụ"
                        title="Ban có chắc chắn muốn ngừng cung cấp dịch vụ này không?"
                        description="Dịch vụ sẽ không còn có thể sử dụng lại nữa."
                        icon={<Trash2 className="mr-2 h-4 w-4" />}
                        variant="destructive"
                        handleConfirm={handleDelete}
                    />
                </div>
            </DialogContent>

    );
}
