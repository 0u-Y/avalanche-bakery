'use client';

import { motion } from 'framer-motion';

import type { Entry } from '@/lib/types';

import { CookieCard } from './CookieCard';
import { ZoneHeading } from './ZoneHeading';

type LayoutTransition = { layout: { duration: number; ease: [number, number, number, number] } };

export function Showcase({
  entries,
  celebratingIds,
  transition,
}: {
  entries: Entry[];
  celebratingIds: Set<string>;
  transition: LayoutTransition;
}) {
  const slots = Array.from({ length: 15 }, (_, shelfIndex) => (
    entries.find((entry) => entry.shelfIndex === shelfIndex)
  ));
  return (
    <motion.section className="showcase zone" layout transition={transition}>
      <ZoneHeading
        step="STEP 03 · KEEPSAKE"
        label="오늘의 쿠키 진열장"
        count={entries.length}
        total={15}
        className="showcase-heading"
      />
      <motion.div className="shelf-frame" layout>
        <div className="shelf-grid">
          {slots.map((entry, index) => (
            <motion.div
              className={`shelf-slot ${entry && celebratingIds.has(entry.id) ? 'is-lit' : ''}`}
              key={index}
              layout
            >
              <span className="shelf-number">{String(index + 1).padStart(2, '0')}</span>
              {entry ? (
                <CookieCard entry={entry} celebrating={celebratingIds.has(entry.id)} />
              ) : (
                <span className="empty-slot">다음 쿠키를<br />기다리는 중</span>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.section>
  );
}
