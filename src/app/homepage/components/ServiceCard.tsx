import React, { useState } from 'react';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp } from 'lucide-react';

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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="bg-[#2ECC71] text-white p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">{name}</h2>
          <CollapsibleTrigger className="focus:outline-none">
            {isOpen ? <ChevronUp /> : <ChevronDown />}
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent>
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
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}