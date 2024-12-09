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
import { Label } from "@/components/ui/label"
import { useAuth } from "@/context/auth-context";

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

const requestAllMetodeBayar = async (): Promise<MetodeBayar[]> => {
  try {
    const response = await fetch("/api/metode", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(""),
    });

    // Periksa apakah respons tidak OK
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch voucher");
    }

    const metode = await response.json();

    // Pastikan kita menangani baik objek tunggal maupun array dengan benar
    if (Array.isArray(metode)) {
      return metode; // Kembalikan apa adanya jika sudah berupa array
    } else if (metode && typeof metode === "object") {
      // Jika objek tunggal, ubah menjadi array
      console.warn("Received a single voucher object, converting to array:", metode);
      return [metode]; // Bungkus objek tunggal dalam array
    } else {
      console.error("Unexpected response format, expected an array or object:", metode);
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
  const [metodeBayars, setMetodeBayars] = useState<MetodeBayar[]>([]);
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

    const fetchMetodeBayar = async () => {
      setLoading(true);
      setError(null); // Reset error sebelum memulai fetch
      try {
        const data = await requestAllMetodeBayar();
        setMetodeBayars(data); // Menyimpan data voucher ke state
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching metode bayar");
      } finally {
        setLoading(false);
      }
    };

    fetchVouchers();
    // fetchMetodeBayar();
  }, []); // Memanggil API hanya sekali saat komponen pertama kali dimuat

  const handlePurchase = (voucher: Voucher) => {
    // Simulasi pengecekan saldo
    const { user } = useAuth();
    const hasBalance = user?.balance ?? -1;

    if (hasBalance >= voucher.harga) {
      
      toast.success("Voucher purchased successfully!", {
        description: `Your voucher code ${voucher.kode} has been added to your account.`,
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
                    {/* <Label htmlFor="framework">Framework</Label> */}
                    <Select>
                      <SelectTrigger id="framework">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem value="mypay">MyPay</SelectItem>
                        <SelectItem value="gopay">GoPay</SelectItem>
                        <SelectItem value="ovo">OVO</SelectItem>
                        <SelectItem value="dana">DANA</SelectItem>
                        <SelectItem value="linkaja">LinkAja</SelectItem>
                        <SelectItem value="kredit">Kartu Kredit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                <div className="flex justify-between">
                  <Button className="bg-red-500">Cancel</Button>
                  <Button className="bg-green-500">Submit</Button>
                </div>
              </DialogContent>
              <DialogFooter>
              </DialogFooter>
            </Dialog>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
