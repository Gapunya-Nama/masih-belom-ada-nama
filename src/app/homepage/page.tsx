"use client";

import { useEffect, useState } from "react";
// import { services } from "./data/services";
import { SearchFilters } from "./components/SearchFilters";
import { ServiceCard } from "./components/ServiceCard";
import styles from "./components/homepage.module.css";
import { KategoriJasa } from "@/lib/dataType/interfaces";

const requestKategoriJasa = async (): Promise<KategoriJasa[]> => {
  try {
    const response = await fetch("/api/homepage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(""),
    });

    // Check if the response is not OK
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch categories");
    }

    const kategori = await response.json();

    console.log("ini di page homepage: ",kategori);

    // Ensure we handle both single objects and arrays correctly
    if (Array.isArray(kategori)) {
      return kategori; // Return as-is if it's already an array
    } else if (kategori && typeof kategori === "object") {
      // If it's a single object, convert it to an array
      console.warn("Received a single kategori object, converting to array:", kategori);
      return [kategori]; // Wrap the single object in an array
    } else {
      console.error("Unexpected response format, expected an array or object:", kategori);
      return []; // Return an empty array for unexpected format
    }
  } catch (error) {
    // Handle errors like network issues or invalid response format
    console.error("Error fetching categories:", error);
    return []; // Return an empty array in case of error
  }
};


export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [categories, setCategories] = useState<KategoriJasa[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Add loading state

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await requestKategoriJasa();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false); 
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading...</p> 
      </div>
    );
  }

  if (!categories.length) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading...</p> 
      </div>
    );
  }

  const filteredServices = Array.isArray(categories) ? categories.filter((category) => {
    const categoryMatch = selectedCategory === "all" || category.namakategori === selectedCategory;
    const subcategoriesMatch = category.namasubkategori?.some((sub) =>
      sub.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return categoryMatch && (searchQuery === "" || subcategoriesMatch);
  }) : []; 
  


  // const handleSubcategoryClick = (subcategoryId: string) => {
  //   console.log(`Navigating to subcategory ${subcategoryId}`);
  // };

  return (
    <div className="pt-16 min-h-screen bg-[#F3F3F3] flex flex-col">
      <div className="max-w-4xl mx-auto p-6 pb-6 flex-1">
        <h1 className="text-4xl font-bold text-center text-[#2ECC71] mb-8">
          Sijarta
        </h1>

        <SearchFilters
          categories={categories}
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
          onCategoryChange={setSelectedCategory}
          onSearchChange={setSearchQuery}
        />

        <div className="space-y-6">
          {filteredServices.map((category) => (
            <ServiceCard
              key={category.id}
              name={category.namakategori}
              subcategories={category.namasubkategori}
            />
          ))}
        </div>
      </div>

      {/* Bottom Divider */}
      <div className={styles.customShapeDividerBottom}>
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M741,116.23C291,117.43,0,27.57,0,6V120H1200V6C1200,27.93,1186.4,119.83,741,116.23Z" className={styles.shapeFill}></path>
        </svg>
      </div>
    </div>
  );
}
