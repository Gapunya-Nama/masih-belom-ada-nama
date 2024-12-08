"use client"

import { SubCategory } from "@/lib/dataType/interfaces";

export const getSubkategori = async ( 
    name: string
  ): Promise<SubCategory> => {
    try {
  
      const response = await fetch("/api/subkategorijasa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nama: name }),
      });

  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Invalid credentials');
      }
  
  
      const subkategori = await response.json();
  
  
      return subkategori;
  
  
    } catch (error) {
      console.error("Authentication error:", error);
      throw error;
    }
  };
  
  