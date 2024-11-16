import React, { forwardRef } from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { clsx } from "clsx";

export const Tabs = TabsPrimitive.Root;

export const TabsList = forwardRef<HTMLDivElement, TabsPrimitive.TabsListProps>(
  ({ className, ...props }, ref) => (
    <TabsPrimitive.List
      ref={ref}
      className={clsx(
        "flex gap-4 border-b border-gray-200 dark:border-gray-700",
        className
      )}
      {...props}
    />
  )
);

TabsList.displayName = "TabsList";

export const TabsTrigger = ({ className, ...props }: TabsPrimitive.TabsTriggerProps) => (
  <TabsPrimitive.Trigger
    className={clsx(
      "py-2 px-4 font-medium text-gray-600 dark:text-gray-400 transition-colors hover:text-gray-800 dark:hover:text-gray-200 data-[state=active]:text-green-600 data-[state=active]:font-bold border-b-2 data-[state=active]:border-green-600",
      className
    )}
    {...props}
  />
);

export const TabsContent = ({ className, ...props }: TabsPrimitive.TabsContentProps) => (
  <TabsPrimitive.Content className={clsx("mt-4", className)} {...props} />
);
