"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";

interface JobStatus {
  id: string;
  subcategory: string;
  customerName: string;
  serviceDate: string;
  totalCost: number;
  status: "Menunggu Pekerja Berangkat" | "Pekerja Tiba Di Lokasi" | "Pelayanan Jasa Sedang Dilakukan" | "Pesanan Selesai";
}

const activeJobs: JobStatus[] = [
  {
    id: "1",
    subcategory: "Daily Cleaning",
    customerName: "John Doe",
    serviceDate: "2024-03-21",
    totalCost: 150000,
    status: "Menunggu Pekerja Berangkat",
  },
  {
    id: "2",
    subcategory: "Sertika",
    customerName: "Jane Smith",
    serviceDate: "2024-03-20",
    totalCost: 200000,
    status: "Pelayanan Jasa Sedang Dilakukan",
  },
];

export function JobStatus() {
  const getStatusButton = (status: JobStatus["status"]) => {
    switch (status) {
      case "Menunggu Pekerja Berangkat":
        return (
          <Button 
            variant="default" 
            size="sm"
            className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
          >
            Tiba Di Lokasi
          </Button>
        );
      case "Pekerja Tiba Di Lokasi":
        return (
          <Button 
            variant="default" 
            size="sm"
            className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
          >
            Mulai Pelayanan
          </Button>
        );
      case "Pelayanan Jasa Sedang Dilakukan":
        return (
          <Button 
            variant="default" 
            size="sm"
            className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
          >
            Selesai
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Jenis Layanan</TableHead>
              <TableHead>Pelanggan</TableHead>
              <TableHead>Tanggal Layanan</TableHead>
              <TableHead>Total Biaya</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activeJobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell>{job.subcategory}</TableCell>
                <TableCell>{job.customerName}</TableCell>
                <TableCell>
                  {new Date(job.serviceDate).toLocaleDateString("id-ID")}
                </TableCell>
                <TableCell>{formatCurrency(job.totalCost)}</TableCell>
                <TableCell>
                  <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800 dark:bg-green-900 dark:text-green-200">
                    {job.status}
                  </span>
                </TableCell>
                <TableCell>{getStatusButton(job.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
