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
        element.innerText = originalText; // Restore original text
      }
    }, 30);
  };

  return { elementRef, handleMouseOver };
};
