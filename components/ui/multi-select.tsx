"use client";

import * as React from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface MultiSelectOption {
  label: string;
  value: string;
  color?: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select options...",
  className,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const handleRemove = (value: string, event?: React.MouseEvent) => {
    event?.preventDefault();
    event?.stopPropagation();
    onChange(selected.filter((item) => item !== value));
  };

  const selectedOptions = options.filter((option) =>
    selected.includes(option.value)
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "justify-between text-left font-normal",
            className,
            !selectedOptions.length && "text-muted-foreground"
          )}
        >
          <div className="flex flex-wrap gap-1 flex-1">
            {selectedOptions.length > 0 ? (
              selectedOptions.map((option) => (
                <span
                  key={option.value}
                  className={cn(
                    "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border",
                    option.color || "bg-gray-100 text-gray-800 border-gray-200"
                  )}
                >
                  {option.color && (
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full",
                        option.value === "green" && "bg-green-500",
                        option.value === "yellow" && "bg-yellow-500",
                        option.value === "red" && "bg-red-500"
                      )}
                    />
                  )}
                  {option.label}
                  <X
                    className="h-3 w-3 cursor-pointer hover:bg-black/10 rounded"
                    onClick={(event) => handleRemove(option.value, event)}
                  />
                </span>
              ))
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <div className="max-h-64 overflow-auto">
          {options.map((option) => {
            const isSelected = selected.includes(option.value);
            return (
              <div
                key={option.value}
                className="flex items-center gap-2 px-4 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
                onClick={() => handleSelect(option.value)}
              >
                <div
                  className={cn(
                    "flex h-4 w-4 items-center justify-center rounded border border-primary",
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "opacity-50 [&_svg]:invisible"
                  )}
                >
                  <Check className="h-3 w-3" />
                </div>
                <div className="flex items-center gap-2">
                  {option.color && (
                    <div
                      className={cn(
                        "w-3 h-3 rounded-full",
                        option.value === "green" && "bg-green-500",
                        option.value === "yellow" && "bg-yellow-500",
                        option.value === "red" && "bg-red-500"
                      )}
                    />
                  )}
                  {option.label}
                </div>
              </div>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
