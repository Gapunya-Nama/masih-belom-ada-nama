"use client";

import { LoginForm } from "./components/auth/login-form";
import { Card } from "@/components/ui/card";
import { Leaf } from "lucide-react";
import { useState } from "react";

export default function LoginPage() {
  const [showLogin, isLoginShown] = useState(false);

  return (
    <main className="flex items-center justify-center p-4">
      <Card className="w-full max-w-lg p-8">
        <div className="flex flex-col items-center space-y-6">
          <div className="rounded-full bg-green-100 dark:bg-green-900 p-3">
            <Leaf className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>

          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome back
            </h1>
          </div>

          <button onClick={() => isLoginShown(!showLogin)}>
            Login
          </button>

          {showLogin && (
            <div className="w-full">
              <LoginForm />
            </div>
          )}
          <p className="text-sm text-muted-foreground">
            Don't want to login / register continue as {" "}
            <a
              href="/homepage"
              className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
            >
              Guest
            </a>
          </p>
        </div>
      </Card>
    </main>
  );
}