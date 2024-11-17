"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function WorkerProfileRead() {
  // Example data for display purposes
  const workerData = {
    name: "John Doe",
    gender: "Male",
    noHP: "+62 123 456 789",
    birthDate: "1990-01-01",
    address: "Jl. Sudirman, Jakarta, Indonesia",
    saldoMyPay: "Rp 1,500,000",
    bankName: "Bank BCA",
    accountNumber: "1234567890",
    npwp: "123-456-789-0123",
    rating: "4.8/5",
    completedOrders: 120,
    serviceCategories: ["Kategori Jasa 1", "Kategori Jasa 2"],
    photoUrl: "/default-photo.png", // Example photo placeholder
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
        <div className="grid md:grid-cols-3 gap-4">
          {/* Left Side: Worker Information */}
          <div className="md:col-span-2 space-y-4">
            {/* Name and Gender */}
            <div>
              <label className="block text-sm font-medium">Name</label>
              <p className="text-sm">{workerData.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium">Gender</label>
              <p className="text-sm">{workerData.gender}</p>
            </div>

            {/* Phone Number and Birth Date */}
            <div>
              <label className="block text-sm font-medium">Phone Number</label>
              <p className="text-sm">{workerData.noHP}</p>
            </div>
            <div>
              <label className="block text-sm font-medium">Birth Date</label>
              <p className="text-sm">{workerData.birthDate}</p>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium">Address</label>
              <p className="text-sm">{workerData.address}</p>
            </div>

            {/* Saldo MyPay */}
            <div>
              <label className="block text-sm font-medium">Saldo MyPay</label>
              <p className="text-sm">{workerData.saldoMyPay}</p>
            </div>

            {/* Bank Details */}
            <div>
              <label className="block text-sm font-medium">Bank Name</label>
              <p className="text-sm">{workerData.bankName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium">Account Number</label>
              <p className="text-sm">{workerData.accountNumber}</p>
            </div>

            {/* NPWP */}
            <div>
              <label className="block text-sm font-medium">NPWP</label>
              <p className="text-sm">{workerData.npwp}</p>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium">Rating</label>
              <p className="text-sm">{workerData.rating}</p>
            </div>

            {/* Completed Orders */}
            <div>
              <label className="block text-sm font-medium">
                Completed Orders
              </label>
              <p className="text-sm">{workerData.completedOrders}</p>
            </div>

            {/* Service Categories */}
            <div>
              <label className="block text-sm font-medium">Service Categories</label>
              <ul className="text-sm list-disc list-inside">
                {workerData.serviceCategories.map((category, index) => (
                  <li key={index}>{category}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Side: Photo */}
          <div className="flex flex-col items-center">
            <div className="relative w-40 h-40 rounded-full overflow-hidden border-2 border-muted mb-4">
              <img
                src={workerData.photoUrl}
                alt="Worker photo"
                className="w-full h-full object-cover"
              />
            </div>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Update
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
