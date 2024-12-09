"use client"
import { useRef } from "react";

export const useTextAnimation = () => {
  // Ensure the ref is typed specifically for HTMLHeadingElement
  const elementRef = useRef<HTMLHeadingElement | null>(null);

  const handleMouseOver = (event: React.MouseEvent<HTMLHeadingElement>) => {
    const element = event.target as HTMLHeadingElement;
    const originalText = element.innerText; // Save original text
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let iterations = 0;

    const interval = setInterval(() => {
      element.innerText = originalText
        .split("")
        .map((letter, index) => {
          if (letter === " ") return " "; // Keep spaces intact
          return iterations > index
            ? originalText[index]
            : letters[Math.floor(Math.random() * 26)];
        })
        .join("");

      iterations += 1;

      if (iterations > originalText.length) {
        clearInterval(interval);
        element.innerText = "Made by Unknowns"; // Restore original text
      }
    }, 30);
  };

  return { elementRef, handleMouseOver };
};

export function HeadersTitle() {
  const { elementRef, handleMouseOver } = useTextAnimation();
  return(
    <>
    <h1 className="text-9xl font-bold text-[#2ECC71] py-10">Sijarta</h1><h2
      ref={elementRef}
      onMouseOver={handleMouseOver}
      className="text-4xl font-semibold text-[#000000] hover:scale-105 transition-transform duration-300"
    >
      Made by Unknowns
    </h2>
    </>
  );
  
}
