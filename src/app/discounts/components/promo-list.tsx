"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";

const promos = [
  {
    code: "SUMMER2024",
    endDate: "2024-06-30",
    description: "Summer Special: Get 30% off on selected items",
  },
  {
    code: "FLASH50",
    endDate: "2024-04-15",
    description: "Flash Sale: 50% discount on premium subscriptions",
  },
  {
    code: "WEEKEND25",
    endDate: "2024-04-30",
    description: "Weekend Deal: 25% off on all services",
  },
];

export function PromoList() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {promos.map((promo) => (
        <Card key={promo.code}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-lg">
              <span>{promo.code}</span>
              <div className="flex items-center text-sm text-muted-foreground">
                <CalendarDays className="w-4 h-4 mr-1" />
                <span>Until {new Date(promo.endDate).toLocaleDateString()}</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{promo.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}