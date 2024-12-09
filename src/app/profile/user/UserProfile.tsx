"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/auth-context";
import { Wallet } from "lucide-react";

interface UserProfileViewProps {
  onEdit: () => void;
}

export function UserProfileView({ onEdit }: UserProfileViewProps) {

  const { user } = useAuth();

  return (
    <Card className="border-none shadow-none">
      <CardContent className="p-0">
        <div className="grid gap-8">
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-x-8 gap-y-4 text-sm md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <dt className="font-medium text-gray-500 dark:text-gray-400">Name</dt>
                  <dd className="mt-1 text-base">{user?.name}</dd>
                </div>

                <div>
                  <dt className="font-medium text-gray-500 dark:text-gray-400">Level</dt>
                  <dd className="mt-1 text-base">{user?.level}</dd>
                </div>

                <div>
                  <dt className="font-medium text-gray-500 dark:text-gray-400">Gender</dt>
                  <dd className="mt-1 text-base">{user?.gender}</dd>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <dt className="font-medium text-gray-500 dark:text-gray-400">Phone Number</dt>
                  <dd className="mt-1 text-base">{user?.pno}</dd>
                </div>

                <div>
                  <dt className="font-medium text-gray-500 dark:text-gray-400">Birth Date</dt>
                  <dd className="mt-1 text-base">
                    {user?.birth_date ? (
                      new Date(user.birth_date).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    ) : (
                      "N/A"
                    )}
                  </dd>
                </div>

                <div>
                  <dt className="font-medium text-gray-500 dark:text-gray-400">Address</dt>
                  <dd className="mt-1 text-base">{user?.address}</dd>
                </div>
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
                    Rp {user?.balance ? user.balance.toLocaleString() : "0"}
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
        </div>
      </CardContent>
    </Card>
  );
}