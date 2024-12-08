import React, { useState, useEffect } from "react";
import {
  useReactTable,
  SortingState,
  VisibilityState,
  RowSelectionState,
  PaginationState,
  getCoreRowModel,
} from "@tanstack/react-table";
import axiosInstance from "@/lib/axiosInstance";
import DataTableToolbar from "./DataTableToolbar";
import DataTable from "./DataTable";
import DataTablePagination from "./DataTablePagination";
import DataTableColumnHeader from "./DataTableColumnHeader";
import style from "@/pages/app/inquires/overview/inquire.module.css";
import { ColumnDef } from "@tanstack/react-table";

interface ProspectiveCustomer {
  id: string;
  form_of_address: string;
  firstname: string;
  lastname: string;
  category: string;
  email: string;
  tel: string;
  date: string;
  portal: "Immowelt" | "Immo-Scout" | "Kleinanzeigen";
  is_read: boolean;
}

interface ColumnMeta {
  headerText?: string;
}

export type CustomColumnDef<TData, TValue = unknown> = ColumnDef<TData, TValue> & {
  meta?: ColumnMeta;
};

interface DataTableComponentProps {
  realEstateId: string;
}

export default function DataTableComponent({ realEstateId }: DataTableComponentProps) {
  const [data, setData] = useState<ProspectiveCustomer[]>([]); 
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalItems, setTotalItems] = useState<number>(0);

  const [sorting, setSorting] = useState<SortingState>([
    { id: 'date', desc: true },
  ]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    email: false,
    tel: false,
  });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [isReadFilter, setIsReadFilter] = useState<string>("all");
  const [portalFilter, setPortalFilter] = useState<string>("all");
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns = React.useMemo<CustomColumnDef<ProspectiveCustomer>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Name" />
        ),
        cell: ({ row }) =>
          `${row.original.firstname} ${row.original.lastname}`,
        meta: { headerText: "Name" },
      },
      {
        accessorKey: "category",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Kategorie" />
        ),
        cell: ({ row }) => {
          const category = row.original.category;
          // const maxLength = 50;
          // const truncatedText = text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
          return category;
        },
        meta: { headerText: "Text" },
      },
      {
        accessorKey: "email",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Email" />
        ),
        meta: { headerText: "Email" },
      },
      {
        accessorKey: "tel",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Telefon" />
        ),
        meta: { headerText: "Telefon" },
      },
      {
        accessorKey: "portal",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Portal" />
        ),
        meta: { headerText: "Portal" },
      },
      {
        accessorKey: "is_read",
        header: "",
        cell: ({ row }) =>
          row.original.is_read ? "-" : <strong>Neu</strong>,
        meta: { headerText: "Gelesen" },
      },
      {
        accessorKey: "date",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Datum" />
        ),
        cell: ({ row }) =>
          new Date(row.original.date).toLocaleDateString(),
        meta: { headerText: "Datum" },
      },
    ],
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      const { pageIndex, pageSize } = pagination;

      const params = new URLSearchParams();

      params.append('page', (pageIndex + 1).toString());
      params.append('page_size', pageSize.toString());

      // Filter hinzufügen
      if (isReadFilter !== 'all') {
        params.append('is_read', isReadFilter);
      }

      if (portalFilter !== 'all') {
        params.append('portal', portalFilter);
      }

      if (globalFilter) {
        params.append('name', globalFilter);
      }

      // Sortierung hinzufügen
      if (sorting.length > 0) {
        const sort = sorting[0];
        const sortField = sort.id;
        const sortOrder = sort.desc ? '-' : '';
        params.append('ordering', `${sortOrder}${sortField}`);
      }

      try {
        const response = await axiosInstance.get(`/feedback/inquire/${realEstateId}/`, {
          params: params,
        });
        const result = response.data;

        setData(result.results);
        setTotalItems(result.count);

        setIsLoading(false);
      } catch (error) {
        console.error("Fehler beim Abrufen der Daten:", error);
        setIsLoading(false);
      }
    };

    if (realEstateId) {
      fetchData();
    }
  }, [realEstateId, pagination, sorting, isReadFilter, portalFilter, globalFilter]);

  const table = useReactTable({
    data,
    columns,
    manualPagination: true,
    pageCount: Math.ceil(totalItems / pagination.pageSize),
    manualSorting: true,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full space-y-4">
      <DataTableToolbar
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        isReadFilter={isReadFilter}
        setIsReadFilter={setIsReadFilter}
        portalFilter={portalFilter}
        setPortalFilter={setPortalFilter}
        setSorting={setSorting}
        setPagination={setPagination}
        table={table}
      />
      <DataTable
        isLoading={isLoading}
        table={table}
        style={style}
      />
      <DataTablePagination
        table={table}
        totalItems={totalItems}
        pagination={pagination}
        setPagination={setPagination}
      />
    </div>
  );
}
