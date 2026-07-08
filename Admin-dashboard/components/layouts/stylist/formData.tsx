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
import { Edit, Loader, Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { createStylist, updateProfileStylist } from '@/app/api/core/stylist';
import { toast } from 'react-toastify';

type TStylistRequest = {
    gender: string;
    full_name: string;
    phone_number: string;
    avatar?: string;
    date_of_birth?: string;
    address?: string;
    profile: {
        stylist?: {
            experience?: string;
            reviews?: number;
            isWorking?: boolean;
        };
    };
};

type TStylistResponse = TStylistRequest & { id: string };

interface StylistFormProps {
    stylist?: TStylistResponse;
    onSuccess?: () => void;
}

export function StylistForm({ stylist, onSuccess }: StylistFormProps) {
    const [fullName, setFullName] = useState('');
    const [gender, setGender] = useState('UNKNOWN');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [address, setAddress] = useState('');
    const [picture, setPicture] = useState<File | null>(null);
    const [experience, setExperience] = useState('');
    const [reviews, setReviews] = useState(0);
    const [isWorking, setIsWorking] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [loading, setLoading] = useState(false); // Loading state

    useEffect(() => {
        if (stylist) {
            setFullName(stylist.full_name);
            setGender(stylist.gender);
            setPhoneNumber(stylist.phone_number);
            setDateOfBirth(stylist.date_of_birth || '');
            setPicture(stylist.avatar ? new File([], stylist.avatar) : null);
            setAddress(stylist.address || '');
            setExperience(stylist.profile?.stylist?.experience || '');
            setReviews(stylist.profile?.stylist?.reviews || 0);
            setIsWorking(stylist.profile?.stylist?.isWorking || false);
            setIsUpdating(true);
        }
    }, [stylist]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const stylistData = {
            full_name: fullName,
            gender,
            // phone_number: phoneNumber,
            date_of_birth: new Date(dateOfBirth).toISOString(),
            address,
            profile: {
                stylist: {
                    experience,
                    reviews,
                    isWorking,
                },
            },
        };

        try {
            if (isUpdating) {
                await updateProfileStylist(stylist!.id, stylistData)
                    .then(() => {
                        toast.success('Cập nhật thông tin nhân viên thành công!');
                        if (onSuccess) onSuccess();
                    })
                    .catch((error) => {
                        toast.error(error.message);
                    });

                // window.location.reload();
            } else {
                const formData = new FormData();
                formData.append('full_name', fullName);
                formData.append('gender', gender);
                formData.append('phone_number', phoneNumber);
                if (picture) formData.append('picture', picture);
                if (dateOfBirth) {
                    const formattedDate = new Date(dateOfBirth).toISOString();
                    formData.append('date_of_birth', formattedDate);
                }
                if (address) formData.append('address', address);

                await createStylist(formData)
                    .then(() => {
                        toast.success('Tạo thông tin nhân viên thành công!');
                        if (onSuccess) onSuccess();
                    })
                    .catch((error) => {
                        toast.error(error.message);
                    });

                // window.location.reload();
            }
            setIsOpen(false);
        } catch (error: any) {
            toast.error(error.message);
            console.error('Stylist operation error:', error);
        } finally {
            setLoading(false); // End loading
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center">
                    {stylist ? <Edit className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                    {stylist ? 'Sửa' : 'Tạo'} Nhân viên
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle> {stylist ? 'Sửa' : 'Tạo'} Nhân viên </DialogTitle>
                    <DialogDescription>
                        {stylist ? 'Chỉnh sửa thông tin nhân viên tại đây.' : 'Tạo thông tin nhân viên mới tại đây.'} Nhấn lưu
                        khi bạn hoàn tất.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="full_name" className="text-right">
                                Họ và tên
                            </Label>
                            <Input
                                id="full_name"
                                name="full_name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="gender" className="text-right">
                                Giới tính
                            </Label>
                            <Select onValueChange={setGender} defaultValue={gender}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="MALE">Nam</SelectItem>
                                    <SelectItem value="FEMALE">Nữ</SelectItem>
                                    <SelectItem value="UNKNOWN">Không xác định</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {!isUpdating && (
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="phone_number" className="text-right">
                                    Số điện thoại
                                </Label>
                                <Input
                                    id="phone_number"
                                    name="phone_number"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    className="col-span-3"
                                    required
                                />
                            </div>
                        )}

                        {!isUpdating && (
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="avatar" className="text-right">
                                    Ảnh đại diện
                                </Label>
                                <Input
                                    type="file"
                                    id="avatar"
                                    name="avatar"
                                    onChange={(e) => setPicture(e.target.files?.[0] || null)}
                                    className="col-span-3"
                                />
                            </div>
                        )}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="date_of_birth" className="text-right">
                                Ngày sinh
                            </Label>
                            <Input
                                type="date"
                                id="date_of_birth"
                                name="date_of_birth"
                                value={dateOfBirth}
                                onChange={(e) => setDateOfBirth(e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="address" className="text-right">
                                Địa chỉ
                            </Label>
                            <Textarea
                                id="address"
                                name="address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                        {isUpdating && (
                            <>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="experience" className="text-right">
                                        Kinh nhiệm
                                    </Label>
                                    <Input
                                        id="experience"
                                        name="experience"
                                        value={experience}
                                        onChange={(e) => setExperience(e.target.value)}
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="reviews" className="text-right">
                                        Đánh giá
                                    </Label>
                                    <Input
                                        type="number"
                                        id="reviews"
                                        name="reviews"
                                        value={reviews}
                                        onChange={(e) => setReviews(Number(e.target.value))}
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="isWorking" className="text-right">
                                        Trạng thái
                                    </Label>
                                    <Switch
                                        id="isWorking"
                                        name="isWorking"
                                        checked={isWorking}
                                        onCheckedChange={setIsWorking}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                    <DialogFooter>
                        <Button type="submit">
                            {loading && <Loader className="mr-2 h-4 w-4 animate-spin" />} {/* Loader icon */}
                            {loading ? 'Xác nhận...' : 'Xác nhận'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
