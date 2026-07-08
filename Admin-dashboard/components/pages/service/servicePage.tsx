'use client';

import { useState, useEffect } from 'react';
import { getListService } from '@/app/api/core/service';
import { ServiceTable } from '@/components/layouts/service/dataTable';
import { Servicecolumns } from '@/components/layouts/service/columns';
import Loading from '@/app/(manament)/loading';
import { LoadingAction } from '@/components/customComponents/loadingAction';

export default function ServicePage() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingAction, setLoadingAction] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getListService();
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
        setLoadingAction(true);
        try {
            const data = await getListService();
            setData(data.result);
        } catch (error) {
            setError(error instanceof Error ? error.message : String(error));
        } finally {
            setLoadingAction(false);
        }
    };

    if (loading) return <Loading />;
    if (loadingAction) return <LoadingAction isOpen={loadingAction} title="Đang sử lý" />;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            {/* Truyền handleDataChange vào ServiceTable */}
            <ServiceTable columns={Servicecolumns} data={data} onSuccess={handleDataChange} />
        </div>
    );
}
