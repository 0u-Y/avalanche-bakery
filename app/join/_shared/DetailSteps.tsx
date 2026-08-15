import Image from 'next/image';

import { StepHeading } from './JoinShell';

export function NicknameStep({ nickname, onNickname, onNext, onBack }: {
  nickname: string;
  onNickname: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <>
      <StepHeading eyebrow="이름" title="앞 화면에 뜰 이름을 정해요" copy="내 쿠키가 오븐과 진열장으로 갈 때 이 이름이 함께 보여요." />
      <form className="join-form" onSubmit={(event) => { event.preventDefault(); onNext(); }}>
        <label className="join-field nickname-field">
          <span>닉네임</span>
          <input value={nickname} onChange={(event) => onNickname(event.target.value.slice(0, 10))} maxLength={10} placeholder="예: 초코별" required />
          <b>{nickname.length} / 10</b>
        </label>
        <button className="join-button is-primary" type="submit" disabled={!nickname.trim()}>이 이름으로 계속</button>
        <button className="join-button is-text" type="button" onClick={onBack}>이전</button>
      </form>
    </>
  );
}

export function ConsentStep({ tv, nft, onTv, onNft, onNext, onBack }: {
  tv: boolean;
  nft: boolean;
  onTv: () => void;
  onNft: () => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <>
      <StepHeading eyebrow="마지막 확인" title="어디에 보여도 괜찮은지 확인해요" copy="두 내용을 각각 읽고 확인해 주세요." />
      <div className="join-consents">
        <label><input type="checkbox" checked={tv} onChange={onTv} /><i /><span><b>TV 화면에 표시</b><small>쿠키 사진과 닉네임이 행사장 앞 화면에 보여요.</small></span></label>
        <label><input type="checkbox" checked={nft} onChange={onNft} /><i /><span><b>오래 남는 증서로 보관</b><small>공개된 증서는 나중에 완전히 지우기 어려워요.</small></span></label>
      </div>
      <div className="join-actions">
        <button className="join-button is-primary" type="button" onClick={onNext} disabled={!tv || !nft}>확인했어요</button>
        <button className="join-button is-text" type="button" onClick={onBack}>이전</button>
      </div>
    </>
  );
}

export function SubmitStep({ nickname, preview, onSubmit, onBack }: {
  nickname: string;
  preview: string | null;
  onSubmit: () => void;
  onBack: () => void;
}) {
  return (
    <>
      <StepHeading eyebrow="보내기" title="이제 앞 화면으로 보내요" copy="보낸 뒤에는 쿠키가 작업대에서 오븐으로 이동해요." />
      <div className="join-submit-card">
        <div>{preview ? <Image src={preview} alt="제출할 쿠키" fill unoptimized sizes="112px" /> : null}</div>
        <span><small>TV에 표시될 이름</small><b>{nickname}</b></span>
      </div>
      <div className="join-actions">
        <button className="join-button is-primary" type="button" onClick={onSubmit}>쿠키 보내기</button>
        <button className="join-button is-text" type="button" onClick={onBack}>이전</button>
      </div>
    </>
  );
}
