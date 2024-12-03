import React from 'react';
import { Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { KategoriJasa } from '@/lib/dataType/interfaces';

// interface Category {
//   id: number;
//   name: string;
// }

interface SearchFiltersProps {
  categories: KategoriJasa[];
  selectedCategory: string;
  searchQuery: string;
  onCategoryChange: (value: string) => void;
  onSearchChange: (value: string) => void;
}

export function SearchFilters({
  categories,
  selectedCategory,
  searchQuery,
  onCategoryChange,
  onSearchChange,
}: SearchFiltersProps) {
  return (
    <div className="flex gap-4 mb-8">
      <Select value={selectedCategory} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-[200px] bg-white">
          <SelectValue placeholder="Kategori" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Kategori</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.namakategori}>
              {category.namakategori}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex-1 relative">
        <Input
          type="text"
          placeholder="Nama Subkategori"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-white pr-10"
        />
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
      </div>
    </div>
  );
}