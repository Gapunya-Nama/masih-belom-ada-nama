"use client";

import { useState, useRef, useEffect } from "react";
import { WalletIcon, ArrowRightLeft, Filter } from "lucide-react";
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
  { id: "1", amount: 500000, date: "2024-03-20", category: "Top Up" },
  { id: "2", amount: -150000, date: "2024-03-19", category: "Payment" },
  { id: "3", amount: -75000, date: "2024-03-18", category: "Transfer" },
];

export default function MyPay() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterAmount, setFilterAmount] = useState("");
  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const filterRef = useRef<HTMLDivElement>(null);

  // Toggle filter popup on button click
  const toggleFilter = () => {
    setIsFilterOpen((prev) => !prev);
  };

  // Close filter popup if clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Filter transactions based on selected criteria
  const filteredTransactions = transactions.filter((transaction) => {
    const matchAmount = filterAmount === "" || transaction.amount === parseInt(filterAmount);
    const matchFromDate = filterFromDate === "" || new Date(transaction.date) >= new Date(filterFromDate);
    const matchToDate = filterToDate === "" || new Date(transaction.date) <= new Date(filterToDate);
    const matchCategory = filterCategory === "All" || transaction.category === filterCategory;
    return matchAmount && matchFromDate && matchToDate && matchCategory;
  });

  return (
    <div className="pt-16">
    <div className="min-h-screen bg-[#F3F3F3]">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center gap-2">
          <WalletIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">MyPay</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <h2 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">Phone Number</h2>
            <p className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">+62 812-3456-7890</p>
            <h2 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">Available Balance</h2>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{formatCurrency(2750000)}</p>
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

        <Card className="mt-8 p-6 relative">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Transaction History</h2>
            <Button
              variant="ghost"
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full relative"
              onClick={toggleFilter}
              aria-label="Filter Transactions"
            >
              <Filter className="h-6 w-6 text-gray-700 dark:text-gray-300" />
            </Button>
          </div>

          {/* Filter Popup positioned to the left of the button */}
          <div
            ref={filterRef}
            className={`absolute top-0 right-16 mt-2 p-4 border rounded-lg shadow-md bg-white dark:bg-gray-800 z-10 transition-all duration-300 ease-out transform origin-right ${
              isFilterOpen ? "scale-100 opacity-100" : "scale-75 opacity-0"
            }`}
          >
            <div className="flex flex-col items-start gap-4">
              <input
                type="number"
                placeholder="Filter by Amount"
                className="p-2 border rounded-md dark:bg-gray-700 dark:text-white"
                value={filterAmount}
                onChange={(e) => setFilterAmount(e.target.value)}
              />
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-700 dark:text-gray-300">From</label>
                <input
                  aria-label="filter by date"
                  type="date"
                  className="p-2 border rounded-md dark:bg-gray-700 dark:text-white"
                  value={filterFromDate}
                  onChange={(e) => setFilterFromDate(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-700 dark:text-gray-300">To</label>
                <input
                  aria-label="set date"
                  type="date"
                  className="p-2 border rounded-md dark:bg-gray-700 dark:text-white"
                  value={filterToDate}
                  onChange={(e) => setFilterToDate(e.target.value)}
                />
              </div>
              <select
                aria-label="Filter by Category"
                className="p-2 border rounded-md dark:bg-gray-700 dark:text-white"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="All">All Categories</option>
                <option value="Top Up">Top Up</option>
                <option value="Payment">Payment</option>
                <option value="Transfer">Transfer</option>
              </select>
            </div>
          </div>

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
                {filteredTransactions.map((transaction) => (
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
    </div>
  );
}
