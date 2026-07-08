'use client';

import React, { useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { CalendarDateRangePicker } from '@/components/ui/components-ui-calendar-date-range-picker';
import { Overview } from '@/components/analytics/Overview';
import { Analytics } from '@/components/analytics/Analytics';
import { set } from 'date-fns';

export default function DetailedDashboard() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const [viewType, setViewType] = useState<'all' | 'registered' | 'guest'>('all');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/analysis/over-view`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const result = await response.json();
                setData(result);
            } catch (err: any) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    return (
        <main className="flex-1 space-y-4">
            <Tabs defaultValue="all" className="space-y-4">
                <TabsList>
                    <TabsTrigger
                        onClick={(e) => {
                            setViewType('all');
                        }}
                        value="all"
                    >
                        Tất cả{' '}
                    </TabsTrigger>
                    <TabsTrigger
                        onClick={(e) => {
                            setViewType('registered');
                        }}
                        value="registed"
                    >
                        Khách đăng ký{' '}
                    </TabsTrigger>
                    <TabsTrigger
                        onClick={(e) => {
                            setViewType('guest');
                        }}
                        value="guest"
                    >
                        Khách vãng lai{' '}
                    </TabsTrigger>
                </TabsList>
                <Overview viewType={viewType} loading={loading} error={error} data={data} />
                <Analytics viewType={viewType} loading={loading} error={error} data={data} />
            </Tabs>
        </main>
    );
}
