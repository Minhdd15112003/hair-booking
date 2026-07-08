import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { log } from 'console';
import { Skeleton } from '@/components/ui/skeleton';
import { StatusBadge } from '@/components/ui/status-badge';
import { convertUTCTimeToVietNam } from '@/utils';
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';

type ChartKey = {
    registed: string;
    guest: string;
    month: string;
};

const chartConfig = {
    registed: {
        label: 'Khách đăng ký',
        color: '#2563eb',
    },
    guest: {
        label: 'Khách vãng lai',
        color: '#60a5fa',
    },
} satisfies ChartConfig;
export function Analytics({
    loading,
    error,
    data,
    viewType,
}: {
    loading: boolean;
    error: Error | null;
    data: any;
    viewType: 'all' | 'registered' | 'guest';
}) {
    if (loading)
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="rounded-xl border bg-card text-card-foreground shadow col-span-4">
                    <div className="flex flex-col space-y-1.5 p-6">
                        <div className="font-semibold leading-none tracking-tight">Overview</div>
                    </div>
                    <div className="p-6 pt-0 pl-2">
                        <Skeleton className="h-[400px] rounded-lg">
                            <div className="h-full rounded-lg bg-default-300" />
                        </Skeleton>
                    </div>
                </div>

                <div className="rounded-xl border bg-card text-card-foreground shadow col-span-3">
                    <div className="flex flex-col space-y-1.5 p-6">
                        <div className="font-semibold leading-none tracking-tight">Các đơn trong hôm nay</div>
                        <div className="text-sm text-muted-foreground">
                            Tổng số đơn đặt:{' '}
                            <Skeleton className="inline-block w-1/3 rounded-lg">
                                <div className="h-3 w-full bg-default-200" />
                            </Skeleton>
                        </div>
                    </div>
                    <div className="p-6 pt-0">
                        <div className="space-y-4">
                            {[...Array(3)].map((_, index) => (
                                <div className="flex items-center" key={index}>
                                    <Skeleton className="relative flex shrink-0 overflow-hidden rounded-full h-9 w-9">
                                        <div className="h-full w-full rounded-full bg-default-300" />
                                    </Skeleton>
                                    <div className="ml-4 space-y-1">
                                        <Skeleton className="h-4 w-1/2 rounded-lg">
                                            <div className="h-4 w-full bg-default-200" />
                                        </Skeleton>
                                        <Skeleton className="h-3 w-3/4 rounded-lg">
                                            <div className="h-3 w-full bg-default-200" />
                                        </Skeleton>
                                        <Skeleton className="h-3 w-2/5 rounded-lg">
                                            <div className="h-3 w-full bg-default-300" />
                                        </Skeleton>
                                    </div>
                                    <Skeleton className="ml-auto h-4 w-1/3 rounded-lg">
                                        <div className="h-4 w-full bg-default-300" />
                                    </Skeleton>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    if (error) return <p>Error loading data: {error.message}</p>;

    const chartData: ChartKey[] = data.chart;

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Biểu đồ doanh thu */}
            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                    <div className="h-[400px]">
                        <ChartContainer config={chartConfig} className="h-full w-full">
                            <BarChart accessibilityLayer data={chartData}>
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="month"
                                    tickLine={false}
                                    tickMargin={10}
                                    axisLine={false}
                                    tickFormatter={(value) => value.slice(0, 3)}
                                />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <ChartLegend content={<ChartLegendContent />} />
                                {(viewType === 'all' || viewType === 'registered') && (
                                    <Bar dataKey="registed" fill="var(--color-registed)" radius={4} />
                                )}
                                {(viewType === 'all' || viewType === 'guest') && (
                                    <Bar dataKey="guest" fill="var(--color-guest)" radius={4} />
                                )}
                            </BarChart>
                        </ChartContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Booking gần đây */}
            <Card className="col-span-3">
                <CardHeader>
                    <CardTitle>Các đơn đặt hôm nay</CardTitle>
                    <CardDescription>Tổng số đơn: {data.recent_bookings[viewType].length}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4 overflow-y-scroll h-[400px] pb-2">
                        {data.recent_bookings[viewType].map((booking: any, index: number) => {
                            const time = new Date(convertUTCTimeToVietNam(booking.start_time));

                            const hours = time.getHours().toString().padStart(2, '0');
                            const minutes = time.getMinutes().toString().padStart(2, '0');

                            const formattedTime = `${hours}:${minutes}`;
                            return (
                                <div className="flex items-center shadow-md p-4 border mx-4 rounded-3xl" key={index}>
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage src={booking.customer?.avatar || '/placeholder.svg'} alt="Avatar" />
                                        <AvatarFallback>{`B${index + 1}`}</AvatarFallback>
                                    </Avatar>
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            Khách hàng: <b>{booking.customer?.full_name || booking?.full_name}</b>
                                        </p>
                                        <p className="text-sm text-muted-foreground">Combo: {booking.combo?.name || 'N/A'}</p>
                                        <p className="text-sm text-muted-foreground">
                                            Tổng tiền:{' '}
                                            {booking.total_price ? `${booking.total_price.toLocaleString()} VND` : 'N/A'}
                                        </p>
                                        <div className="ml-auto text-sm">{`Vào lúc: ${formattedTime}`}</div>
                                    </div>
                                    {/* <div className="ml-auto font-medium">Status: {booking.status}</div> */}
                                    <div className="ml-auto">
                                        <StatusBadge status={booking.status} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
