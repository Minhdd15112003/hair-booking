'use client';

import Loading from '@/app/(manament)/loading';
import { findAllCombo } from '@/app/api/core/combo';
import { LoadingAction } from '@/components/customComponents/loadingAction';
import { Combocolumns } from '@/components/layouts/combo/columns';
import { ComboTable } from '@/components/layouts/combo/dataTable';
import React, { useEffect, useState } from 'react';

export default function ServicePage() {
    const [data, setData] = useState([]);
    const [loadingAction, setLoadingAction] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const data = await findAllCombo();
                setData(data.result);
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
            const data = await findAllCombo();
            setData(data.result);
        } catch (error) {
            setError(error instanceof Error ? error.message : String(error));
        } finally {
            setLoadingAction(false);
        }
    };

    if (loadingAction) return <LoadingAction isOpen={loadingAction} title="Đang sử lý" />;
    if (loading) return <Loading />;
    if (error) return <div>Error: {error}</div>;

    return <ComboTable columns={Combocolumns} data={data} onSuccess={handleDataChange}></ComboTable>;
}
