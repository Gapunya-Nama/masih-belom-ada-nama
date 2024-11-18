"use client";

import { BriefcaseIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { JobTabs } from "./components/JobTabs";

export default function JobsPage() {
  return (
    <div className="pt-16">
    <div className="min-h-screen bg-[#F3F3F3]">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8 flex items-center gap-2">
          <BriefcaseIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            View Pekerjaan Jasa
          </h1>
        </div>

        {/* Job Tabs */}
        <Card className="p-6">
          <JobTabs />
        </Card>
      </div>
    </div>
    </div>
  );
}
