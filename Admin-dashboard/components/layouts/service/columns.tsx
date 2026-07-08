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
import { DetailsDialog } from './detailDialog';
import { Dialog, DialogTrigger } from '@radix-ui/react-dialog';
import { TServiceResponse } from '@/app/api/types/service';

export const Servicecolumns: ColumnDef<TServiceResponse>[] = [
    {
        accessorKey: 'index',
        header: 'STT',
        cell: ({ row }) => <div className="font-bold">{row.index + 1}</div>,
    },
    {
        accessorKey: 'name',
        header: 'Tên dịch vụ',
        cell: ({ row }) => <div className="capitalize">{row.getValue('name')}</div>,
    },
    {
        accessorKey: 'price',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Giá
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        // cell: ({ row }) => <div className="lowercase">{row.getValue("price")}</div>,
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue('price'));

            // Format the amount as a dollar amount
            const formatted = new Intl.NumberFormat('VND', {
                style: 'currency',
                currency: 'VND',
            }).format(amount);

            return <div className="ml-4">{formatted}</div>;
        },
    },
    {
        accessorKey: 'time',
        header: 'Thời gian',
        cell: ({ row }) => <div className="capitalize">{row.getValue('time') ?? 0} phút</div>,
    },

    {
        accessorKey: 'description',
        header: () => <div className="">Mô tả</div>,
        cell: ({ row }) => <div className="lowercase">{row.getValue('description')}</div>,
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
            // const service = row.original;
            // return (
            //     <DropdownMenu>
            //         <DropdownMenuTrigger asChild>
            //             <Button variant="ghost" className="h-8 w-8 p-0">
            //                 <span className="sr-only">Open menu</span>
            //                 <MoreHorizontal className="h-4 w-4" />
            //             </Button>
            //         </DropdownMenuTrigger>
            //         <DropdownMenuContent align="end">
            //             <DropdownMenuLabel>Hành động</DropdownMenuLabel>
            //             <DropdownMenuItem onClick={() => navigator.clipboard.writeText(service.id)}>
            //                 Sao chép ID
            //             </DropdownMenuItem>
            //             <DropdownMenuSeparator />
            //             <Dialog>
            //                 <DialogTrigger asChild>
            //                     <Button variant="ghost">Chi tiết dịch vụ</Button>
            //                 </DialogTrigger>
            //                 <DetailsDialog product={service} />
            //             </Dialog>
            //         </DropdownMenuContent>
            //     </DropdownMenu>
            // );
        },
    },
];
