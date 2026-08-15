import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = 'Rechercher...',
}: SearchBarProps) {
  return (
    <div className="mt-6 flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 focus-within:border-gold sm:max-w-xs">
      <Search size={15} className="shrink-0 text-mist" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm text-paper placeholder:text-mist focus:outline-none"
      />
    </div>
  );
}
