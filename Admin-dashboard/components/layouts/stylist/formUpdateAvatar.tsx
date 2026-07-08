'use client';

import React, { FormEvent, useState, useRef } from 'react';
import Image from 'next/image';
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
import { Label } from '@/components/ui/label';
import { Edit, Loader } from 'lucide-react';
import { updateAvatarCustomer } from '@/app/api/core/customer';

interface Customer {
    id?: string;
    avatar: string | null;
}

interface CustomerFormProps {
    customer?: Customer;
    onSuccess?: () => void;
}

export default function CustomerAvatarForm({ customer, onSuccess }: CustomerFormProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false); // Loading state

    const [picture, setPicture] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(customer?.avatar || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPicture(file);
            const imageUrl = URL.createObjectURL(file);
            setPreviewUrl(imageUrl);
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (customer?.id && picture) {
                const formData = new FormData();
                formData.append('picture', picture);
                await updateAvatarCustomer(customer.id, formData);
            }

            setIsOpen(false);
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error('Customer operation error:', error);
        }finally {
            setLoading(false); // End loading
          }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Edit className="mr-2 h-4 w-4" />
                    Update Avatar
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Update Avatar Customer</DialogTitle>
                    <DialogDescription>Click on the square to select a new avatar image.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="picture" className="text-right">
                                Avatar
                            </Label>
                            <div
                                className="col-span-3 w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden"
                                onClick={handleImageClick}
                            >
                                {previewUrl ? (
                                    <Image src={previewUrl} alt="Avatar preview" width={160} height={160} objectFit="cover" />
                                ) : (
                                    <span className="text-gray-500">Click to select image</span>
                                )}
                            </div>
                            <input
                                type="file"
                                id="picture"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                className="hidden"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={!picture}>
                        {loading && <Loader className="mr-2 h-4 w-4 animate-spin" />} {/* Loader icon */}
                        {loading ? "Saving..." : "Save changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
