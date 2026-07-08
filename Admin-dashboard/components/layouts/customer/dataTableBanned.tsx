'use client';

import { useState, useEffect } from 'react';
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';

import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { DetailsDialog } from './detailDialog';
import { DetailsDialogBanned } from './detailDialogBanned';

interface DataTableProps<TCustomerResponse, TValue> {
    columns: ColumnDef<TCustomerResponse, TValue>[];
    data: TCustomerResponse[];
    onSuccess?: () => void;
}

export function CustomerTableBanned<TCustomerResponse, TValue>({
    columns,
    data,
    onSuccess,
}: DataTableProps<TCustomerResponse, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});
    const [selectedCustomer, setselectedCustomer] = useState<any>({});
    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    return (
        <Dialog>
            <div className="w-full">
                <div className="flex items-center py-4">
                    <Input
                        placeholder="Tìm khách hàng theo tên..."
                        value={(table.getColumn('full_name')?.getFilterValue() as string) ?? ''}
                        onChange={(event) => table.getColumn('full_name')?.setFilterValue(event.target.value)}
                        className="max-w-sm"
                    />

                    <Input
                        placeholder="Tìm khách hàng theo SDT..."
                        value={(table.getColumn('phone_number')?.getFilterValue() as string) ?? ''}
                        onChange={(event) => table.getColumn('phone_number')?.setFilterValue(event.target.value)}
                        className="max-w-sm ml-3"
                    />
                    {/* <div className="ml-auto"><CustomerForm /></div> */}
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(header.column.columnDef.header, header.getContext())}
                                            </TableHead>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row, i) => {
                                    const customer = row.original;

                                    return (
                                        <DialogTrigger key={i} asChild>
                                            <TableRow
                                                onClick={() => {
                                                    setselectedCustomer(customer);
                                                }}
                                                className="anh-minh-deep cursor-pointer select-none"
                                                key={row.id}
                                                data-state={row.getIsSelected() && 'selected'}
                                            >
                                                {' '}
                                                {row.getVisibleCells().map((cell) => (
                                                    <TableCell key={cell.id}>
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        </DialogTrigger>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        Hiện tai không có dữ liệu.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div className="flex items-center justify-between space-x-2 py-4">
                    <div className="space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                            disabled={!table.getCanNextPage()}
                        >
                            <ChevronsRight className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="flex items-center justify-between space-x-2 py-4">
                        <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium  text-muted-foreground">Xem</p>
                            <select
                                className="h-8 w-14 rounded-md border border-input bg-background"
                                value={table.getState().pagination.pageSize}
                                onChange={(e) => {
                                    table.setPageSize(Number(e.target.value));
                                }}
                            >
                                {[10, 20, 30, 40, 50].map((pageSize) => (
                                    <option key={pageSize} value={pageSize}>
                                        {pageSize}
                                    </option>
                                ))}
                            </select>
                            <p className="text-sm font-medium  text-muted-foreground">mục</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-4 pb-0">
                <DetailsDialogBanned customer={selectedCustomer} onSuccess={onSuccess} />
            </div>
        </Dialog>
    );
}
