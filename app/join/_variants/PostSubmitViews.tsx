'use client';

import { motion, useReducedMotion } from 'framer-motion';

import type { JoinSubmission } from '../_shared/joinTypes';

export const GUIDED_STEPS = [
  ['사진 저장됨', '방금 찍은 사진을 안전하게 받았어요.'],
  ['증서 만드는 중', '사진과 이름을 오늘의 참가 증서에 담아요.'],
  ['굽는 중', '공개된 기록으로 남겨 누구나 확인할 수 있게 해요.'],
  ['진열 완료', '앞 화면 7번 칸에 당신의 증서가 놓였어요.'],
] as const;

export function AutomaticPost({ submission }: { submission: JoinSubmission }) {
  return (
    <section className="join-step post-submit post-a">
      <span className="post-kicker">자동으로 진행 중</span>
      <h1>당신의 쿠키를<br />굽고 있어요</h1>
      <div className="look-up-message">
        <small>지금은 폰에서 할 일이 없어요</small>
        <strong>고개를 들어<br />앞 화면을 보세요</strong>
      </div>
      <p>당신의 자리는 <b>{submission.shelfNumber}번 칸</b></p>
    </section>
  );
}

export function GuidedPost({ phase }: { phase: number }) {
  return (
    <section className="join-step post-submit post-b">
      <header><span className="post-kicker">자동으로 진행 중</span><h1>쿠키가 증서가 되는 길</h1></header>
      <ol className="guided-steps">
        {GUIDED_STEPS.map(([title, copy], index) => (
          <li className={index === phase ? 'is-current' : index < phase ? 'is-past' : ''} key={title}>
            <i>{index + 1}</i><span><b>{title}</b><small>{copy}</small></span>
          </li>
        ))}
      </ol>
      <p className="guided-note">버튼을 누를 필요 없어요. 과정이 끝나면 알려드릴게요.</p>
    </section>
  );
}

export function ParticipatoryPost({ submission, started, onStart }: {
  submission: JoinSubmission;
  started: boolean;
  onStart: () => void;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <section className={`join-step post-submit post-c ${started ? 'is-started' : ''}`}>
      {!started ? (
        <>
          <span className="post-kicker">모두 함께 시작해요</span>
          <h1>쿠키를 오븐에 넣을 준비가 됐어요</h1>
          <div className="operator-callout"><i /><b>운영자 안내를 기다려 주세요</b><small>“다 같이 눌러 주세요”라는 말을 들으면 시작해요.</small></div>
          <motion.button className="oven-action" type="button" onClick={onStart} whileTap={reduceMotion ? undefined : { scale: 0.94, y: 4 }} transition={{ duration: 0.16 }}>
            오븐에 넣기
          </motion.button>
        </>
      ) : (
        <div className="c-started-message">
          <span>오븐이 시작됐어요</span>
          <strong>고개를 들어<br />앞 화면을 보세요</strong>
          <p>{submission.nickname} 쿠키가 지금 오븐으로 이동해요.</p>
        </div>
      )}
    </section>
  );
}
