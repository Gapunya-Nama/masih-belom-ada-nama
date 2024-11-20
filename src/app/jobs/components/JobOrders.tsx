"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserIcon, DollarSign } from "lucide-react";
import { useToast } from "@/components/hooks/use-toast";

interface JobOrder {
  id: string;
  subcategory: string;
  service: string;
  customerName: string;
  orderDate: string;
  serviceDate: string;
  totalCost: number;
}

const jobOrders: JobOrder[] = [
  {
    id: "1",
    subcategory: "Cleaning",
    service: "Daily Cleaning",
    customerName: "John Doe",
    orderDate: "2024-03-20",
    serviceDate: "2024-03-21",
    totalCost: 150000,
  },
  {
    id: "2",
    subcategory: "Laundry",
    service: "Sertika",
    customerName: "Jane Smith",
    orderDate: "2024-03-19",
    serviceDate: "2024-03-20",
    totalCost: 200000,
  },
];

export function JobOrders() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState("all");
  const { toast } = useToast();

  const handleOrderAction = (orderId: string) => {
    // Display toast notification
    toast({
      title: "Pesanan Dikerjakan",
      description: `Pesanan dengan ID ${orderId} sedang dikerjakan.`,
    });
  };

  const filteredOrders = jobOrders.filter((order) => {
    const matchesSearch =
      search === "" || order.subcategory.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || order.subcategory === selectedCategory;
    const matchesSubcategory =
      selectedSubcategory === "all" || order.service === selectedSubcategory;
    return matchesSearch && matchesCategory && matchesSubcategory;
  });

  return (
    <div>
      {/* Filter Section */}
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <Select onValueChange={setSelectedCategory} defaultValue="all">
          <SelectTrigger className="w-full sm:w-60">
            <SelectValue placeholder="Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua</SelectItem>
            <SelectItem value="Cleaning">Cleaning</SelectItem>
            <SelectItem value="Laundry">Laundry</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={setSelectedSubcategory} defaultValue="all">
          <SelectTrigger className="w-full sm:w-60">
            <SelectValue placeholder="Subkategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua</SelectItem>
            <SelectItem value="Daily Cleaning">Daily Cleaning</SelectItem>
            <SelectItem value="Sertika">Sertika</SelectItem>
          </SelectContent>
        </Select>

        <Input
          type="text"
          placeholder="Cari Pesanan..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-60"
        />

        <Button
          variant="default"
          className="bg-green-600 text-white hover:bg-green-700"
        >
          Search
        </Button>
      </div>

      {/* Job Entries */}
      <div className="flex flex-col gap-4">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow p-4 border">
            <div className="flex justify-between items-center">
              {/* Left Section */}
<div className="flex flex-col gap-2 w-1/3">
  {/* Subcategory */}
  <h3 className="text-lg font-bold">{order.subcategory}</h3>
  
  {/* Service and Customer */}
  <div className="flex flex-row gap-2 items-center">
    <p className="text-sm text-gray-500 border-r-2 pr-4">{order.service}</p>
    <p className="text-sm text-gray-600 flex items-center gap-1">
      <UserIcon className="w-4 h-4 text-gray-600" />
      {order.customerName}
    </p>
  </div>
  
  {/* Details */}
  <div className="mt-2 text-sm">
    {/* <p>
      <span className="text-gray-700">Jenis Layanan:</span> {order.service}
    </p> */}
    <p>
      <span className="text-gray-700">Tanggal Pemesanan:</span>{" "}
      {new Date(order.orderDate).toLocaleDateString("id-ID")}
    </p>
    <p>
      <span className="text-gray-700">Tanggal Pekerjaan:</span>{" "}
      {new Date(order.serviceDate).toLocaleDateString("id-ID")}
    </p>
  </div>
</div>


              {/* Middle Section */}
              <div className="flex items-center justify-center w-1/3">
                <p className="text-lg font-bold text-gray-900 flex items-center gap-1">
                  <DollarSign className="w-5 h-5 text-gray-900" />
                  Rp {order.totalCost.toLocaleString("id-ID")}
                </p>
              </div>

              {/* Right Section */}
              <div className="flex flex-col items-end justify-center w-1/3">
                <Button
                  size="sm"
                  variant="default"
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => handleOrderAction(order.id)}
                >
                  Kerjakan Pesanan
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
