import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings2 } from "lucide-react";
import { Table as ReactTable } from "@tanstack/react-table";

interface DataTableToolbarProps {
  globalFilter: string;
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>;
  isReadFilter: string;
  setIsReadFilter: React.Dispatch<React.SetStateAction<string>>;
  portalFilter: string;
  setPortalFilter: React.Dispatch<React.SetStateAction<string>>;
  setSorting: React.Dispatch<React.SetStateAction<any>>;
  setPagination: React.Dispatch<React.SetStateAction<any>>;
  table: ReactTable<any>;
}

export default function DataTableToolbar({
  globalFilter,
  setGlobalFilter,
  isReadFilter,
  setIsReadFilter,
  portalFilter,
  setPortalFilter,
  setSorting,
  setPagination,
  table,
}: DataTableToolbarProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Name..."
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />

        <Select
          value={isReadFilter}
          onValueChange={(value) => setIsReadFilter(value)}
        >
          <SelectTrigger className="h-8 w-[150px]">
            <SelectValue placeholder="Gelesen" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Gelesen</SelectLabel>
              <SelectItem value="all">Alle</SelectItem>
              <SelectItem value="true">Gelesen</SelectItem>
              <SelectItem value="false">Ungelesen</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          value={portalFilter}
          onValueChange={(value) => setPortalFilter(value)}
        >
          <SelectTrigger className="h-8 w-[150px]">
            <SelectValue placeholder="Portal" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Portal</SelectLabel>
              <SelectItem value="all">Alle Portale</SelectItem>
              <SelectItem value="Immowelt">Immowelt</SelectItem>
              <SelectItem value="Immo-Scout">Immo-Scout</SelectItem>
              <SelectItem value="Kleinanzeigen">Kleinanzeigen</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        {(isReadFilter !== 'all' || portalFilter !== 'all' || globalFilter) && (
          <Button
            variant="ghost"
            onClick={() => {
              setIsReadFilter("all");
              setPortalFilter("all");
              setGlobalFilter("");
              setSorting([{ id: 'date', desc: true }]);
              setPagination({ pageIndex: 0, pageSize: 10 });
            }}
            className="h-8 px-2 lg:px-3"
          >
            Reset
          </Button>
        )}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto hidden h-8 lg:flex"
          >
            <Settings2 className="mr-2 h-4 w-4" />
            Ansicht
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[150px]">
          {table
            .getAllColumns()
            .filter(
              (column) =>
                typeof column.accessorFn !== "undefined" && column.getCanHide()
            )
            .map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) =>
                    column.toggleVisibility(!!value)
                  }
                >
                  {(column.columnDef.meta as any)?.headerText || column.id}
                </DropdownMenuCheckboxItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
