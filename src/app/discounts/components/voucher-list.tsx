"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

const vouchers = [
  {
    code: "SAVE20",
    category: "New Users",
    minTransaction: 50,
    validDays: 7,
    quota: 100,
    price: 0,
  },
  {
    code: "PREMIUM50",
    category: "Premium",
    minTransaction: 100,
    validDays: 30,
    quota: 50,
    price: 5,
  },
  {
    code: "SPECIAL25",
    category: "General",
    minTransaction: 75,
    validDays: 14,
    quota: 200,
    price: 2,
  },
];

export function VoucherList() {
  const handlePurchase = (code: string) => {
    // Simulate balance check
    const hasBalance = Math.random() > 0.5;

    if (hasBalance) {
      toast.success("Voucher purchased successfully!", {
        description: `Your voucher code ${code} has been added to your account.`,
      });
    } else {
      toast.error("Purchase failed", {
        description: "Insufficient balance to purchase this voucher.",
      });
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {vouchers.map((voucher) => (
        <Card key={voucher.code} className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{voucher.code}</span>
              <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">
                {voucher.category}
              </span>
            </CardTitle>
            <CardDescription>Valid for {voucher.validDays} days</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <div className="space-y-2 flex-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Min. Transaction</span>
                <span className="font-medium">${voucher.minTransaction}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Remaining Quota</span>
                <span className="font-medium">{voucher.quota}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Price</span>
                <span className="font-medium">
                  {voucher.price === 0 ? "Free" : `$${voucher.price}`}
                </span>
              </div>
            </div>
            <Button
              className="w-full mt-4"
              onClick={() => handlePurchase(voucher.code)}
            >
              Purchase Voucher
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}