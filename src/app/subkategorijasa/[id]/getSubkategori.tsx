"use server"

import { SubCategory } from "../data/subcategories";

export const getSubkategori = async (
    name: string | null
  ): Promise<SubCategory> => {
    try {
  
      const response = await fetch("/api/subcategorijasa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(name),
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Invalid credentials');
      }
  
  
      const subkategori = await response.json();
  
      console.log("Ini adalah respons server untuk subkategori: ", subkategori);
  
      return subkategori;
  
  
    } catch (error) {
      console.error("Authentication error:", error);
      throw error;
    }
  };
  
  