"use client";

import React, { useMemo } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/ui/components/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/ui/components/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/ui/components/popover";
import { cn } from "@/lib/utils";
import { useMockMentors } from "@/lib/hooks/use-mock-mentors";

interface MentorsDropdownProps {
  selectedMentorId: string | undefined;
  onSelectMentor: (mentorId: string | undefined) => void;
}

export function MentorsDropdown({ selectedMentorId, onSelectMentor }: MentorsDropdownProps) {
  const { mentors } = useMockMentors();
  const [open, setOpen] = React.useState(false);
  
  const selectedMentor = useMemo(() => {
    if (!selectedMentorId) return null;
    return mentors.find(mentor => mentor.id === selectedMentorId);
  }, [selectedMentorId, mentors]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selectedMentor ? selectedMentor.name : "Select Mentor"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search mentor..." />
          <CommandEmpty>No mentor found.</CommandEmpty>
          <CommandGroup>
            <CommandItem
              onSelect={() => {
                onSelectMentor(undefined);
                setOpen(false);
              }}
              className="text-sm"
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  !selectedMentorId ? "opacity-100" : "opacity-0"
                )}
              />
              All Mentors
            </CommandItem>
            {mentors.map((mentor) => (
              <CommandItem
                key={mentor.id}
                onSelect={() => {
                  onSelectMentor(mentor.id);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedMentorId === mentor.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {mentor.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
