"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi
} from "@/components/ui/carousel";
import React from "react";
import LoginPage from "./login";
import { Button } from "@/components/ui/button";
import RegisterPage from "../register/register";
import { HeadersTitle } from "./components/hackerEffect";
import styles from "./components/login.module.css"

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

  const goToLogin = () => {
    if (api) {
      api.scrollTo(2);
    }
  };

  const goToRegister = () => {
    if (api) {
      api.scrollTo(0);
    }
  };

  return (
    <div className="h-screen">
      <Carousel setApi={setApi} className="h-full">
        <CarouselContent className="h-full">

          <CarouselItem className="bg-gradient-to-b from-green-50 to-white dark:from-green-950 dark:to-background flex flex-col justify-center items-center">
            <RegisterPage />
            <div className="mt-4 space-x-4">
              <Button
                onClick={handlePrevious}
                variant="outline"
              >
                Previous
              </Button>
              <Button
                onClick={handleNext}
                variant="outline"
              >
                Next
              </Button>
            </div>
          </CarouselItem>


          <CarouselItem className="bg-gradient-to-b from-green-50 to-white dark:from-green-950 dark:to-background flex flex-col justify-center items-center h-screen">
            <HeadersTitle />
            <div className="space-x-4 space-y-5">
              <Button
                onClick={goToRegister}
                variant="outline"
                className="bg-green-600 text-white hover:bg-green-700"
              >
                Register
              </Button>
              <Button
                onClick={goToLogin}
                variant="outline"
              >
                Login
              </Button>
            </div>
          </CarouselItem>


          <CarouselItem className="bg-gradient-to-b from-green-50 to-white dark:from-green-950 dark:to-background flex flex-col justify-center items-center">
            <LoginPage />
            <div className="mt-4 space-x-4">
              <Button
                onClick={handlePrevious}
                variant="outline"
              >
                Previous
              </Button>
              <Button
                onClick={handleNext}
                variant="outline"
              >
                Next
              </Button>
            </div>
          </CarouselItem>

        </CarouselContent>
      </Carousel>

    </div>
  );
}

export default Home;
