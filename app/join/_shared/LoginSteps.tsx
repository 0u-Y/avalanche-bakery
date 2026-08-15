import { StepHeading } from './JoinShell';

type EmailProps = {
  email: string;
  onEmail: (value: string) => void;
  onCode: () => void;
  onGoogle: () => void;
};

export function EmailStep({ email, onEmail, onCode, onGoogle }: EmailProps) {
  return (
    <>
      <StepHeading
        eyebrow="STEP 01 · 시작"
        title="증서를 받을 계정을 만들어요"
        copy="행사 뒤에도 오늘의 쿠키 증서를 다시 볼 수 있어요."
      />
      <form className="join-form" onSubmit={(event) => { event.preventDefault(); onCode(); }}>
        <label className="join-field">
          <span>이메일</span>
          <input
            type="email"
            value={email}
            onChange={(event) => onEmail(event.target.value)}
            placeholder="name@example.com"
            autoComplete="email"
            required
          />
        </label>
        <button className="join-button is-primary" type="submit">코드 받기</button>
        <div className="join-or"><span>또는</span></div>
        <button className="join-button is-google" type="button" onClick={onGoogle}>
          <i aria-hidden="true">G</i>Google로 계속하기
        </button>
      </form>
    </>
  );
}

export function CodeStep({ code, email, onCode, onNext, onBack }: {
  code: string;
  email: string;
  onCode: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <>
      <StepHeading eyebrow="STEP 01 · 확인" title="메일의 숫자 6자리를 넣어 주세요" copy={`${email}로 보냈어요. 목업에서는 아무 숫자나 입력해도 됩니다.`} />
      <form className="join-form" onSubmit={(event) => { event.preventDefault(); onNext(); }}>
        <label className="join-field code-field">
          <span>확인 코드</span>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            value={code}
            onChange={(event) => onCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="000000"
            autoComplete="one-time-code"
            required
          />
        </label>
        <button className="join-button is-primary" type="submit" disabled={code.length !== 6}>확인하고 계속</button>
        <button className="join-button is-text" type="button" onClick={onBack}>이메일 다시 입력</button>
      </form>
    </>
  );
}
