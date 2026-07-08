'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import { TServiceResponse } from '@/app/api/types/service';
import { Edit, Plus, Loader } from 'lucide-react';
import { createService, updateService } from '@/app/api/core/service';
import { toast } from 'react-toastify';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const serviceSchema = z.object({
    name: z.string().min(1, { message: 'Tên dịch vụ không được để trống' }),
    price: z
        .string()
        .regex(/^\d+$/, { message: 'Giá phải là số' })
        .refine((val) => parseInt(val, 10) > 1000, { message: 'Giá phải lớn hơn 1000' }),
    time: z
        .string()
        .regex(/^\d+$/, { message: 'Thời gian phải là số' })
        .refine((val) => parseInt(val, 10) >= 5, { message: 'Thời gian tối thiểu là 5 phút' }),
    description: z.string().optional(),
    picture: z.instanceof(File).optional(),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

interface ServiceFormProps {
    service?: TServiceResponse;
    onSuccess?: () => void;
}

export default function ServiceForm({ service, onSuccess }: ServiceFormProps) {
    const [isOpen, setIsOpen] = useState(false);

    const form = useForm<ServiceFormValues>({
        resolver: zodResolver(serviceSchema),
        defaultValues: {
            name: '',
            price: '',
            description: '',
            time: '',
        },
    });

    useEffect(() => {
        if (service) {
            form.reset({
                name: service.name,
                price: service.price.toString(),
                description: service.description,
                time: service.time.toString(),
            });
        }
    }, [service, form]);

    const onSubmit = async (data: ServiceFormValues) => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value instanceof File) {
                formData.append(key, value);
            } else if (value !== undefined && value !== null) {
                formData.append(key, value.toString());
            }
        });

        try {
            await createService(formData);
            toast.success('Tạo dịch vụ thành công');
            form.reset();
            setIsOpen(false);
            if (onSuccess) onSuccess();
        } catch (error: any) {
            toast.error(error.message);
            console.error('Service operation error:', error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant={'outline'} className="flex items-center">
                    {service ? <Edit className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                    {service ? 'Update' : 'Create'} Dịch vụ
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                    <DialogTitle>{service ? 'Update' : 'Create'} Dịch vụ</DialogTitle>
                    <DialogDescription>
                        {service ? 'Thay đổi dịch vụ của bạn tại đây.' : 'Tạo dịch vụ mới tại đây.'} Nhấn lưu khi bạn hoàn tất.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tên dịch vụ</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Giá</FormLabel>
                                    <FormControl>
                                        <Input min={0} type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="time"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Thời gian</FormLabel>
                                    <FormControl>
                                        <Input min={0} type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ghi chú</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="picture"
                            render={({ field: { value, onChange, ...field } }) => (
                                <FormItem>
                                    <FormLabel>Ảnh</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="file"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) onChange(file);
                                            }}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {service && (
                            <>
                                <FormItem>
                                    <FormLabel>Tạo lúc</FormLabel>
                                    <FormControl>
                                        <Input value={service.createdAt} disabled />
                                    </FormControl>
                                </FormItem>
                                <FormItem>
                                    <FormLabel>Sửa lúc</FormLabel>
                                    <FormControl>
                                        <Input value={service.updatedAt} disabled />
                                    </FormControl>
                                </FormItem>
                            </>
                        )}
                        <DialogFooter>
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                                {form.formState.isSubmitting ? 'Xác nhận...' : 'Xác nhận'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
