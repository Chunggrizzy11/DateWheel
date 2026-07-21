import { Search as SearchIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function Search({ value, onChange, placeholder = 'Search...', className }: SearchProps) {
  return (
    <div className={cn('relative', className)}>
      <SearchIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-body-subtle" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-field pl-10"
      />
    </div>
  );
}
