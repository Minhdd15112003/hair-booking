/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Trash2 } from 'lucide-react';
import CustomAlertDialog from '@/components/customComponents/CustomAlertDialog';
import { findByIdService, getListService } from '@/app/api/core/service';
import { TComboResponse } from '@/app/api/types/combo';

import { deleteCombo } from '@/app/api/core/combo';
import { toast } from 'react-toastify';
import { on } from 'events';

interface ProductDetailsDialogProps {
    product: TComboResponse;
    onSuccess?: () => void;
}

interface Service {
    id: string;
    name: string;
    picture: string;
}

export function DetailsDialog({ product, onSuccess }: ProductDetailsDialogProps) {
    const [Services, setServices] = useState<Service[]>([]);

    useEffect(() => {
        const fetchServices = async () => {
            const services = await Promise.all(
                (product.services || []).map(async (id) => {
                    const service = await findByIdService(id);
                    return {
                        id: service.result.id,
                        name: service.result.name,
                        picture: service.result.picture,
                    };
                }),
            );
            setServices(services);
        };

        fetchServices();
    }, [product.services]);

    const handleDelete = async () => {
        try {
            await deleteCombo(product.id);
            // window.location.reload();
            toast.success('Xóa combo thành công');
            if (onSuccess) onSuccess();
        } catch (error: any) {
            toast.error(error.message);
            console.error(error);
        }
    };

    const amount = parseFloat(product.price);
    const formatted = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount);

    const [service, setService] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const services = await getListService();
            setService(services.result);
        };
        fetchData();
    }, []);

    return (
        <DialogContent className="sm:max-w-[800px] sm:max-h-[80vh] w-full h-full overflow-y-auto">
            <DialogHeader>
                <DialogTitle>{product.name}</DialogTitle>
                <DialogDescription>Thông tin chi tiết combo.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <img
                        src={product.picture || 'https://placehold.co/600x400'}
                        alt={product.name}
                        className="rounded-md object-cover w-full h-[200px]"
                    />
                    <div className="space-y-4">
                        <div>
                            <Label className="font-bold text-xl">Tổng giá</Label>
                            <p className="text-2xl">{formatted}</p>
                        </div>
                        <div>
                            <Label className="font-bold text-xl">Ghi chú</Label>
                            <p className="text-sm whitespace-pre-line break-words">{product.description}</p>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label className="font-medium">Tạo lúc</Label>
                        <p>{new Date(product.createdAt).toLocaleString()}</p>
                    </div>
                    <div>
                        <Label className="font-medium">Sửa lúc</Label>
                        <p>{new Date(product.updatedAt).toLocaleString()}</p>
                    </div>
                </div>
                <div>
                    <Label className="font-bold text-xl mb-2 block">Dịch vụ</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {Services.map((service) => (
                            <div key={service.id} className="text-center">
                                <img
                                    src={service.picture || 'https://placehold.co/600x400'}
                                    alt={service.name}
                                    className="rounded-md object-cover w-full h-[100px]"
                                />
                                <p className="mt-2 text-sm font-medium">{service.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
                {/* <ComboForm allServices={service} combo={product} /> */}
                <CustomAlertDialog
                    triggerText="Ngừng cung cấp dịch vụ"
                    title="Ban có chắc chắn muốn ngừng cung cấp dịch vụ này không?"
                    description="Dịch vụ sẽ không còn có thể sử dụng lại nữa."
                    icon={<Trash2 className="mr-2 h-4 w-4" />}
                    variant="destructive"
                    handleConfirm={handleDelete}
                    onSuccess={onSuccess}
                />
            </div>
        </DialogContent>
    );
}
