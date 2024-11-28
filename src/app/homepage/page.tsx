"use client";

import { useState } from "react";
import { services } from "./data/services";
import { SearchFilters } from "./components/SearchFilters";
import { ServiceCard } from "./components/ServiceCard";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredServices = services.filter((category) => {
    const categoryMatch = selectedCategory === "all" || category.name === selectedCategory;
    const subcategoriesMatch = category.subcategories.some((sub) =>
      sub.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return categoryMatch && (searchQuery === "" || subcategoriesMatch);
  });

  const handleSubcategoryClick = (subcategoryId: string) => {
    // Implement navigation to subcategory page
    console.log(`Navigating to subcategory ${subcategoryId}`);
  };

  return (
    <div className="pt-16">
    <div className="min-h-screen bg-[#F3F3F3]">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-center text-[#2ECC71] mb-8">
          Sijarta
        </h1>
        
        <SearchFilters
          categories={services}
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
          onCategoryChange={setSelectedCategory}
          onSearchChange={setSearchQuery}
        />

        <div className="space-y-6">
          {filteredServices.map((category) => (
            <ServiceCard
              key={category.id}
              name={category.name}
              subcategories={category.subcategories}
              onSubcategoryClick={handleSubcategoryClick}
            />
          ))}
        </div>
      </div>
    </div>
    </div>
  );
}