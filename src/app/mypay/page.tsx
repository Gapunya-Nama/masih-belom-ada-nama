// app/mypay/page.tsx

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
import { useAuth } from "@/context/auth-context";
import { Transaction } from "@/lib/dataType/interfaces";
import useSWR from "swr";
import { fetchUserTransactions } from "@/lib/fetcher"; // Correct Import Path
import styles from "./components/mypay.module.css";
import { useRouter } from "next/navigation"; // Use 'next/navigation' for Next.js 13+

export default function MyPay() {
  const { user } = useAuth(); // Access `user` from Auth context
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterAmount, setFilterAmount] = useState("");
  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const filterRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // **Define the SWR fetcher function**
  const fetcher = (userId: string) => fetchUserTransactions(userId);

  // **Use SWR to fetch transactions only if user exists**
  const { data: transactions, error, isValidating, mutate } = useSWR(
    user ? user.id : null, // SWR fetches only if user.id is available
    fetcher
  );

  // **Calculate current balance based on transactions**
  const currentBalance = transactions
    ? transactions.reduce((acc, transaction) => acc + Number(transaction.amount), 0)
    : 0;

  // **Toggle filter popup on button click**
  const toggleFilter = () => {
    setIsFilterOpen((prev) => !prev);
  };

  // **Close filter popup if clicking outside**
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

  const formatCurrency = (amount: number | string) => {
    // Convert string to a number if it's a valid number string
    const validAmount =
      typeof amount === "number"
        ? amount
        : typeof amount === "string" && !isNaN(parseFloat(amount))
        ? parseFloat(amount)
        : 0;

    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(validAmount);
  };

  // **Filter transactions based on selected criteria**
  const filteredTransactions = transactions
    ? transactions.filter((transaction) => {
        const matchAmount =
          filterAmount === "" || transaction.amount === parseInt(filterAmount);
        const matchFromDate =
          filterFromDate === "" ||
          new Date(transaction.date) >= new Date(filterFromDate);
        const matchToDate =
          filterToDate === "" ||
          new Date(transaction.date) <= new Date(filterToDate);
        const matchCategory =
          filterCategory === "All" ||
          transaction.namakategori === filterCategory; // Ensure consistency
        return matchAmount && matchFromDate && matchToDate && matchCategory;
      })
    : [];

  // **Define a handler to close the modal and trigger refresh**
  const handleModalClose = () => {
    setIsModalOpen(false);
    mutate(); // Trigger SWR to re-fetch transactions
  };

  // **Redirect to login if user is not authenticated**
  useEffect(() => {
    if (user === null) {
      // Delay the redirect by 500ms to allow `useAuth` to update `user`
      const timeoutId = setTimeout(() => {
        router.push("/login");
      }, 500); // Adjust the delay as needed
  
      return () => clearTimeout(timeoutId); // Cleanup on unmount
    }
  }, [user, router]);

  // **Avoid rendering the component until user is authenticated**
  if (!user) {
    return null; // Optionally, display a loading indicator or a placeholder
  }

  return (
    <div className="pt-16 min-h-screen bg-[#F3F3F3]">
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
              {user.pno}
            </p>
            <h2 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
              Available Balance
            </h2>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(currentBalance)}
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

        <Card className="mt-8 p-6 relative">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Transaction History
            </h2>
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

          {/* Handle Loading and Error States */}
          {isValidating && <p>Loading transactions...</p>}
          {error && <p className="text-red-500">{error.message}</p>}
          {!isValidating && !error && filteredTransactions.length === 0 && (
            <p className="text-gray-500">No transactions found.</p>
          )}

          {!isValidating && !error && filteredTransactions.length > 0 && (
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
                      <TableCell
                        className={`font-medium ${
                          transaction.amount > 0
                            ? "text-green-500 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {formatCurrency(transaction.amount)}
                      </TableCell>
                      <TableCell>
                        {new Date(transaction.date).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </TableCell>
                      <TableCell>{transaction.namakategori}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>
      </div>

      {/* **Pass the handleModalClose to TransactionModal** */}
      <TransactionModal isOpen={isModalOpen} onClose={handleModalClose} />

      <div className={styles.customShapeDividerBottom}>
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M1200,0H0V120H281.94C572.9,116.24,602.45,3.86,602.45,3.86h0S632,116.24,923,120h277Z"
            className={styles.shapeFill}
          ></path>
        </svg>
      </div>
    </div>
  );
}
