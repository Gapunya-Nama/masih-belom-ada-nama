"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UserCircle2, Briefcase } from "lucide-react";

interface RoleSelectorProps {
  selectedRole: "user" | "worker" | null;
  onRoleSelect: (role: "user" | "worker") => void;
}

export function RoleSelector({ selectedRole, onRoleSelect }: RoleSelectorProps) {
  return (
    <div className="flex gap-4 w-full max-w-xs mx-auto">
      <Button
        variant="outline"
        className={cn(
          "flex-1 flex-col h-24 space-y-2",
          selectedRole === "user" &&
            "border-green-600 dark:border-green-400 bg-green-50 dark:bg-green-950"
        )}
        onClick={() => onRoleSelect("user")}
      >
        <UserCircle2 className="h-6 w-6" />
        <span>User</span>
      </Button>

      <Button
        variant="outline"
        className={cn(
          "flex-1 flex-col h-24 space-y-2",
          selectedRole === "worker" &&
            "border-green-600 dark:border-green-400 bg-green-50 dark:bg-green-950"
        )}
        onClick={() => onRoleSelect("worker")}
      >
        <Briefcase className="h-6 w-6" />
        <span>Worker</span>
      </Button>
    </div>
  );
}