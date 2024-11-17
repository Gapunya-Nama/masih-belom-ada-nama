"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { JobOrders } from "./JobOrders";
import { JobStatus } from "./JobStatus";

export function JobsCarousel() {
  return (
    <Carousel className="w-full">
      <CarouselContent>
        <CarouselItem>
          <JobOrders />
        </CarouselItem>
        <CarouselItem>
          <JobStatus />
        </CarouselItem>
      </CarouselContent>
      <div className="flex justify-end gap-2 pt-4">
        <CarouselPrevious />
        <CarouselNext />
      </div>
    </Carousel>
  );
}