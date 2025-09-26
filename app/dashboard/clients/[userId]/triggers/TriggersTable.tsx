"use client";

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { useState, useMemo } from "react";
import { TriggerIcon } from "@/app/components/dashboard/TriggerIcon";
import { MultiSelect } from "@/components/ui/multi-select";

type Event = {
  id: number;
  created_at: string;
  user_id: string;
  date: string;
  trigger_type: string;
  level_of_reaction: string;
  description: string;
  location: string;
  time_of_day?: string;
};

interface TriggersTableProps {
  triggers: Event[];
}

const columnHelper = createColumnHelper<Event>();

export default function TriggersTable({ triggers }: TriggersTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedReactions, setSelectedReactions] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

  const reactionOptions = [
    {
      label: "Green",
      value: "green",
      color: "bg-green-100 text-green-800 border-green-200",
    },
    {
      label: "Yellow",
      value: "yellow",
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    },
    {
      label: "Red",
      value: "red",
      color: "bg-red-100 text-red-800 border-red-200",
    },
  ];

  // Get unique locations from triggers data
  const locationOptions = useMemo(() => {
    const uniqueLocations = Array.from(
      new Set(triggers.map((trigger) => trigger.location).filter(Boolean))
    ).sort();

    return uniqueLocations.map((location) => ({
      label: location,
      value: location,
    }));
  }, [triggers]);

  // Filter triggers based on selected reactions and locations
  const filteredTriggers = useMemo(() => {
    let filtered = triggers;

    // Filter by reactions
    if (selectedReactions.length > 0) {
      filtered = filtered.filter((trigger) =>
        selectedReactions.includes(trigger.level_of_reaction)
      );
    }

    // Filter by locations
    if (selectedLocations.length > 0) {
      filtered = filtered.filter((trigger) =>
        selectedLocations.includes(trigger.location)
      );
    }

    return filtered;
  }, [triggers, selectedReactions, selectedLocations]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return "-";
    return timeString;
  };

  const getReactionBadgeColor = (reaction: string) => {
    switch (reaction) {
      case "green":
        return "bg-green-100 text-green-800 border-green-200";
      case "yellow":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "red":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor("date", {
        header: "Date",
        cell: (info) => (
          <div className="whitespace-nowrap min-w-[100px]">
            {formatDate(info.getValue())}
          </div>
        ),
        sortingFn: "datetime",
      }),
      columnHelper.accessor("time_of_day", {
        header: "Time",
        cell: (info) => formatTime(info.getValue()),
      }),
      columnHelper.accessor("location", {
        header: "Location",
        cell: (info) => (
          <div className="max-w-xs break-words">{info.getValue() || "-"}</div>
        ),
      }),
      columnHelper.accessor("trigger_type", {
        header: "Trigger",
        cell: (info) => (
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2">
              <TriggerIcon
                triggerType={info.getValue()}
                reactionLevel={info.row.original.level_of_reaction}
                size={24}
              />
              <span className="text-sm text-gray-700 capitalize">
                {info.getValue()}
              </span>
            </div>
          </div>
        ),
      }),
      columnHelper.accessor("level_of_reaction", {
        header: "Reaction",
        cell: (info) => (
          <div className="flex justify-center">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getReactionBadgeColor(
                info.getValue()
              )}`}
            >
              <div
                className={`w-2 h-2 rounded-full mr-1.5 ${
                  info.getValue() === "green"
                    ? "bg-green-500"
                    : info.getValue() === "yellow"
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
              />
              {info.getValue().charAt(0).toUpperCase() +
                info.getValue().slice(1)}
            </span>
          </div>
        ),
      }),
      columnHelper.accessor("description", {
        header: "Description",
        cell: (info) => (
          <div className="max-w-sm break-words">{info.getValue() || "-"}</div>
        ),
      }),
    ],
    []
  );

  const table = useReactTable({
    data: filteredTriggers,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 20,
      },
    },
  });

  if (triggers.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        No trigger events found for this client.
      </div>
    );
  }

  if (
    filteredTriggers.length === 0 &&
    (selectedReactions.length > 0 || selectedLocations.length > 0)
  ) {
    return (
      <div className="p-8 text-center text-gray-500">
        No trigger events found matching the selected filters.
        <div className="mt-2">
          <button
            onClick={() => {
              setSelectedReactions([]);
              setSelectedLocations([]);
            }}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Clear all filters
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and controls */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search triggers..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <MultiSelect
            options={reactionOptions}
            selected={selectedReactions}
            onChange={setSelectedReactions}
            placeholder="Filter by reactions..."
            className="w-64"
          />
          <MultiSelect
            options={locationOptions}
            selected={selectedLocations}
            onChange={setSelectedLocations}
            placeholder="Filter by locations..."
            className="w-64"
          />
        </div>
        <div className="text-sm text-gray-600">
          Showing {table.getRowModel().rows.length} of {filteredTriggers.length}{" "}
          triggers
          {(selectedReactions.length > 0 || selectedLocations.length > 0) && (
            <span className="text-gray-500 ml-1">
              (filtered from {triggers.length} total)
            </span>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="text-left text-sm font-medium text-gray-500 px-6 py-3 cursor-pointer hover:bg-gray-100"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-2">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      {{
                        asc: " 🔼",
                        desc: " 🔽",
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4 text-sm text-gray-900">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            {"<<"}
          </button>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            {"<"}
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            {">"}
          </button>
          <button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            {">>"}
          </button>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span>
            Page{" "}
            <strong>
              {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </strong>
          </span>
          <span>|</span>
          <span>Go to page:</span>
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
          />
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
            className="px-2 py-1 border border-gray-300 rounded"
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
