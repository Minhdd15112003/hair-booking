'use client';

import React, { FormEvent, useState } from 'react';
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
import { Edit, Loader, Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createCustomer, updateNumberPhoneCustomer, updateProfileCustomer } from '@/app/api/core/customer';

interface Customer {
    id?: string;
    full_name: string;
    gender: string;
    phone_number: string;
    picture?: File | null;
    date_of_birth?: string;
    address?: string;
    profile?: {
        customer?: {
            rank?: string;
            rewards?: number;
        };
    };
}

interface CustomerFormProps {
    customer?: Customer;
    onSuccess?: () => void;
}

export default function CustomerNumberPhoneForm({ customer, onSuccess }: CustomerFormProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false); // Loading state

    const [phoneNumber, setPhoneNumber] = useState(customer?.phone_number || '');

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (customer?.id) {
                // Cập nhật thông tin khách hàng
                await updateNumberPhoneCustomer(customer.id, {
                    phone_number: phoneNumber,
                });
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
                    {customer ? (
                        <>
                            <Edit className="mr-2 h-4 w-4" />
                            Update Number Phone
                        </>
                    ) : (
                        <>
                            <Plus className="mr-2 h-4 w-4" />
                            Create Customer
                        </>
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{customer ? 'Update' : 'Create'} Number phone Customer</DialogTitle>
                    <DialogDescription>
                        {customer ? 'Make changes to your customer here.' : 'Add a new customer to your database.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phone_number" className="text-right">
                                Phone Number
                            </Label>
                            <Input
                                id="phone_number"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="col-span-3"
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">
                        {loading && <Loader className="mr-2 h-4 w-4 animate-spin" />} {/* Loader icon */}
                        {loading ? "Saving..." : "Save changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
