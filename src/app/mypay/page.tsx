"use client";

import { useState } from "react";
import { WalletIcon, ArrowRightLeft } from "lucide-react";
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
import { TransactionModal } from "./components/TransactionModal";

interface Transaction {
  id: string;
  amount: number;
  date: string;
  category: string;
}

const transactions: Transaction[] = [
  {
    id: "1",
    amount: 500000,
    date: "2024-03-20",
    category: "Top Up",
  },
  {
    id: "2",
    amount: -150000,
    date: "2024-03-19",
    category: "Payment",
  },
  {
    id: "3",
    amount: -75000,
    date: "2024-03-18",
    category: "Transfer",
  },
];

export default function MyPay() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center gap-2">
          <WalletIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">MyPay</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <h2 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
              Phone Number
            </h2>
            <p className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
              +62 812-3456-7890
            </p>
            <h2 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
              Available Balance
            </h2>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(2750000)}
            </p>
          </Card>

          <Card className="flex items-center justify-center p-6">
            <Button
              size="lg"
              className="h-16 w-full max-w-xs gap-2 bg-green-600 text-lg hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
              onClick={() => setIsModalOpen(true)}
            >
              <ArrowRightLeft className="h-5 w-5" />
              New Transaction
            </Button>
          </Card>
        </div>

        <Card className="mt-8 p-6">
          <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
            Transaction History
          </h2>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className={`font-medium ${
                      transaction.amount > 0 
                        ? "text-green-500 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}>
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                    <TableCell>
                      {new Date(transaction.date).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell>{transaction.category}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      <TransactionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}