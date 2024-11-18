"use client";

import { useState } from "react";
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
import { useToast } from "@/components/hooks/use-toast"; // Import useToast

interface Job {
  id: string;
  subcategory: string;
  service: string;
  customer: string;
  orderDate: string;
  serviceDate: string;
  totalCost: number;
  status: string;
}

const jobsData: Job[] = [
  {
    id: "1",
    subcategory: "Tukang Ledeng Professional",
    service: "Perbaikan Pipa Bocor",
    customer: "Ahmad Sudrajat",
    orderDate: "2024-03-10",
    serviceDate: "2024-03-20",
    totalCost: 150000,
    status: "Menunggu Pekerja Berangkat",
  },
  {
    id: "2",
    subcategory: "Tukang Ledeng Professional",
    service: "Instalasi Pipa Baru",
    customer: "Budi Santoso",
    orderDate: "2024-03-12",
    serviceDate: "2024-03-22",
    totalCost: 200000,
    status: "Pekerja Tiba Di Lokasi",
  },
  {
    id: "3",
    subcategory: "Tukang Ledeng Professional",
    service: "Perbaikan Pipa Bocor",
    customer: "Candra Wijaya",
    orderDate: "2024-03-15",
    serviceDate: "2024-03-25",
    totalCost: 300000,
    status: "Pesanan Selesai",
  },
];

export function JobStatus() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [jobs, setJobs] = useState(jobsData);
  const { toast } = useToast(); // Destructure toast from useToast

  const updateStatus = (jobId: string, newStatus: string) => {
    setJobs((prevJobs) =>
      prevJobs.map((job) =>
        job.id === jobId ? { ...job, status: newStatus } : job
      )
    );

    // Display toast notification
    toast({
      title: "Status Updated",
      description: `Status updated to "${newStatus}" for the selected job.`,
    });
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.subcategory
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      {/* Filter Section */}
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <Input
          type="text"
          placeholder="Nama Jasa"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-auto flex-grow"
        />
        <Select onValueChange={setStatusFilter} defaultValue="all">
          <SelectTrigger className="w-full sm:w-60">
            <SelectValue placeholder="Status Pesanan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua</SelectItem>
            <SelectItem value="Menunggu Pekerja Berangkat">
              Menunggu Pekerja Berangkat
            </SelectItem>
            <SelectItem value="Pekerja Tiba Di Lokasi">
              Pekerja Tiba Di Lokasi
            </SelectItem>
            <SelectItem value="Pelayanan Jasa Sedang Dilakukan">
              Pelayanan Jasa Sedang Dilakukan
            </SelectItem>
            <SelectItem value="Pesanan Selesai">Pesanan Selesai</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="default"
          className="bg-green-600 text-white hover:bg-green-700"
        >
          Search
        </Button>
      </div>

      {/* Job Entries */}
      <div className="flex flex-col gap-4">
        {filteredJobs.map((job) => (
          <div key={job.id} className="bg-white rounded-lg shadow p-4 border">
            <div className="flex">
              {/* Left Section */}
              <div className="flex flex-col gap-2 w-1/3">
                <h3 className="text-lg font-bold">{job.subcategory}</h3>
                <div className="flex flex-row gap-2 items-center">
                  <p className="text-sm text-gray-500 border-r-2 pr-4">
                    {job.service}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <UserIcon className="w-4 h-4 text-gray-600" />
                    {job.customer}
                  </p>
                </div>
                <div className="mt-2 text-sm">
                  <p>
                    <span className=" text-gray-700">
                      Tanggal Pemesanan:
                    </span>{" "}
                    {new Date(job.orderDate).toLocaleDateString("id-ID")}
                  </p>
                  <p>
                    <span className=" text-gray-700">
                      Tanggal Pekerjaan:
                    </span>{" "}
                    {new Date(job.serviceDate).toLocaleDateString("id-ID")}
                  </p>
                </div>
              </div>

              {/* Middle Section */}
              <div className="flex items-center justify-center w-1/3">
                <p className="text-lg font-bold text-gray-900 flex items-center gap-1">
                  <DollarSign className="w-5 h-5 text-gray-900" />
                  Rp {job.totalCost.toLocaleString("id-ID")}
                </p>
              </div>

              {/* Right Section */}
              <div
                className={`flex flex-col items-end ${
                  job.status === "Pesanan Selesai" || job.status === "Dibatalkan"
                    ? "justify-center"
                    : "justify-between"
                } w-1/3`}
              >
                <p
                  className={`px-2 py-1 rounded text-sm font-semibold ${
                    job.status === "Menunggu Pekerja Berangkat"
                      ? "bg-yellow-100 text-yellow-700"
                      : job.status === "Pekerja Tiba Di Lokasi"
                      ? "bg-purple-100 text-purple-700"
                      : job.status === "Pelayanan Jasa Sedang Dilakukan"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {job.status}
                </p>
                {job.status !== "Pesanan Selesai" &&
                  job.status !== "Dibatalkan" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className={`${
                        job.status === "Menunggu Pekerja Berangkat"
                          ? "text-yellow-600 border-yellow-600"
                          : job.status === "Pekerja Tiba Di Lokasi"
                          ? "text-purple-600 border-purple-600"
                          : "text-blue-600 border-blue-600"
                      }`}
                      onClick={() =>
                        updateStatus(
                          job.id,
                          job.status === "Menunggu Pekerja Berangkat"
                            ? "Pekerja Tiba Di Lokasi"
                            : job.status === "Pekerja Tiba Di Lokasi"
                            ? "Pelayanan Jasa Sedang Dilakukan"
                            : "Pesanan Selesai"
                        )
                      }
                    >
                      {job.status === "Menunggu Pekerja Berangkat"
                        ? "Tiba Di Lokasi"
                        : job.status === "Pekerja Tiba Di Lokasi"
                        ? "Melakukan Pelayanan Jasa"
                        : "Selesai Melakukan Pelayanan"}
                    </Button>
                  )}
              </div>


            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
