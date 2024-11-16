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

interface JobOrder {
  id: string;
  subcategory: string;
  customerName: string;
  orderDate: string;
  serviceDate: string;
  totalCost: number;
}

const jobOrders: JobOrder[] = [
  {
    id: "1",
    subcategory: "Daily Cleaning",
    customerName: "John Doe",
    orderDate: "2024-03-20",
    serviceDate: "2024-03-21",
    totalCost: 150000,
  },
  {
    id: "2",
    subcategory: "Sertika",
    customerName: "Jane Smith",
    orderDate: "2024-03-19",
    serviceDate: "2024-03-20",
    totalCost: 200000,
  },
];

export function JobOrders() {
  return (
    <Card className="overflow-hidden">
      <div className="rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Jenis Layanan</TableHead>
              <TableHead>Pelanggan</TableHead>
              <TableHead>Tanggal Pesanan</TableHead>
              <TableHead>Tanggal Layanan</TableHead>
              <TableHead>Total Biaya</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.subcategory}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>
                  {new Date(order.orderDate).toLocaleDateString("id-ID")}
                </TableCell>
                <TableCell>
                  {new Date(order.serviceDate).toLocaleDateString("id-ID")}
                </TableCell>
                <TableCell>{formatCurrency(order.totalCost)}</TableCell>
                <TableCell>
                  <Button 
                    variant="default" 
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
                  >
                    Kerjakan Pesanan
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
