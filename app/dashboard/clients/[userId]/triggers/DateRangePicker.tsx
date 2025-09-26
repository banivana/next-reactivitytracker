"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { DayPicker, DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateRangePickerProps {
  userId: string;
}

export default function DateRangePicker({ userId }: DateRangePickerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [date, setDate] = useState<DateRange | undefined>();
  const [tempDate, setTempDate] = useState<DateRange | undefined>();
  const [isOpen, setIsOpen] = useState(false);

  // Initialize dates from URL params
  useEffect(() => {
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    if (from || to) {
      const dateRange = {
        from: from ? new Date(from) : undefined,
        to: to ? new Date(to) : undefined,
      };
      setDate(dateRange);
      setTempDate(dateRange);
    }
  }, [searchParams]);

  const handleDateSelect = (range: DateRange | undefined) => {
    setTempDate(range);
  };

  const applyDateRange = () => {
    setDate(tempDate);

    const params = new URLSearchParams(searchParams);

    if (tempDate?.from) {
      params.set("from", format(tempDate.from, "yyyy-MM-dd"));
    } else {
      params.delete("from");
    }

    if (tempDate?.to) {
      params.set("to", format(tempDate.to, "yyyy-MM-dd"));
    } else {
      params.delete("to");
    }

    // Update URL with new params
    const newUrl = `/dashboard/clients/${userId}/triggers?${params.toString()}`;
    router.push(newUrl);
    setIsOpen(false);
  };

  const clearDates = () => {
    setDate(undefined);
    setTempDate(undefined);
    const newUrl = `/dashboard/clients/${userId}/triggers`;
    router.push(newUrl);
    setIsOpen(false);
  };

  return (
    <div className="flex items-center gap-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[260px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "MMM dd, y")} -{" "}
                  {format(date.to, "MMM dd, y")}
                </>
              ) : (
                format(date.from, "MMM dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <div className="p-3">
            <DayPicker
              mode="range"
              defaultMonth={tempDate?.from || date?.from}
              selected={tempDate}
              onSelect={handleDateSelect}
              numberOfMonths={2}
              disabled={(date) => date > new Date()}
              className="rdp"
              classNames={{
                months:
                  "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-4",
                caption: "flex justify-center pt-1 relative items-center",
                caption_label: "text-sm font-medium",
                nav: "space-x-1 flex items-center",
                nav_button:
                  "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 inline-flex items-center justify-center rounded-md border border-input bg-background text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse space-y-1",
                head_row: "flex",
                head_cell:
                  "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                row: "flex w-full mt-2",
                cell: "h-9 w-9 text-center text-sm p-0 relative hover:bg-accent rounded-md",
                day: "h-9 w-9 p-0 font-normal hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
                day_selected:
                  "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                day_today: "bg-accent text-accent-foreground",
                day_outside: "text-muted-foreground opacity-50",
                day_disabled: "text-muted-foreground opacity-50",
                day_range_middle: "bg-accent text-accent-foreground",
                day_range_start: "bg-primary text-primary-foreground",
                day_range_end: "bg-primary text-primary-foreground",
                day_hidden: "invisible",
              }}
              components={{
                IconLeft: () => <span>&lt;</span>,
                IconRight: () => <span>&gt;</span>,
              }}
            />
            <div className="flex items-center justify-between border-t border-border pt-3 mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setTempDate(undefined);
                  applyDateRange();
                }}
              >
                Clear
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setTempDate(date);
                    setIsOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={applyDateRange}
                  disabled={!tempDate?.from || !tempDate?.to}
                >
                  Apply
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {date && (
        <Button
          onClick={clearDates}
          variant="outline"
          size="sm"
          className="text-muted-foreground"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
