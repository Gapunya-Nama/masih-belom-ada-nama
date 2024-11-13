"use client";

import DiscordCard from '@/app/components/discordCard';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselApi
} from "@/components/ui/carousel";
import React from 'react';

export function Home() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="relative">
      <Carousel setApi={setApi}>
        <CarouselContent>
          <CarouselItem className="flex justify-center items-center">
            <DiscordCard />
          </CarouselItem>
          <CarouselItem className="flex justify-center items-center">
            <DiscordCard />
          </CarouselItem>
          <CarouselItem className="flex justify-center items-center">
            <DiscordCard />
          </CarouselItem>
        </CarouselContent>

        {/* Next and Previous Buttons */}
        <CarouselPrevious className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-200 p-2 rounded-full hover:bg-gray-300">
          Prev
        </CarouselPrevious>
        <CarouselNext className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-200 p-2 rounded-full hover:bg-gray-300">
          Next
        </CarouselNext>
      </Carousel>

      {/* Pagination Indicator */}
      <div className="text-center mt-4">
        {current} / {count}
      </div>
    </div>
  );
};

export default Home;
