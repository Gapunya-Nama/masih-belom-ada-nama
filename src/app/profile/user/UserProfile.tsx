"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function UserProfileRead() {
  // Example data for display purposes
  const workerData = {
    name: "John Doe",
    level: "Gold",
    gender: "Male",
    noHP: "+62 123 456 789",
    birthDate: "1990-01-01",
    address: "Jl. Sudirman, Jakarta, Indonesia",
    bankName: "Bank BCA",
    accountNumber: "1234567890",
    npwp: "123-456-789-0123",
    saldoMyPay: "Rp 1,500,000",
  };

  return (
    <Card className="border-none shadow-none">
      <CardContent className="p-0">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">Worker Information</h2>
          <p className="text-sm text-muted-foreground">
            View your work profile and payment details
          </p>
        </div>
        <Separator className="mb-6" />
        <div className="space-y-8">
          <div>
            <h3 className="text-base font-medium mb-4">Personal Details</h3>
            <div className="grid gap-6">
              {/* Name and Level */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium">Full Name</label>
                  <p className="text-sm">{workerData.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium">Level</label>
                  <p className="text-sm">{workerData.level}</p>
                </div>
              </div>

              {/* Gender and Phone Number */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium">Gender</label>
                  <p className="text-sm">{workerData.gender}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium">Phone Number</label>
                  <p className="text-sm">{workerData.noHP}</p>
                </div>
              </div>

              {/* Birth Date and Address */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium">Birth Date</label>
                  <p className="text-sm">{workerData.birthDate}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium">Address</label>
                  <p className="text-sm">{workerData.address}</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-base font-medium mb-4">Payment Information</h3>
            <div className="grid gap-6">
              {/* Bank Name and Account Number */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium">Bank Name</label>
                  <p className="text-sm">{workerData.bankName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Account Number
                  </label>
                  <p className="text-sm">{workerData.accountNumber}</p>
                </div>
              </div>

              {/* NPWP and Saldo MyPay */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium">NPWP</label>
                  <p className="text-sm">{workerData.npwp}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium">Saldo MyPay</label>
                  <p className="text-sm">{workerData.saldoMyPay}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
