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
  const [selectedTriggerTypes, setSelectedTriggerTypes] = useState<string[]>(
    []
  );

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

  // Get unique trigger types from triggers data
  const triggerTypeOptions = useMemo(() => {
    const uniqueTriggerTypes = Array.from(
      new Set(triggers.map((trigger) => trigger.trigger_type).filter(Boolean))
    ).sort();

    return uniqueTriggerTypes.map((triggerType) => ({
      label: triggerType.charAt(0).toUpperCase() + triggerType.slice(1),
      value: triggerType,
    }));
  }, [triggers]);

  // Filter triggers based on selected reactions, locations, and trigger types
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

    // Filter by trigger types
    if (selectedTriggerTypes.length > 0) {
      filtered = filtered.filter((trigger) =>
        selectedTriggerTypes.includes(trigger.trigger_type)
      );
    }

    return filtered;
  }, [triggers, selectedReactions, selectedLocations, selectedTriggerTypes]);

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

  // Early return only if there are no triggers at all AND no filters are applied
  if (
    triggers.length === 0 &&
    selectedReactions.length === 0 &&
    selectedLocations.length === 0 &&
    selectedTriggerTypes.length === 0
  ) {
    return (
      <div className="p-8 text-center text-gray-500">
        No trigger events found for this client.
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
            placeholder="Search..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <MultiSelect
            options={reactionOptions}
            selected={selectedReactions}
            onChange={setSelectedReactions}
            placeholder="Reaction level"
            className="w-48"
          />
          <MultiSelect
            options={locationOptions}
            selected={selectedLocations}
            onChange={setSelectedLocations}
            placeholder="Location"
            className="w-48"
          />
          <MultiSelect
            options={triggerTypeOptions}
            selected={selectedTriggerTypes}
            onChange={setSelectedTriggerTypes}
            placeholder="Trigger type"
            className="w-48"
          />
        </div>
        <div className="text-sm text-gray-600">
          Showing {table.getRowModel().rows.length} of {filteredTriggers.length}{" "}
          triggers
          {(selectedReactions.length > 0 ||
            selectedLocations.length > 0 ||
            selectedTriggerTypes.length > 0) && (
            <div className="text-gray-500 ml-1">
              (filtered from {triggers.length} total)
            </div>
          )}
        </div>
      </div>

      {/* Applied Filters */}
      {(selectedReactions.length > 0 ||
        selectedLocations.length > 0 ||
        selectedTriggerTypes.length > 0) && (
        <div className="px-6 py-3 bg-gray-50 border-y border-gray-200">
          <div className="flex items-center gap-3 flex-wrap">
            {selectedReactions.map((reaction) => {
              const reactionOption = reactionOptions.find(
                (opt) => opt.value === reaction
              );
              return (
                <div
                  key={`reaction-${reaction}`}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${
                    reactionOption?.color ||
                    "bg-gray-100 text-gray-800 border-gray-200"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      reaction === "green"
                        ? "bg-green-500"
                        : reaction === "yellow"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                  />
                  <span>
                    {reaction.charAt(0).toUpperCase() + reaction.slice(1)}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedReactions((prev) =>
                        prev.filter((r) => r !== reaction)
                      );
                    }}
                    className="ml-1 hover:text-red-600 transition-colors"
                    aria-label={`Remove ${reaction} filter`}
                  >
                    ×
                  </button>
                </div>
              );
            })}
            {selectedLocations.map((location) => (
              <div
                key={`location-${location}`}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"
              >
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{location}</span>
                <button
                  onClick={() => {
                    setSelectedLocations((prev) =>
                      prev.filter((l) => l !== location)
                    );
                  }}
                  className="ml-1 hover:text-red-600 transition-colors"
                  aria-label={`Remove ${location} filter`}
                >
                  ×
                </button>
              </div>
            ))}
            {selectedTriggerTypes.map((triggerType) => (
              <div
                key={`trigger-${triggerType}`}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200"
              >
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>
                  {triggerType.charAt(0).toUpperCase() + triggerType.slice(1)}
                </span>
                <button
                  onClick={() => {
                    setSelectedTriggerTypes((prev) =>
                      prev.filter((t) => t !== triggerType)
                    );
                  }}
                  className="ml-1 hover:text-red-600 transition-colors"
                  aria-label={`Remove ${triggerType} filter`}
                >
                  ×
                </button>
              </div>
            ))}
            {(selectedReactions.length > 0 ||
              selectedLocations.length > 0 ||
              selectedTriggerTypes.length > 0) && (
              <button
                onClick={() => {
                  setSelectedReactions([]);
                  setSelectedLocations([]);
                  setSelectedTriggerTypes([]);
                }}
                className="text-xs text-gray-500 hover:text-gray-700 underline ml-2"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      )}

      {/* Show empty message when no filtered results, but still show filters above */}
      {filteredTriggers.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          {triggers.length === 0 ? (
            "No trigger events found for this client."
          ) : (
            <>No trigger events found matching the selected filters.</>
          )}
        </div>
      ) : (
        <>
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
                      <td
                        key={cell.id}
                        className="px-6 py-4 text-sm text-gray-900"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
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
        </>
      )}
    </div>
  );
}
