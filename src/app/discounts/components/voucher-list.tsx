"use client";

import { Voucher, MetodeBayar } from "@/lib/dataType/interfaces";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";

const requestAllVoucher = async (): Promise<Voucher[]> => {
  try {
    const response = await fetch("/api/diskon", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action: "getAllVoucher" }), // ubah ke action getAllVoucher
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch voucher");
    }

    const voucher = await response.json();

    if (Array.isArray(voucher)) {
      return voucher;
    } else if (voucher && typeof voucher === "object") {
      console.warn("Received a single voucher object, converting to array:", voucher);
      return [voucher];
    } else {
      console.error("Unexpected response format, expected an array or object:", voucher);
      return [];
    }
  } catch (error) {
    console.error("Error fetching voucher:", error);
    throw error;
  }
};

const requestAllMetodeBayar = async (): Promise<MetodeBayar[]> => {
  try {
    const response = await fetch("/api/metode", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(""),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch voucher");
    }

    const metode = await response.json();

    if (Array.isArray(metode)) {
      return metode;
    } else if (metode && typeof metode === "object") {
      console.warn("Received a single metode object, converting to array:", metode);
      return [metode];
    } else {
      console.error("Unexpected response format, expected an array or object:", metode);
      return [];
    }
  } catch (error) {
    console.error("Error fetching metodeBayar:", error);
    throw error;
  }
};

export function VoucherList() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [metodeBayars, setMetodeBayars] = useState<MetodeBayar[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMetode, setSelectedMetode] = useState<string>();
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [voucherData, metodeData] = await Promise.all([
          requestAllVoucher(),
          requestAllMetodeBayar()
        ]);

        setVouchers(voucherData);
        setMetodeBayars(metodeData);
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePurchase = async (voucher: Voucher) => {
    if (!user || !user.id) {
      toast.error("You must be logged in to purchase a voucher.");
      return;
    }
    if (!selectedMetode) {
      toast.error("Please select a payment method.");
      return;
    }

    // Cari metodeId dari selectedMetode
    const selectedMetodeObj = metodeBayars.find((m) => m.nama === selectedMetode);
    if (!selectedMetodeObj) {
      toast.error("Invalid payment method selected.");
      return;
    }

    // Lakukan request ke endpoint buyVoucher
    try {
      const response = await fetch("/api/diskon", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "buyVoucher",
          userId: user.id,
          voucherId: voucher.kode, // Asumsikan voucherId = voucher.kode
          metodeId: selectedMetodeObj.id, // Gunakan id dari objek metode bayar
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error("Purchase failed", {
          description: errorData.message || "Failed to purchase voucher",
        });
        return;
      }

      // Jika sukses
      toast.success("Voucher purchased successfully!", {
        description: `Your voucher ${voucher.kode} has been added to your account.`,
      });

    } catch (err: any) {
      console.error("Error purchasing voucher:", err);
      toast.error("Purchase failed", {
        description: err.message || "An unknown error occurred",
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
                <span className="font-medium">Rp{voucher.mintrpemesanan.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Remaining Quota</span>
                <span className="font-medium">{voucher.kuotapenggunaan}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Price</span>
                <span className="font-medium">
                  Rp{voucher.harga.toLocaleString()}
                </span>
              </div>
            </div>
            <Dialog>
              <DialogTrigger className="mt-4 bg-green-500 rounded-md">Purchase Voucher</DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Metode Bayar</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                  Pilih Metode Bayar yang Sesuai dengan Anda
                </DialogDescription>
                <div className="flex flex-col space-y-1.5">
                  <Select value={selectedMetode} onValueChange={setSelectedMetode}>
                    <SelectTrigger id="metode-bayar">
                      <SelectValue placeholder="Select Payment Method" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {metodeBayars.map((metode) => (
                        <SelectItem key={metode.id} value={metode.nama}>
                          {metode.nama}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end mt-4">
                  <Button
                    className="bg-green-500"
                    onClick={() => handlePurchase(voucher)}
                  >
                    Submit
                  </Button>
                </div>
              </DialogContent>
              <DialogFooter></DialogFooter>
            </Dialog>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
