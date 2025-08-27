"use client";

import React, { useState, useCallback } from "react";
import { Check, ChevronDown } from "lucide-react";

import { cn, getInitials } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

export function MultipleSelector({
  options,
  value,
  onChange,
  placeholder,
  className,
  ...props
}) {
  const [open, setOpen] = useState(false);
  // console.log(options);

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
          <div className="flex items-center gap-1">
            {(value || []).length > 0 ? (
              <span className="text-sm font-medium">
                {value.length} {value.length === 1 ? "item" : "items"} selected
              </span>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options?.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => handleSelect(option.value)}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={option.avatar?.trim()}
                      alt={option.label}
                    />
                    <AvatarFallback>{getInitials(option.label)}</AvatarFallback>
                  </Avatar>
                  {option.label}
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      (value || []).includes(option.value) ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}