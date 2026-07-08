export const StatusBadge = ({ status }: { status: any }) => {
    switch (status) {
        case 'CANCELED':
            return (
                <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-600 ring-1 ring-inset ring-gray-500/10">
                    hủy
                </span>
            );
        case 'DELAYING':
            return (
                <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                    hoãn
                </span>
            );
        case 'CONFIRMED':
            return (
                <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                    xác nhận
                </span>
            );
        case 'COMPLETED':
            return (
                <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700 ring-1 ring-inset ring-blue-700/10">
                    hoàn thành
                </span>
            );
        case 'PENDING':
            return (
                <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
                    đang làm
                </span>
            );
        case 'UNCONFIRMED':
            return (
                <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-indigo-700/10">
                    chưa xác nhận
                </span>
            );
        default:
            return (
                <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                    unknown status
                </span>
            );
    }
};
