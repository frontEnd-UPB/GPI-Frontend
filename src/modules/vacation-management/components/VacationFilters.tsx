import React from "react";
import { Filter as FilterIcon, Search as SearchIcon } from "lucide-react";
import { Input } from "../../../ui/core/Input";
import { Select } from "../../../ui/core/Select";
import { Button } from "../../../ui/core/Button";

export interface VacationFiltersProps {
  search: string;
  specialty: string;
  specialties: string[];
  onSearchChange: (value: string) => void;
  onSpecialtyChange: (value: string) => void;
}

const VacationFilters: React.FC<VacationFiltersProps> = ({
  search,
  specialty,
  specialties,
  onSearchChange,
  onSpecialtyChange,
}) => {
  return (
    <div className="rounded-[20px] border border-border bg-card px-6 py-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <FilterIcon className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-primary">Filters</h3>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
        <div className="relative flex-1">
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by doctor..."
            className="w-full pl-10"
          />
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>

        <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center">
          <Select
            value={specialty}
            className="w-full md:w-56"
            onChange={(value: string) => onSpecialtyChange(value)}
            options={[
              { label: "All Specialties", value: "" },
              ...specialties.map((item) => ({
                label: item,
                value: item,
              })),
            ]}
          />

          <Button
            type="button"
            variant="light"
            className="w-full md:w-auto"
            onClick={() => {
              onSearchChange("");
              onSpecialtyChange("");
            }}
          >
            Clear Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VacationFilters;
