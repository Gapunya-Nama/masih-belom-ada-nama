"use client";

import { LoginForm } from "./components/auth/login-form";
import { RoleSelector } from "./components/auth/role-seletor";
import { Card } from "@/components/ui/card";
import { Leaf } from "lucide-react";
import { useState } from "react";

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<"user" | "worker" | null>(null);

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-green-950 dark:to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg p-8">
        <div className="flex flex-col items-center space-y-6">
          <div className="rounded-full bg-green-100 dark:bg-green-900 p-3">
            <Leaf className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground">
              Please select your role and sign in to continue
            </p>
          </div>

          <RoleSelector
            selectedRole={selectedRole}
            onRoleSelect={setSelectedRole}
          />

          {selectedRole && (
            <div className="w-full">
              <LoginForm role={selectedRole} />
            </div>
          )}
        </div>
      </Card>
    </main>
  );
}