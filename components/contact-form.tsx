"use client";

import { useLang } from "@/app/providers";

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-9Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M6.5 7.5 12 12l5.5-4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7.5 3.5h9A4 4 0 0 1 20.5 7.5v9a4 4 0 0 1-4 4h-9a4 4 0 0 1-4-4v-9a4 4 0 0 1 4-4Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M12 15.25a3.25 3.25 0 1 0 0-6.5 3.25 3.25 0 0 0 0 6.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M17.25 6.85h.01"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function ContactForm() {
  const { lang } = useLang();

  const email = "polineguillet@gmail.com";
  const ig1 = "https://www.instagram.com/pau.liine._";
  const ig2 = "https://www.instagram.com/pauline__model";

  return (
    <div className="mt-10">
      <div className="grid lg:grid-cols-12 gap-10 items-start">
        {/* LEFT: Contact list */}
        <div className="lg:col-span-7">
          <div className="text-xs tracking-wide2 text-white/55">CONTACT</div>

          <h2 className="mt-4 text-2xl md:text-3xl">
            {lang === "KR"
              ? "문의는 아래 채널로 바로 연결됩니다."
              : "Direct contact channels."}
          </h2>

          <p className="mt-4 text-white/65 max-w-xl">
            {lang === "KR"
              ? "촬영 및 협업 문의는 이메일 또는 인스타그램 DM으로 부탁드립니다."
              : "For bookings or collaborations, please use email or Instagram DM."}
          </p>

          <div className="mt-8 space-y-3 max-w-3xl">
            <a href={`mailto:${email}`} className="contactRow" aria-label="Email">
              <div className="iconBox">
                <MailIcon />
              </div>
              <div className="label">EMAIL</div>
              <div className="value">{email}</div>
            </a>

            <a
              href={ig1}
              target="_blank"
              rel="noreferrer"
              className="contactRow"
              aria-label="Instagram 1"
            >
              <div className="iconBox">
                <InstagramIcon />
              </div>
              <div className="label">INSTAGRAM</div>
              <div className="value">@pau.liine._</div>
            </a>

            <a
              href={ig2}
              target="_blank"
              rel="noreferrer"
              className="contactRow"
              aria-label="Instagram 2"
            >
              <div className="iconBox">
                <InstagramIcon />
              </div>
              <div className="label">INSTAGRAM</div>
              <div className="value">@pauline__model</div>
            </a>
          </div>

          <div className="mt-8 text-sm text-white/55 leading-relaxed max-w-xl">
            {lang === "KR"
              ? "프로젝트 개요 / 일정 / 예산 범위를 함께 전달해주시면 더 빠르게 답변 가능합니다."
              : "Sharing overview / timeline / budget range helps speed up the response."}
          </div>
        </div>

        {/* RIGHT: Details (복구) */}
        <div className="lg:col-span-5 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-soft">
          <div className="text-xs tracking-wide2 text-white/55">
            {lang === "KR" ? "정보" : "DETAILS"}
          </div>

          <div className="mt-5 space-y-5 text-sm text-white/65">
            <div className="flex items-start justify-between gap-6">
              <div className="text-white/45">{lang === "KR" ? "거점" : "Base"}</div>
              <div className="text-right">Seoul, South Korea</div>
            </div>

            <div className="flex items-start justify-between gap-6">
              <div className="text-white/45">Email</div>
              <div className="text-right break-all">{email}</div>
            </div>

            <div className="flex items-start justify-between gap-6">
              <div className="text-white/45">Instagram</div>
              <div className="text-right">
                <div>@pau.liine._</div>
                <div>@pauline__model</div>
              </div>
            </div>

            <div className="pt-5 border-t border-white/10 text-sm text-white/55 leading-relaxed">
              {lang === "KR"
                ? "업무 문의는 이메일을 우선 권장합니다. 급한 일정은 인스타그램 DM으로도 가능합니다."
                : "Email is preferred for business inquiries. For urgent requests, Instagram DM is also available."}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .contactRow {
          height: 64px;
          display: grid;
          grid-template-columns: 56px 110px 1fr;
          align-items: center;
          gap: 14px;
          padding: 0 16px;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.04);
          transition: all 160ms ease;
        }

        .contactRow:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.22);
          transform: translateY(-1px);
        }

        .contactRow:active {
          transform: translateY(1px);
        }

        .iconBox {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.14);
        }

        .iconBox svg {
          width: 18px;
          height: 18px;
          color: rgba(255, 255, 255, 0.85);
        }

        .label {
          font-size: 11px;
          letter-spacing: 0.14em;
          color: rgba(255, 255, 255, 0.55);
        }

        .value {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.9);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      `}</style>
    </div>
  );
}
