import { Icon } from "@iconify/react";

interface Props {
  value?: string;
  name?: string;
  onChange?: (value: string) => void;
  onSearch: (value: string) => void;
}

export default function SearchByName({
  name,
  value,
  onChange = () => {},
  onSearch,
}: Props) {
  return (
    <div className="flex items-center w-full gap-2">
      <p className="text-[#131313] text-sm font-medium w-auto">
        {name || "Name :"}
      </p>

      <div className="relative w-full">
        <input
          placeholder="Search"
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            onSearch(e.target.value);
          }}
          className="border bg-secondary pl-9 w-full border-[#0755E9] h-10 pr-4 rounded-lg focus:outline-none"
        />

        <div className="absolute inset-y-0 left-0 flex items-center gap-3 pl-3 pointer-events-none">
          <Icon icon="circum:search" color="#7d7d7d" />
        </div>
      </div>
    </div>
  );
}
