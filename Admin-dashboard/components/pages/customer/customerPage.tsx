'use client';

import Loading from '@/app/(manament)/loading';
import { findAllCustomer } from '@/app/api/core/customer';

import { TCustomerResponse } from '@/app/api/types/customer';
import { LoadingAction } from '@/components/customComponents/loadingAction';
import { Customercolumns } from '@/components/layouts/customer/columns';
import { CustomerTable } from '@/components/layouts/customer/dataTable';
import React, { useEffect, useState } from 'react';

export default function CustomerPage() {
    const [data, setData] = useState<TCustomerResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [loadingAction, setLoadingAction] = useState(false);
    useEffect(() => {
        async function fetchData() {
            try {
                const data = await findAllCustomer();

                setData(data.data);
            } catch (error) {
                setError(error instanceof Error ? error.message : String(error));
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const handleDataChange = async () => {
        try {
            setLoadingAction(true);
            const data = await findAllCustomer();
            setData(data.data);
        } catch (error) {
            setError(error instanceof Error ? error.message : String(error));
        } finally {
            setLoadingAction(false);
        }
    };

    if (loadingAction) return <LoadingAction isOpen={loadingAction} title="Đang sử lý" />;
    if (loading) return <Loading />;
    if (error) return <div>Error: {error}</div>;

    return <CustomerTable columns={Customercolumns} data={data} onSuccess={handleDataChange}></CustomerTable>;
}
