"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/auth-context";

type TransactionType = "TopUp" | "Payment" | "Transfer" | "Withdrawal";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const services = [
  { id: "1", name: "Internet Service", price: 150000 },
  { id: "2", name: "Electricity Bill", price: 250000 },
  { id: "3", name: "Water Bill", price: 100000 },
];

const banks = [
  { id: "bca", name: "BCA" },
  { id: "bni", name: "BNI" },
  { id: "mandiri", name: "Mandiri" },
];

export function TransactionModal({ isOpen, onClose }: TransactionModalProps) {
  const { user } = useAuth(); // Access authenticated user and setter
  const [transactionType, setTransactionType] = useState<TransactionType | "">("");
  const [amount, setAmount] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Adjust padding on the body to prevent layout shift
  useEffect(() => {
    if (isOpen) {
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${scrollBarWidth}px`;
      document.body.style.overflow = "hidden";
    } else {
      // Add a slight delay before removing the padding and overflow
      const timeoutId = setTimeout(() => {
        document.body.style.paddingRight = "";
        document.body.style.overflow = "";
      }, 200); // Delay of 200ms for a smoother transition
      return () => clearTimeout(timeoutId); // Clear timeout if component unmounts
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
  
    if (transactionType === "TopUp") {
      // Validate amount
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        setError("Please enter a valid amount.");
        return;
      }

      if (!user?.id) {
        setError("User not authenticated.");
        return;
      }

      try {
        setLoading(true);
        // Send Top Up request to backend
        const response = await fetch("/api/mypay/top-up", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Include cookies for session-based auth
          body: JSON.stringify({
            userId: user.id,
            amount: parsedAmount,
          }),
        });

        if (response.ok) {
          setSuccess("Top Up successful!");
          onClose(); // Trigger parent to refresh transactions and close modal
          // Optionally, trigger a user data refresh here
          // onClose();
        } else {
          const data = await response.json();
          setError(data.message || "An error occurred during Top Up.");
        }
      } catch (err: any) {
        console.error("Top Up Error:", err);
        setError(err.response?.data?.message || "An error occurred during Top Up.");
      } finally {
        setLoading(false);
      }
    } else if (transactionType == "Payment") {
      if (!user?.id) {
        setError("User not authenticated.");
        return;
      }

      // Validate service selection
      if (!selectedService) {
        setError("Please select a service.");
        return;
      }

      // Find the selected service to get the price
      const service = services.find((s) => s.id === selectedService);
      if (!service) {
        setError("Selected service not found.");
        return;
      }

      // Use the predefined service price
      const parsedPaymentAmount = service.price;


      try {
        setLoading(true);
        // Send Top Up request to backend
        const response = await fetch("/api/mypay/payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Include cookies for session-based auth
          body: JSON.stringify({
            userId: user.id,
            amount: parsedPaymentAmount,
          }),
        });

        if (response.ok) {
          setSuccess("Service Payment successful!");
          onClose(); // Trigger parent to refresh transactions and close modal
          // Optionally, trigger a user data refresh here
          // onClose();
        } else {
          const data = await response.json();
          setError(data.message || "An error occurred during Service Payment.");
        }
      } catch (err: any) {
        console.error("Top Up Error:", err);
        setError(err.response?.data?.message || "An error occurred during Service Payment.");
      } finally {
        setLoading(false);
      }
    } else {
      // Handle other transaction types (Payment, Transfer, Withdrawal)
      // Implement similarly by creating respective API routes and functions
      onClose();
    }
  };

  const renderFormContent = () => {
    switch (transactionType) {
      case "TopUp":
        return (
          <div className="space-y-4">
            <Label htmlFor="amount">Top Up Amount</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Processing..." : "Top Up"}
            </Button>
            {/* <Button type="submit" className="w-full">Top Up</Button> */}
          </div>
        );

      case "Payment":
        return (
          <div className="space-y-4">
            <Label htmlFor="service">Select Service</Label>
            <Select value={selectedService} onValueChange={setSelectedService}>
              <SelectTrigger>
                <SelectValue placeholder="Select service" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name} - Rp {service.price.toLocaleString("id-ID")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="submit" className="w-full">Pay</Button>
          </div>
        );

      case "Transfer":
        return (
          <div className="space-y-4">
            <Label htmlFor="phone">Recipient Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <Label htmlFor="amount">Transfer Amount</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <Button type="submit" className="w-full">Transfer</Button>
          </div>
        );

      case "Withdrawal":
        return (
          <div className="space-y-4">
            <Label htmlFor="bank">Select Bank</Label>
            <Select value={selectedBank} onValueChange={setSelectedBank}>
              <SelectTrigger>
                <SelectValue placeholder="Select bank" />
              </SelectTrigger>
              <SelectContent>
                {banks.map((bank) => (
                  <SelectItem key={bank.id} value={bank.id}>
                    {bank.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Label htmlFor="account">Account Number</Label>
            <Input
              id="account"
              type="text"
              placeholder="Enter account number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
            />
            <Label htmlFor="amount">Withdrawal Amount</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <Button type="submit" className="w-full">Withdraw</Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Transaction</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="type">Transaction Type</Label>
            <Select value={transactionType} onValueChange={(value) => setTransactionType(value as TransactionType)}>
              <SelectTrigger>
                <SelectValue placeholder="Select transaction type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TopUp">Top Up MyPay</SelectItem>
                <SelectItem value="Payment">Payment</SelectItem>
                <SelectItem value="Transfer">Transfer MyPay</SelectItem>
                <SelectItem value="Withdrawal">Withdrawal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {renderFormContent()}
        </form>
      </DialogContent>
    </Dialog>
  );
}

