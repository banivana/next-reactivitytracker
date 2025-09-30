"use client";

import * as React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { cn } from "@/lib/utils";

export interface CalendarProps {
  className?: string;
  selected?: Date;
  onSelect?: (date: Date | null) => void;
  disabled?: (date: Date) => boolean;
}

function Calendar({
  className,
  selected,
  onSelect,
  disabled,
  ...props
}: CalendarProps) {
  return (
    <div className={cn("p-3", className)}>
      <DatePicker
        selected={selected}
        onChange={(date: Date | null) => onSelect?.(date)}
        inline
        calendarClassName="border-0 shadow-none"
        filterDate={disabled ? (date) => !disabled(date) : undefined}
        {...props}
      />
    </div>
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
