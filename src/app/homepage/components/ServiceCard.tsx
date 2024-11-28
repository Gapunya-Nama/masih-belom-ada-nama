import React, { useState } from 'react';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { toast } from '@/components/hooks/use-toast';


interface Subcategory {
  id: string;
  name: string;
}

interface ServiceCardProps {
  name: string;
  subcategories: Subcategory[];
  onSubcategoryClick: (subcategoryId: string) => void;
}

export function ServiceCard({ name, subcategories, onSubcategoryClick }: ServiceCardProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleViewMoreClick = (subcategoryId: string) => {
    if (user && user.role !== 'worker' && user.role !== 'user') {      
      toast({
        title: `Error`,
        description: `Anda perlu login untuk mengakses halaman ini.`,
      });
    } else {
      router.push(`/subkategorijasa/${subcategoryId}`);
    }
  };

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
              <div key={subcategory.id} className="p-4 flex justify-between items-center">
                <button
                  onClick={() => onSubcategoryClick(subcategory.id)}
                  className="text-left hover:bg-gray-50 transition-colors duration-150 flex-grow"
                >
                  {subcategory.name}
                </button>
                <button
                  onClick={() => handleViewMoreClick(subcategory.id)}
                  className="ml-4 bg-green-500 text-white p-2 rounded hover:bg-green-600 transition-colors duration-150"
                >
                  Lihat Selengkapnya
                </button>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}