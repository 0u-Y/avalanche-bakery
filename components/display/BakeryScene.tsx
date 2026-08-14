'use client';

import { LayoutGroup, motion, useReducedMotion } from 'framer-motion';
import { useMemo } from 'react';

import type { EntryStatus, StateResponse } from '@/lib/types';

import { Oven } from './Oven';
import { Showcase } from './Showcase';
import { TopBar } from './TopBar';
import { Workbench } from './Workbench';
import { DISPLAY_EASE } from './motion';

const WORKBENCH_STATUSES = new Set<EntryStatus>([
  'SUBMITTED',
  'RENDERED',
  'PINNED',
  'FAILED',
]);

export function BakeryScene({
  state,
  celebratingIds,
}: {
  state: StateResponse;
  celebratingIds: Set<string>;
}) {
  const reduceMotion = useReducedMotion();
  const visibleEntries = useMemo(
    () => state.entries.filter((entry) => !entry.hidden),
    [state.entries],
  );
  const workbenchEntries = visibleEntries.filter((entry) => (
    WORKBENCH_STATUSES.has(entry.status)
  ));
  const ovenEntries = visibleEntries.filter((entry) => entry.status === 'MINTING');
  const shelfEntries = visibleEntries.filter((entry) => entry.status === 'MINTED');
  const layoutTransition = {
    layout: {
      duration: reduceMotion ? 0 : 0.65,
      ease: DISPLAY_EASE,
    },
  };

  return (
    <section className="bakery-scene">
      <TopBar counts={state.counts} />
      <LayoutGroup id="bakery-entry-flow">
        <motion.div
          className="bakery-floor"
          data-layout={state.show.layout.toLowerCase()}
          layout
          transition={layoutTransition}
        >
          <Workbench
            entries={workbenchEntries}
            qrVisible={state.show.qrVisible && state.show.layout === 'LIVE'}
            transition={layoutTransition}
          />
          <Oven entries={ovenEntries} transition={layoutTransition} />
          <Showcase
            entries={shelfEntries}
            celebratingIds={celebratingIds}
            transition={layoutTransition}
          />
        </motion.div>
      </LayoutGroup>
    </section>
  );
}
