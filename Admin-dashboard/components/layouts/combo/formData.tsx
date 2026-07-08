/* eslint-disable @next/next/no-img-element */
'use client';

import { FormEvent, useEffect, useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Edit, Plus, X, Loader } from 'lucide-react';
import { TComboRequest, TComboResponse } from '@/app/api/types/combo';
import { TServiceResponse } from '@/app/api/types/service';
import { ScrollArea } from '@/components/ui/scroll-area';
import { createCombo } from '@/app/api/core/combo';
import { toast } from 'react-toastify';

interface ComboFormProps {
    onSuccess?: () => void;
    allServices: TServiceResponse[];
}

export default function ComboForm({ onSuccess, allServices }: ComboFormProps) {
    const [comboState, setComboState] = useState<TComboRequest>({
        name: '',
        description: '',
        picture: '',
        services: [],
    });
    const [isOpen, setIsOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, files } = e.target as HTMLInputElement;

        if (name === 'picture' && files && files[0]) {
            const file = files[0];
            setComboState((prevState) => ({
                ...prevState,
                [name]: file,
            }));
            setPreviewImage(URL.createObjectURL(file));
        } else {
            setComboState((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        }
    };

    const handleServiceChange = (serviceId: string) => {
        setComboState((prevState) => ({
            ...prevState,
            services: prevState.services.includes(serviceId)
                ? prevState.services.filter((id) => id !== serviceId)
                : [...prevState.services, serviceId],
        }));
    };

    const resetForm = () => {
        setComboState({
            name: '',
            description: '',
            picture: '',
            services: [],
        });
        setPreviewImage(null);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (comboState.services.length < 2) {
            toast.error('Vui lòng chọn ít nhất hai dịch vụ');
            return;
        }
        setLoading(true); // Start loading

        const formData = new FormData();
        Object.entries(comboState).forEach(([key, value]) => {
            if (key === 'services') {
                if (Array.isArray(value)) {
                    formData.append(key, value.join(','));
                }
            } else if (value instanceof File) {
                formData.append(key, value);
            } else {
                formData.append(key, String(value));
            }
        });

        try {
            await createCombo(formData);
            toast.success('Tạo combo thành công');
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
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                setIsOpen(open);
                if (open) resetForm();
            }}
        >
            <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center">
                    <Plus className="mr-2 h-4 w-4" />
                    Tạo Combo
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                    <DialogTitle>Tạo Combo</DialogTitle>
                    <DialogDescription>Tạo một combo mới tại đây. Nhấn lưu khi bạn hoàn tất.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Tên combo
                            </Label>
                            <Input
                                type="text"
                                id="name"
                                name="name"
                                onChange={handleInputChange}
                                value={comboState.name}
                                className="col-span-3"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-4 items-start gap-4">
                            <Label htmlFor="description" className="text-right pt-2">
                                Ghi chú
                            </Label>
                            <Textarea
                                onChange={handleInputChange}
                                id="description"
                                name="description"
                                value={comboState.description}
                                className="col-span-3"
                                rows={4}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="picture" className="text-right">
                                Ảnh
                            </Label>
                            <div className="col-span-3 grid grid-cols-2 items-center gap-4">
                                <Input
                                    onChange={handleInputChange}
                                    type="file"
                                    id="picture"
                                    name="picture"
                                    accept="image/*"
                                    className="mt-2 relative h-32"
                                />
                                {previewImage && (
                                    <div className="mt-2 relative w-32 h-32">
                                        <img
                                            src={previewImage}
                                            alt="Preview"
                                            className="rounded-md object-cover w-full h-full"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setPreviewImage(null);
                                                setComboState((prev) => ({ ...prev, picture: '' }));
                                            }}
                                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-start gap-4">
                            <Label className="text-right pt-2">Services</Label>
                            <ScrollArea className="h-[200px] col-span-3 border rounded-md p-4">
                                {allServices.map((service) => (
                                    <div key={service.id} className="flex items-center space-x-2 mb-2">
                                        <input
                                            type="checkbox"
                                            id={`service-${service.id}`}
                                            checked={comboState.services.includes(service.id)}
                                            onChange={() => handleServiceChange(service.id)}
                                        />
                                        <label htmlFor={`service-${service.id}`} className="flex items-center space-x-2">
                                            <img
                                                src={service.picture || 'https://placehold.co/600x400'}
                                                alt={service.name}
                                                className="w-8 h-8 object-cover rounded-full"
                                            />
                                            <span>{service.name}</span>
                                        </label>
                                    </div>
                                ))}
                            </ScrollArea>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading} className="flex items-center">
                            {loading && <Loader className="mr-2 h-4 w-4 animate-spin" />} {/* Loader icon */}
                            {loading ? 'Xác nhận...' : 'Xác nhận'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
