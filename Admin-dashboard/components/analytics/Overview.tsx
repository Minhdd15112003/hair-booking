'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Users, Activity } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function Overview({
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
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Tổng doanh thu */}
                <Card className="rounded-xl border bg-card text-card-foreground shadow">
                    <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                        <Skeleton className="tracking-tight text-sm font-medium w-1/2">
                            <div className="h-4 bg-default-200" />
                        </Skeleton>
                        <Skeleton className="h-4 w-4">
                            <div className="h-4 w-full bg-default-200" />
                        </Skeleton>
                    </div>
                    <div className="p-6 pt-0">
                        <Skeleton className="text-2xl font-bold">
                            <div className="h-8 bg-default-300" />
                        </Skeleton>
                    </div>
                </Card>

                {/* Doanh thu tháng này */}
                <Card className="rounded-xl border bg-card text-card-foreground shadow">
                    <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                        <Skeleton className="tracking-tight text-sm font-medium w-1/2">
                            <div className="h-4 bg-default-200" />
                        </Skeleton>
                        <Skeleton className="h-4 w-4">
                            <div className="h-4 w-full bg-default-200" />
                        </Skeleton>
                    </div>
                    <div className="p-6 pt-0">
                        <Skeleton className="text-2xl font-bold">
                            <div className="h-8 bg-default-300" />
                        </Skeleton>
                    </div>
                </Card>

                {/* Doanh thu hôm nay */}
                <Card className="rounded-xl border bg-card text-card-foreground shadow">
                    <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                        <Skeleton className="tracking-tight text-sm font-medium w-1/2">
                            <div className="h-4 bg-default-200" />
                        </Skeleton>
                        <Skeleton className="h-4 w-4">
                            <div className="h-4 w-full bg-default-200" />
                        </Skeleton>
                    </div>
                    <div className="p-6 pt-0">
                        <Skeleton className="text-2xl font-bold">
                            <div className="h-8 bg-default-300" />
                        </Skeleton>
                    </div>
                </Card>

                {/* Dịch vụ đang được làm */}
                <Card className="rounded-xl border bg-card text-card-foreground shadow">
                    <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                        <Skeleton className="tracking-tight text-sm font-medium w-1/2">
                            <div className="h-4 bg-default-200" />
                        </Skeleton>
                        <Skeleton className="h-4 w-4">
                            <div className="h-4 w-full bg-default-200" />
                        </Skeleton>
                    </div>
                    <div className="p-6 pt-0">
                        <Skeleton className="text-2xl font-bold">
                            <div className="h-8 bg-default-300" />
                        </Skeleton>
                    </div>
                </Card>
            </div>
        );
    if (error) return <p>Error loading data: {error.message}</p>;

    // Hàm định dạng số thành tiền tệ VND
    const formatCurrency = (value: any) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0);

    const overviewCards = data
        ? [
              {
                  title: 'Tổng doanh thu',
                  icon: DollarSign,
                  value: formatCurrency(data.total_revenue[viewType]),
              },
              {
                  title: 'Doanh thu tháng này',
                  icon: Users,
                  value: formatCurrency(data.this_month_revenue[viewType]),
              },
              {
                  title: 'Doanh thu hôm nay',
                  icon: DollarSign,
                  value: formatCurrency(data.today_evenue[viewType]),
              },
              {
                  title: 'Dịch vụ đang được làm',
                  icon: Activity,
                  value: `${data.total_pending_booking[viewType] || 0} Pending`,
              },
          ]
        : [];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {overviewCards.map((card, index) => (
                <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                        <card.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{card.value}</div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
