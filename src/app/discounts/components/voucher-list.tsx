"use client";

import { Voucher } from "@/lib/dataType/interfaces";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

// Fungsi untuk mengambil semua voucher
const requestAllVoucher = async (): Promise<Voucher[]> => {
  try {
    const response = await fetch("/api/diskon", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type: "voucher" }),
    });

    // Periksa apakah respons tidak OK
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch voucher");
    }

    const voucher = await response.json();

    // Pastikan kita menangani baik objek tunggal maupun array dengan benar
    if (Array.isArray(voucher)) {
      return voucher; // Kembalikan apa adanya jika sudah berupa array
    } else if (voucher && typeof voucher === "object") {
      // Jika objek tunggal, ubah menjadi array
      console.warn("Received a single voucher object, converting to array:", voucher);
      return [voucher]; // Bungkus objek tunggal dalam array
    } else {
      console.error("Unexpected response format, expected an array or object:", voucher);
      return []; // Kembalikan array kosong untuk format yang tidak diharapkan
    }
  } catch (error) {
    // Tangani error seperti masalah jaringan atau format respons yang tidak valid
    console.error("Error fetching voucher:", error);
    throw error; // Lempar ulang error untuk ditangani di tempat lain
  }
};

export function VoucherList() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVouchers = async () => {
      setLoading(true);
      setError(null); // Reset error sebelum memulai fetch
      try {
        const data = await requestAllVoucher();
        setVouchers(data); // Menyimpan data voucher ke state
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching vouchers");
      } finally {
        setLoading(false);
      }
    };

    fetchVouchers();
  }, []); // Memanggil API hanya sekali saat komponen pertama kali dimuat

  const handlePurchase = (code: string) => {
    // Simulasi pengecekan saldo
    const hasBalance = Math.random() > 0.5;

    if (hasBalance) {
      toast.success("Voucher purchased successfully!", {
        description: `Your voucher code ${code} has been added to your account.`,
      });
    } else {
      toast.error("Purchase failed", {
        description: "Insufficient balance to purchase this voucher.",
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (vouchers.length === 0) {
    return <div>No vouchers available.</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {vouchers.map((voucher) => (
        <Card key={voucher.kode} className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{voucher.kode}</span>
              <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">
                {voucher.potongan}
              </span>
            </CardTitle>
            <CardDescription>Valid for {voucher.jmlhariberlaku} days</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <div className="space-y-2 flex-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Min. Transaction</span>
                <span className="font-medium">${voucher.mintrpemesanan}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Remaining Quota</span>
                <span className="font-medium">{voucher.kuotapenggunaan}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Price</span>
                <span className="font-medium">
                  {voucher.harga === 0 ? "Gratis" : `$${voucher.harga}`}
                </span>
              </div>
            </div>
            <Button
              className="w-full mt-4"
              onClick={() => handlePurchase(voucher.kode)}
            >
              Purchase Voucher
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
