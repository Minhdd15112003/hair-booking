/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { Dialog, DialogTrigger } from '@radix-ui/react-dialog';
import { TBookingResponse } from '@/app/api/types/booking';
import { StatusBadge } from '@/components/ui/status-badge';
import { convertToDisplayTime } from '@/utils';

export const Bookingcolumns: ColumnDef<TBookingResponse>[] = [
    {
        accessorKey: 'index',
        header: 'STT',
        cell: ({ row }) => <div className="font-bold">{row.index + 1}</div>,
    },

    {
        accessorKey: 'customer',
        header: 'Khách hàng',
        cell: ({ row }) => {
            const customer = row.original.customer?.full_name || row.original.full_name;
            return <div className="capitalize">{customer}</div>;
        },
        filterFn: (row, id, value) => {
            return row.original.customer?.full_name.toLowerCase().includes(value.toLowerCase().trim());
        },
    },
    {
        accessorKey: 'combo',
        header: 'Combo',
        cell: ({ row }) => {
            const comboName = row.original.combo?.name || 'Không có';
            return <div className="capitalize">{comboName}</div>;
        },
        filterFn: (row, id, value) => {
            return row.original.combo.name.toLowerCase().includes(value.toLowerCase().trim());
        },
    },
    {
        accessorKey: 'start_time',
        header: 'Thời gian bắt đầu',
        cell: ({ row }) => {
            const startTime = new Date(row.getValue('start_time')).toISOString();
            return <div className="capitalize">{convertToDisplayTime(startTime)}</div>;
            // <div className="capitalize">{methgminhnguyen}</div>;
        },
    },
    {
        accessorKey: 'end_time',
        header: 'Thời gian kết thúc',
        cell: ({ row }) => {
            const endTime = new Date(row.getValue('end_time')).toISOString();
            return <div className="capitalize">{convertToDisplayTime(endTime)}</div>;
            // <div className="capitalize">{methgminhnguyen}</div>;
        },
    },
    {
        accessorKey: 'status',
        header: 'Trạng thái',
        cell: ({ row }) => {
            const status: any = row.getValue('status');
            // console.log(status);
            return <StatusBadge status={status} />;
        },
    },
    {
        accessorKey: 'total_price',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Tổng tiền
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        // cell: ({ row }) => <div className="lowercase">{row.getValue("total_price")}</div>,
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue('total_price'));

            // Format the amount as a dollar amount
            const formatted = new Intl.NumberFormat('VND', {
                style: 'currency',
                currency: 'VND',
            }).format(amount);

            return <div className="ml-4">{formatted}</div>;
        },
    },
    {
        accessorKey: 'total_time',
        header: 'Tổng thời gian',
        cell: ({ row }) => <div className="capitalize">{row.getValue('total_time')} phút</div>,
    },

    {
        accessorKey: 'actions',
        header: () => <div className="">Hành động</div>,
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
            return (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="size-6"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z"
                    />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
            );
        },
    },
];
