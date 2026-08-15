import Image from 'next/image';

import type { JoinSubmission } from './joinTypes';
import { JoinShell } from './JoinShell';

export function CompletionScreen({ submission, embedded = false }: {
  submission: JoinSubmission;
  embedded?: boolean;
}) {
  return (
    <JoinShell currentStep={5} embedded={embedded}>
      <section className="join-step join-complete">
        <header className="complete-heading">
          <span>BAKED &amp; DISPLAYED</span>
          <h1>오늘의 증서가 완성됐어요</h1>
          <p>앞 화면 {submission.shelfNumber}번 칸에도 진열됐어요.</p>
        </header>
        <div className="join-certificate">
          <div className="certificate-art" aria-hidden="true">
            <b>A</b><i /><span />
          </div>
          <Image
            src="/mock/certificate-1.jpg"
            alt={`${submission.nickname}의 참가 증서`}
            fill
            unoptimized
            sizes="320px"
            onError={(event) => { event.currentTarget.style.display = 'none'; }}
          />
          <strong>#{submission.tokenId}</strong>
          <small>{submission.nickname}</small>
        </div>
        <p className="complete-note">로그인한 계정에서 행사 뒤에도 다시 볼 수 있어요.</p>
      </section>
    </JoinShell>
  );
}
