'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';

import type { Entry } from '@/lib/types';

import { DISPLAY_EASE } from './motion';

const STATUS_LABEL = {
  SUBMITTED: '사진 도착',
  RENDERED: '증서 준비',
  PINNED: '굽기 대기',
  MINTING: '굽는 중',
  MINTED: '진열 완료',
  FAILED: '다시 확인',
} as const;

function imageNumber(entry: Entry) {
  const value = Number(entry.id.replace(/\D/g, ''));
  return Number.isFinite(value) ? value : 1;
}

export function CookieCard({
  entry,
  celebrating = false,
}: {
  entry: Entry;
  celebrating?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const minted = entry.status === 'MINTED';
  const imageUrl = minted ? entry.certificateUrl : entry.photoUrl;
  const variation = ((imageNumber(entry) - 1) % 15) + 1;
  const activeMotion = celebrating
    ? { scale: [0.96, 1.04, 1], rotate: [-1, 1, 0], x: 0 }
    : entry.status === 'MINTING' && !reduceMotion
      ? { scale: [0.96, 0.9, 0.92], rotate: 0, x: [0, 1, -1, 0] }
      : { scale: 1, rotate: 0, x: 0 };

  return (
    <motion.article
      layout
      layoutId={entry.id}
      initial={false}
      className={`cookie-card ${minted ? 'certificate-card' : 'photo-card'} ${
        celebrating ? 'is-celebrating' : ''
      }`}
      data-status={entry.status}
      animate={reduceMotion ? { scale: 1, rotate: 0, x: 0 } : activeMotion}
      transition={{
        layout: {
          duration: reduceMotion ? 0 : 0.65,
          ease: DISPLAY_EASE,
        },
        x: {
          duration: 0.4,
          repeat: entry.status === 'MINTING' && !reduceMotion ? Infinity : 0,
          ease: DISPLAY_EASE,
        },
        scale: { duration: 0.4, ease: DISPLAY_EASE },
      }}
    >
      <div className="card-media">
        {minted ? <CertificatePlaceholder variation={variation} /> : <CookiePlaceholder variation={variation} />}
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={minted ? `${entry.nickname}의 참가증서` : `${entry.nickname}의 쿠키`}
            fill
            unoptimized
            sizes="320px"
            onError={(event) => { event.currentTarget.style.display = 'none'; }}
          />
        ) : null}
        <span className="status-ticket">{STATUS_LABEL[entry.status]}</span>
      </div>
      <div className="card-caption">
        {minted ? (
          <>
            <strong>#{entry.tokenId}</strong>
            <span className="card-nickname">{entry.nickname}</span>
          </>
        ) : (
          <>
            <strong>{entry.nickname}</strong>
            <span className="card-step">
              {entry.status === 'MINTING' ? '오늘의 증서를 굽고 있어요' : STATUS_LABEL[entry.status]}
            </span>
          </>
        )}
      </div>
    </motion.article>
  );
}

function CookiePlaceholder({ variation }: { variation: number }) {
  return (
    <div className="cookie-placeholder" aria-hidden="true">
      <span className={`cookie-shape cookie-variant-${variation}`}><i /><i /><i /><i /></span>
    </div>
  );
}

function CertificatePlaceholder({ variation }: { variation: number }) {
  return (
    <div className="certificate-placeholder" aria-hidden="true">
      <span className="certificate-ava">A</span>
      <span className={`certificate-cookie cookie-variant-${variation}`}><i /><i /><i /></span>
      <span className="certificate-lines" />
    </div>
  );
}
