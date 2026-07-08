'use client';

import * as React from 'react';
import { useState } from 'react';
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
import BookingForm from './formData';
import { findAllCombo } from '@/app/api/core/combo';
import { findAllCustomer } from '@/app/api/core/customer';
import { findAllStylistWorking } from '@/app/api/core/stylist';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import BookingUnknownCustomerForm from './formUnknownCustomer';
import { set } from 'date-fns';
import BookingDetailsDrawer from '@/components/layouts/booking/detailDrawer';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DataTableProps<TBookingResponse, TValue> {
    columns: ColumnDef<TBookingResponse, TValue>[];
    data: TBookingResponse[];
    onSuccess?: (a?: any) => void;
    edittingBooking: any;
    setedittingBooking: (a: any) => void;
}

export function BookingTable<TBookingResponse, TValue>({ columns, data, onSuccess }: DataTableProps<TBookingResponse, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    // const [editingBooking, setEditingBooking] = useState({});

    const [selectedBooking, setselectedBooking] = useState<any>({});

    const table = useReactTable({
        data: data || [],
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
        initialState: {
            pagination: {
                pageSize: 50, // Set default page size to 50
            },
        },
    });

    const [combos, setCombos] = React.useState([]);
    const [customers, setCustomers] = React.useState([]);
    const [stylists, setStylists] = React.useState([]);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const [combos, customers, stylists] = await Promise.all([
                    findAllCombo(),
                    findAllCustomer(),
                    findAllStylistWorking(),
                ]);
                setCombos(combos.result);
                setCustomers(customers.data);
                setStylists(stylists);
            } catch (error) {
                console.error('booking fetchData error ', error);
            }
        };

        fetchData();
    }, []);

    return (
        <Drawer>
        <div className="w-full space-y-2">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
            <Input
                placeholder="Tìm khách hàng..."
                value={(table.getColumn('customer')?.getFilterValue() as string) ?? ''}
                onChange={(event) => table.getColumn('customer')?.setFilterValue(event.target.value)}
                className="w-full sm:max-w-[200px]"
              />
              <Input
                placeholder="Tìm combo..."
                value={(table.getColumn('combo')?.getFilterValue() as string) ?? ''}
                onChange={(event) => table.getColumn('combo')?.setFilterValue(event.target.value)}
                className="w-full sm:max-w-[200px]"
              />
            <div className="flex-1 space-y-2 sm:space-y-0 sm:space-x-2">
            
            </div>
            
            <div className="flex space-x-2">
              <BookingForm combos={combos} customers={customers} stylists={stylists} onSuccess={onSuccess} />
              <BookingUnknownCustomerForm combos={combos} stylists={stylists} onSuccess={onSuccess} />
            </div>
          </div>
    
          <div className="rounded-md border">
            <ScrollArea className="h-[calc(100vh-300px)]">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <DrawerTrigger key={row.id} asChild>
                        <TableRow
                          onClick={() => setselectedBooking(row.original)}
                          className="cursor-pointer select-none"
                          data-state={row.getIsSelected() && 'selected'}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                          ))}
                        </TableRow>
                      </DrawerTrigger>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-24 text-center">
                        Hiện tại không có dữ liệu
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
    
          <div className="flex flex-col items-center justify-between space-y-4 py-4 sm:flex-row sm:space-y-0">
            <div className="flex items-center space-x-2">
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
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
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium text-muted-foreground">Xem</p>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value))
                }}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={table.getState().pagination.pageSize} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm font-medium text-muted-foreground">mục</p>
            </div>
          </div>
        </div>
        <DrawerContent>
          <div className="mx-auto w-full max-w-4xl p-6">
            <DrawerHeader>
              <DrawerTitle>{selectedBooking?.combo?.name}</DrawerTitle>
              <DrawerDescription>{selectedBooking?.combo?.description}</DrawerDescription>
            </DrawerHeader>
            <BookingDetailsDrawer booking={selectedBooking} onSuccess={onSuccess} />
          </div>
        </DrawerContent>
      </Drawer>
    );
}
