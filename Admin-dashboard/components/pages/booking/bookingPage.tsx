'use client';
import Loading from '@/app/(manament)/loading';
import { findAllBooking } from '@/app/api/core/booking';
import { LoadingAction } from '@/components/customComponents/loadingAction';
import { Bookingcolumns } from '@/components/layouts/booking/columns';
import { BookingTable } from '@/components/layouts/booking/dataTable';
import { convertUTCTimeToVietNam } from '@/utils';
import { set } from 'date-fns';
import { useEffect, useState } from 'react';

export default function BookingPage() {
    const [data, setData] = useState<any>([]);
    const [loadingAction, setLoadingAction] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedBooking, setselectedBooking] = useState<any>({});
    const [baseData, setbaseData] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await findAllBooking();
                setLoading(true);
                setData(data.result);
            } catch (error) {
                setError(error instanceof Error ? error.message : String(error));
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const handleDataChange = async (a?: any) => {
        if (a?.action == 'update-status') {
            const index = data.indexOf(data.find((item: any) => item.id == a.id)!);

            const newData = [...data];
            newData[index].status = a.status;
            setData(newData);

            console.log({ id: a.id, status: a.status });
        } else {
            // Cập nhật lại danh sách dịch vụ

            try {
                setLoadingAction(true);
                const data = await findAllBooking(); // Gọi lại API để lấy danh sách mới
                setData(data.result);
            } catch (error) {
                setError(error instanceof Error ? error.message : String(error));
            } finally {
                setLoadingAction(false);
            }
        }
    };

    useEffect(() => {
        const baseData = data.map((item: any) => {
            return {
                ...item,
                start_time: convertUTCTimeToVietNam(item.start_time),
                end_time: convertUTCTimeToVietNam(item.end_time),
            };
        });
        setbaseData(baseData);
    }, [data]);

    if (loadingAction) return <LoadingAction isOpen={loadingAction} title="Đang sử lý" />;
    if (loading) return <Loading />;
    if (error) return <div>Error: {error}</div>;

    return (
        <BookingTable
            edittingBooking={selectedBooking}
            setedittingBooking={setselectedBooking}
            data={baseData}
            columns={Bookingcolumns}
            onSuccess={handleDataChange}
        />
    );
}
