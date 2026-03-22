"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  value: number;
  onChange: (days: number) => void;
}

export function StatsDateRangeSelect({ value, onChange }: Props) {
  return (
    <Select
      value={String(value)}
      onValueChange={(v) => onChange(parseInt(v))}
    >
      <SelectTrigger className="w-[140px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="30">Last 30 days</SelectItem>
        <SelectItem value="90">Last 90 days</SelectItem>
      </SelectContent>
    </Select>
  );
}
