"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi
} from "@/components/ui/carousel";
import React from "react";

function Home() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [, setIsMounted] = React.useState(false); 
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    api.scrollTo(1);
    setIsMounted(true);
    setCurrent(api.selectedScrollSnap() + 1);

    const handleSelect = () => setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", handleSelect);

    return () => {
      api.off("select", handleSelect);
    };
  }, [api]);

  const handlePrevious = () => {
    if (api) {
      if (current === 1) {
        api.scrollTo(count - 1);
      } else {
        api.scrollPrev();
      }
    }
  };

  const handleNext = () => {
    if (api) {

      if (current === count) {
        api.scrollTo(0);
      } else {
        api.scrollNext();
      }
    }
  };

  return (
    <div>
      <Carousel setApi={setApi}>
        <CarouselContent className="mb-4">

          <CarouselItem className="flex flex-col justify-center items-center">
            <div className="space-x-4">
            <button
              onClick={handlePrevious}
              className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
            >
              Next
            </button>
            </div>
          </CarouselItem>


          <CarouselItem className="flex flex-col justify-center items-center h-screen">
            <h1 className="text-9xl font-bold text-[#2ECC71] py-10">Sijarta</h1>
            <div className="space-x-4">
            <button
              onClick={handlePrevious}
              className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
            >
              Register
            </button>
            <button
              onClick={handleNext}
              className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
            >
              Login
            </button></div>
          </CarouselItem>


          <CarouselItem className="flex flex-col justify-center items-center">
            <div className="space-x-4">
            <button
              onClick={handlePrevious}
              className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
            >
              Next
            </button>
            </div>
          </CarouselItem>

        </CarouselContent>
      </Carousel>

      {/* <div className="flex justify-center space-x-4 mt-4">
        <button
          onClick={handlePrevious}
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
        >
          Next
        </button>
      </div> */}


    </div>
  );
}

export default Home;
