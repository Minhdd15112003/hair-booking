'use client';

import Loading from '@/app/(manament)/loading';
import { findAllStylist } from '@/app/api/core/stylist';

import { Stylistcolumns } from '@/components/layouts/stylist/columns';
import { StylistTable } from '@/components/layouts/stylist/dataTable';
import { TStylistResponse } from '@/app/api/types/stylist';
import React, { useEffect, useState } from 'react';
import { LoadingAction } from '@/components/customComponents/loadingAction';

export default function StylistPage() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingAction, setLoadingAction] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await findAllStylist();

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
            const data = await findAllStylist();
            setData(data.data);
        } catch (error) {
            setError(error instanceof Error ? error.message : String(error));
        } finally {
            setLoadingAction(false);
        }
    };

    if (loading) return <Loading />;
    if (loadingAction) return <LoadingAction isOpen={loadingAction} title="Đang sử lý" />;
    if (error) return <div>Error: {error}</div>;

    return <StylistTable columns={Stylistcolumns} data={data} onSuccess={handleDataChange} />;
}
