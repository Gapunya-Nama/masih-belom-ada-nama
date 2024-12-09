"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/auth-context";
import { Star, Wallet } from "lucide-react";
import Image from "next/image";

interface WorkerProfileViewProps {
  onEdit: () => void;
}

export function WorkerProfileView({ onEdit }: WorkerProfileViewProps) {
  // Mock data - in a real app, this would come from your backend
  // const workerData = {
  //   name: "Jane Smith",
  //   gender: "Female",
  //   phone: "+62 812 3456 7890",
  //   birthDate: "1992-05-15",
  //   address: "456 Worker Street, City",
  //   balance: 2500000,
  //   bankName: "Bank BCA",
  //   accountNumber: "1234567890",
  //   npwp: "12.345.678.9-012.345",
  //   rating: 4.8,
  //   completedOrders: 156,
  //   photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&auto=format&fit=crop&crop=face",
  //   categories: [
  //     "House Cleaning",
  //     "Laundry Service"
  //   ]
  // };
  const { user } = useAuth();

  return (
    <Card className="border-none shadow-none">
      <CardContent className="p-0">
        <div className="grid gap-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="md:col-span-2">
              <div className="grid grid-cols-1 gap-x-8 gap-y-4 text-sm md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <dt className="font-medium text-gray-500 dark:text-gray-400">Name</dt>
                    <dd className="mt-1 text-base">{user?.name}</dd>
                  </div>

                  <div>
                    <dt className="font-medium text-gray-500 dark:text-gray-400">Gender</dt>
                    <dd className="mt-1 text-base">{user?.gender}</dd>
                  </div>

                  <div>
                    <dt className="font-medium text-gray-500 dark:text-gray-400">Phone Number</dt>
                    <dd className="mt-1 text-base">{user?.pno}</dd>
                  </div>

                  <div>
                    <dt className="font-medium text-gray-500 dark:text-gray-400">Birth Date</dt>
                    <dd className="mt-1 text-base">{user?.birth_date}</dd>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <dt className="font-medium text-gray-500 dark:text-gray-400">Address</dt>
                    <dd className="mt-1 text-base">{user?.address}</dd>
                  </div>

                  <div>
                    <dt className="font-medium text-gray-500 dark:text-gray-400">Bank Name</dt>
                    <dd className="mt-1 text-base">{user?.bankName}</dd>
                  </div>

                  <div>
                    <dt className="font-medium text-gray-500 dark:text-gray-400">Account Number</dt>
                    <dd className="mt-1 text-base">{user?.accountNumber}</dd>
                  </div>

                  <div>
                    <dt className="font-medium text-gray-500 dark:text-gray-400">NPWP</dt>
                    <dd className="mt-1 text-base">{user?.npwp}</dd>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center space-y-4">
              <div className="relative h-48 w-48 overflow-hidden rounded-lg border-2 border-muted">
                <Image
                  src={user?.photoUrl as string}
                  alt="Profile photo"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="text-lg font-semibold">{user?.rating}</span>
              </div>

              <p className="text-sm text-muted-foreground">
                {user?.completedOrders} Orders Completed
              </p>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="mb-4 text-lg font-semibold">Service Categories</h3>
            <div className="flex flex-wrap gap-2">
              {user?.categories?.map((category, index) => (
                <div
                  key={index}
                  className="rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-800 dark:bg-green-900 dark:text-green-200"
                >
                  {category}
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
                <Wallet className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  MyPay Balance
                </p>
                <p className="text-lg font-semibold">
                  Rp {user?.balance.toLocaleString()}
                </p>
              </div>
            </div>

            <Button
              onClick={onEdit}
              className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
            >
              Update Profile
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}