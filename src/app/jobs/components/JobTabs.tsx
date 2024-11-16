"use client";

import { useState, useRef, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JobOrders } from "./JobOrders";
import { JobStatus } from "./JobStatus";

export function JobTabs() {
  const [activeTab, setActiveTab] = useState("orders");
  const [underlineStyle, setUnderlineStyle] = useState({});
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tabsContainer = tabsRef.current;
    if (tabsContainer) {
      const activeTabElement = tabsContainer.querySelector(
        `[data-state="active"]`
      ) as HTMLElement;
      if (activeTabElement) {
        setUnderlineStyle({
          width: activeTabElement.offsetWidth,
          transform: `translateX(${activeTabElement.offsetLeft}px)`,
        });
      }
    }
  }, [activeTab]);

  return (
    <Tabs
      defaultValue="orders"
      onValueChange={(value) => setActiveTab(value)}
      className="w-full"
    >
      <div className="relative w-full">
        {/* Tabs List */}
        <TabsList
          ref={tabsRef}
          className="relative flex bg-transparent border-none"
          style={{
            position: "relative",
            borderBottom: "0px", // Completely remove any border
            paddingBottom: "0px", // Ensure no padding below
          }}
        >
          {/* Underline */}
          <div
            className="absolute bottom-0 h-[2px] bg-green-600 transition-all duration-300 ease-in-out"
            style={underlineStyle}
          ></div>
          {/* Tab Buttons */}
          <TabsTrigger
            value="orders"
            className={`relative z-10 py-2 px-4 focus:outline-none transition-all duration-300 ${
              activeTab === "orders"
                ? "text-green-600 font-bold"
                : "text-gray-500 font-medium hover:text-green-600"
            }`}
            style={{
              borderBottom: "0px", // No border even when inactive
            }}
          >
            Pesanan Jasa
          </TabsTrigger>
          <TabsTrigger
            value="status"
            className={`relative z-10 py-2 px-4 focus:outline-none transition-all duration-300 ${
              activeTab === "status"
                ? "text-green-600 font-bold"
                : "text-gray-500 font-medium hover:text-green-600"
            }`}
            style={{
              borderBottom: "0px", // No border even when inactive
            }}
          >
            Status Pekerjaan
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="orders">
        <JobOrders />
      </TabsContent>
      <TabsContent value="status">
        <JobStatus />
      </TabsContent>
    </Tabs>
  );
}