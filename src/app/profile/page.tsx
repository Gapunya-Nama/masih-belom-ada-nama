'use client';

import WorkerProfilePage from "./worker/worker";
import UserProfilePage from "./user/user";
import { useAuth } from "@/context/auth-context"; 
import { Loader2 } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth(); 

  if (!user) {
    return (
        <div className="flex justify-center items-center h-screen">
          <p>{<Loader2 className="mr-2 h-4 w-4 animate-spin" />}</p>
        </div>
      );
  }

  return user.role === "worker" ? <WorkerProfilePage /> : <UserProfilePage />;
}
