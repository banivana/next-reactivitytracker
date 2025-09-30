"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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

interface DateRange {
  from?: Date;
  to?: Date;
}

export default function DateRangePicker({ userId }: DateRangePickerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [dateRange, setDateRange] = useState<DateRange>({});
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Initialize dates from URL params
  useEffect(() => {
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    if (from || to) {
      const fromDate = from ? new Date(from) : null;
      const toDate = to ? new Date(to) : null;

      setStartDate(fromDate);
      setEndDate(toDate);
      setDateRange({
        from: fromDate || undefined,
        to: toDate || undefined,
      });
    }
  }, [searchParams]);

  const applyDateRange = () => {
    const params = new URLSearchParams(searchParams);

    if (startDate) {
      params.set("from", format(startDate, "yyyy-MM-dd"));
    } else {
      params.delete("from");
    }

    if (endDate) {
      params.set("to", format(endDate, "yyyy-MM-dd"));
    } else {
      params.delete("to");
    }

    // Update URL with new params
    const newUrl = `/dashboard/clients/${userId}/triggers?${params.toString()}`;
    router.push(newUrl);
    setIsOpen(false);

    // Update dateRange state
    setDateRange({
      from: startDate || undefined,
      to: endDate || undefined,
    });
  };

  const clearDates = () => {
    setStartDate(null);
    setEndDate(null);
    setDateRange({});
    const newUrl = `/dashboard/clients/${userId}/triggers`;
    router.push(newUrl);
    setIsOpen(false);
  };

  const onChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
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
              !dateRange.from && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "MMM dd, y")} -{" "}
                  {format(dateRange.to, "MMM dd, y")}
                </>
              ) : (
                format(dateRange.from, "MMM dd, y")
              )
            ) : (
              <span>Date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <div className="p-3">
            <DatePicker
              selected={startDate}
              onChange={onChange}
              startDate={startDate}
              endDate={endDate}
              selectsRange
              monthsShown={2}
              maxDate={new Date()}
              inline
              calendarClassName="border-0 shadow-none"
            />
            <div className="flex items-center justify-between border-t border-border pt-3 mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setStartDate(null);
                  setEndDate(null);
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
                    setStartDate(dateRange.from || null);
                    setEndDate(dateRange.to || null);
                    setIsOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={applyDateRange}
                  disabled={!startDate}
                >
                  Apply
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {dateRange.from && (
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
