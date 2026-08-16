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
          <h1>완성됐어요</h1>
        </header>

        <article className="join-certificate">
          <header className="join-certificate-brand">
            <span>AVALANCHE BAKERY</span>
          </header>
          <div className="join-certificate-photo">
            <div className="complete-cookie-placeholder" aria-hidden="true">
              <span><i /><i /><i /></span>
            </div>
            {submission.photoPreview ? (
              <Image
                src={submission.photoPreview}
                alt={`${submission.nickname}의 쿠키`}
                fill
                unoptimized
                sizes="320px"
              />
            ) : null}
          </div>
          <div className="join-certificate-id">
            <span>{submission.nickname}의 증서</span>
            <strong>#{submission.tokenId}</strong>
          </div>
        </article>

        <p className="complete-shelf-note">
          앞 화면 <b>{String(submission.shelfNumber).padStart(2, '0')}</b>번 칸에도 놓였어요
        </p>
      </section>
    </JoinShell>
  );
}
