import React from 'react';

interface Subcategory {
  id: number;
  name: string;
}

interface ServiceCardProps {
  name: string;
  subcategories: Subcategory[];
  onSubcategoryClick: (subcategoryId: number) => void;
}

export function ServiceCard({ name, subcategories, onSubcategoryClick }: ServiceCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="bg-[#2ECC71] text-white p-4">
        <h2 className="text-lg font-semibold">{name}</h2>
      </div>
      <div className="divide-y divide-gray-100">
        {subcategories.map((subcategory) => (
          <button
            key={subcategory.id}
            onClick={() => onSubcategoryClick(subcategory.id)}
            className="w-full text-left p-4 hover:bg-gray-50 transition-colors duration-150"
          >
            {subcategory.name}
          </button>
        ))}
      </div>
    </div>
  );
}