'use client'
import React, { useEffect, useRef } from 'react';
import styles from '@/app/components/discordCard.module.css';
import InputField from './inputField';
import ToggleElement from './toggleElement';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"


const DiscordCard: React.FC = ({ }) => {
  const subtitleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const subtitleText =
      "Kontennya mau apa";

    const createWord = (text: string, index: number) => {
      const word = document.createElement('span');
      word.innerHTML = `${text} `;
      word.classList.add(styles.cardSubtitleWord);
      word.style.transitionDelay = `${index * 40}ms`;
      return word;
    };

    const addWord = (text: string, index: number) => {
      if (subtitleRef.current) {
        subtitleRef.current.appendChild(createWord(text, index));
      }
    };

    subtitleText.split(" ").forEach(addWord);
  }, []);

  return (
    <div className={styles.card}>
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>Login</h3>
        <Divider />
        <h4 className={`${styles.cardSubtitle} ${styles.hoverHidden}`} ref={subtitleRef}>Ini defaultnya mau apa</h4>
        <h4 className={styles.cardSubtitle} ref={subtitleRef}></h4>
        <Collapsible>
          <CollapsibleTrigger>Can I use this in my project?</CollapsibleTrigger>
          <CollapsibleContent>
            Yes. Free to use for personal and commercial projects. No attribution
            required.
          </CollapsibleContent>
        </Collapsible>

        <InputField label='Username' />
      </div>
    </div>
  );
};

const Divider = () => {
  return <div className={styles.divider}></div>;
};

export default DiscordCard;
