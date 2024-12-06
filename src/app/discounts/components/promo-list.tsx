"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";
import { toast } from "sonner";
import { Promo } from "@/lib/dataType/interfaces";

// Fungsi untuk mengambil semua promo
const requestAllPromos = async (): Promise<Promo[]> => {
  try {
    const response = await fetch("/api/diskon", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type: "promo" }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch promos");
    }

    const promos = await response.json();

    if (Array.isArray(promos)) {
      return promos;
    } else if (promos && typeof promos === "object") {
      console.warn("Received a single promo object, converting to array:", promos);
      return [promos];
    } else {
      console.error("Unexpected response format, expected an array or object:", promos);
      return [];
    }
  } catch (error) {
    console.error("Error fetching promos:", error);
    throw error;
  }
};

export function PromoList() {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPromos = async () => {
      setLoading(true);
      setError(null); // Reset error before starting fetch
      try {
        const data = await requestAllPromos();
        setPromos(data);
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching promos");
      } finally {
        setLoading(false);
      }
    };

    fetchPromos();
  }, []); // Fetch data when the component mounts

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (promos.length === 0) {
    return <div>No promos available.</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {promos.map((promo) => (
        <Card key={promo.kode}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-lg">
              <span>{promo.kode}</span>
              <div className="flex items-center text-sm text-muted-foreground">
                <CalendarDays className="w-4 h-4 mr-1" />
                <span>Until {new Date(promo.tglakhirberlaku).toLocaleDateString()}</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{promo.potongan}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
