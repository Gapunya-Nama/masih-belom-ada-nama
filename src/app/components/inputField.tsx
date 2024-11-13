"use client"
import React, { useEffect, useRef } from 'react';

interface InputFieldProps {
  label: string;
  animate?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({ label, animate }) => {
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (animate) {
      animateText(label, labelRef, 'cardSubtitleWord');
    }
  }, [label, animate]);

  return (
    <div className="bg-white rounded-xl">
      <label className="relative block overflow-hidden border-collapse border-white px-3 pt-3 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
        <input
          type="text"
          id={label.toLowerCase()}
          name={label.toLowerCase()}
          placeholder={label}
          className="peer h-8 w-full border-none bg-white p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
        />
        <span
          ref={labelRef}
          className="absolute start-3 top-3 -translate-y-1/2 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs"
        >
          {label}
        </span>
      </label>
    </div>
  );
};

// Reuse animateText function from DiscordCard file if possible
const animateText = (text: string, ref: React.RefObject<HTMLElement>, className: string) => {
  const createWord = (wordText: string, index: number) => {
    const word = document.createElement('span');
    word.innerHTML = `${wordText} `;
    word.classList.add(className);
    word.style.transitionDelay = `${index * 40}ms`;
    return word;
  };

  if (ref.current) {
    ref.current.innerHTML = ''; // Clear existing text
    text.split(' ').forEach((word, index) => {
      ref.current!.appendChild(createWord(word, index));
    });
  }
};

export default InputField;
