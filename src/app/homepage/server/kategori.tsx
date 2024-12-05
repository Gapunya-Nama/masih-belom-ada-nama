// "use server";

// import { KategoriJasa } from "@/lib/dataType/interfaces";

// export const requestKategoriJasa = async (): Promise<KategoriJasa[]> => {
//   try {
//     const baseUrl = window.location.origin;
//     const response = await fetch("${baseUrl}/api/homepage", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(""),
//     });

//     // Check if the response is not OK
//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.message || "Failed to fetch categories");
//     }

//     const kategori = await response.json();

//     // Ensure we handle both single objects and arrays correctly
//     if (Array.isArray(kategori)) {
//       return kategori; // Return as-is if it's already an array
//     } else if (kategori && typeof kategori === "object") {
//       // If it's a single object, convert it to an array
//       console.warn("Received a single kategori object, converting to array:", kategori);
//       return [kategori]; // Wrap the single object in an array
//     } else {
//       console.error("Unexpected response format, expected an array or object:", kategori);
//       return []; // Return an empty array for unexpected format
//     }
//   } catch (error) {
//     // Handle errors like network issues or invalid response format
//     console.error("Error fetching categories:", error);
//     return []; // Return an empty array in case of error
//   }
// };
