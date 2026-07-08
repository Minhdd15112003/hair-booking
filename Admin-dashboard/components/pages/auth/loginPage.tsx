'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, Lock, ArrowRight, EyeOff, Eye, PhoneCallIcon, Loader } from 'lucide-react';
import { login } from '@/app/api/core/auth';
import Cookie from 'js-cookie';

const FloatingShape = ({ delay = 0 }) => (
    <motion.div
        className="absolute w-64 h-64 bg-primary/10 rounded-full mix-blend-multiply filter blur-xl"
        animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
        }}
        transition={{
            duration: 8,
            repeat: Infinity,
            delay,
        }}
    />
);

export default function LoginPage() {
    const router = useRouter();
    const [numberPhone, setNumberPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (!numberPhone || !password) {
            setError('Vui lòng điền vào tất cả các trường');
            setIsLoading(false);
            return;
        }

        try {
            const data = await login({ phone_number: numberPhone, password });
            console.log(data);
            if (data?.access_token && data?.refresh_token) {
                // Lưu access_token và refresh_token vào localStorage
                localStorage.setItem('access_token', data.access_token);
                localStorage.setItem('refresh_token', data.refresh_token);
                localStorage.setItem('admin_id', data.result.id);

                // Kiểm tra quyền của người dùng (ví dụ: role)
                if (data.result.role !== 'ADMIN') {
                    setError('Tài khoản không có quyền truy cập');
                    return;
                }

                if (data.access_token) {
                    // Chuyển hướng tới trang dashboard nếu đăng nhập thành công
                    router.push('/dashboard');
                }
            } else {
                setError('Không nhận được token');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-background to-background/80 overflow-hidden">
            <div className="flex-1 flex items-center justify-center p-6 relative z-10">
                <div className="bg-card text-card-foreground shadow-2xl rounded-lg p-8 space-y-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 z-0" />
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold text-center mb-6">Đăng nhập tới hệ thống quản lý</h2>
                        {error && (
                            <Alert variant="destructive" className="mb-4">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="numberPhone" className="text-sm font-medium">
                                    Số điện thoại
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="numberPhone"
                                        type="number"
                                        placeholder="Nhập số điện thoại"
                                        value={numberPhone}
                                        onChange={(e) => setNumberPhone(e.target.value)}
                                        required
                                        className="pl-10"
                                    />
                                    <PhoneCallIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-medium">
                                    Mật khẩu
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Nhập mật khẩu"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="pl-10 pr-10"
                                    />
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                                        onClick={togglePasswordVisibility}
                                        aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                            <Button type="submit" className="w-full relative overflow-hidden group" disabled={isLoading}>
                                {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />} {/* Loader icon */}
                                {isLoading ? 'Đăng nhập...' : 'Đăng nhập'}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
            <div className="hidden lg:flex flex-1 relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/30" />
                <FloatingShape />
                <FloatingShape delay={2} />
                <FloatingShape delay={4} />
                <div className="relative z-10 flex items-center justify-center h-full">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-center text-white p-8 max-w-lg"
                    >
                        <h2 className="text-4xl font-bold mb-6">Chào mừng trở lại hệ thống quản lý cắt tóc</h2>
                        <p className="text-xl mb-8">
                            Tham gia cùng hàng ngàn chuyên gia đã cách mạng hóa quy trình làm việc của họ với nền tảng tiên tiến
                            của chúng tôi.
                        </p>
                        <div className="flex justify-center space-x-8">
                            {[
                                { label: 'Người dùng hoạt động', value: '10k+' },
                                { label: 'Lịch đặt đã quản lý', value: '500k+' },
                                { label: 'Sự hài lòng của khách hàng', value: '98%' },
                            ].map((stat, index) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                                    className="text-center"
                                >
                                    <div className="text-4xl font-bold mb-2">{stat.value}</div>
                                    <div className="text-sm opacity-80">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
