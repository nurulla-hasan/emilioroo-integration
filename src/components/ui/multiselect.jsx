"use client";

import React, { useState, useCallback } from "react";
import { X, Check, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

export function MultipleSelector({
  options,
  value,
  onChange,
  placeholder,
  className,
  ...props
}) {
  const [open, setOpen] = useState(false);

  const handleSelect = useCallback((currentValue) => {
    const newValue = (value || []).includes(currentValue)
      ? (value || []).filter((item) => item !== currentValue)
      : [...(value || []), currentValue];
    onChange(newValue);
  }, [value, onChange]);

  return (
    <Popover open={open} onOpenChange={setOpen} {...props}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          <div className="flex flex-wrap gap-1">
            {(value || []).length > 0 ? (
              (value || []).map((itemValue) => {
                const selectedOption = options.find(option => option.value === itemValue);
                return selectedOption ? (
                  <Badge key={itemValue} variant="secondary">
                    {selectedOption.label}
                    <span
                      className="ml-1 rounded-full outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring cursor-pointer"
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelect(itemValue);
                      }}
                    >
                      <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                    </span>
                  </Badge>
                ) : null;
              })
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandList>
            <CommandGroup>
              {options?.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => handleSelect(option.value)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      (value || []).includes(option.value) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}