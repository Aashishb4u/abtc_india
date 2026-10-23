"use client";

import { useId } from "react";

type Tone = "light" | "dark";

export function AbtcSeal({ className, tone = "light" }: { className?: string; tone?: Tone }) {
  const id = useId().replace(/:/g, "");
  const stroke = tone === "light" ? "#17145B" : "#FFFFFF";
  const fill = tone === "light" ? "#FAFBFD" : "#17145B";
  return (
    <svg viewBox="0 0 120 75" fill="none" className={className} role="img" aria-label="ABTC India seal">
      <ellipse cx="60" cy="37.5" rx="58" ry="35" fill={fill} stroke={stroke} strokeWidth="2.5" />
      <ellipse
        cx="60"
        cy="37.5"
        rx="53"
        ry="30.5"
        stroke={tone === "light" ? stroke : "#0799E8"}
        strokeDasharray="2.5 2"
        strokeWidth="1"
      />
      <path id={`${id}-top`} d="M 18 36 A 42 22 0 0 1 102 36" fill="none" />
      <text
        fill={stroke}
        fontSize="6.5"
        fontWeight="700"
        letterSpacing="0.8"
        style={{ fontFamily: "var(--font-body)" }}
      >
        <textPath href={`#${id}-top`} startOffset="50%" textAnchor="middle">
          {"BEAUTY THERAPY & COSMETOLOGY"}
        </textPath>
      </text>
      <text
        x="60"
        y="40"
        textAnchor="middle"
        fill={stroke}
        fontSize="18"
        fontWeight="700"
        letterSpacing="1.5"
        style={{ fontFamily: "var(--font-display)" }}
      >
        ABTC
      </text>
      <text
        x="60"
        y="52"
        textAnchor="middle"
        fill="#0799E8"
        fontSize="7.5"
        fontWeight="800"
        letterSpacing="1.5"
        style={{ fontFamily: "var(--font-body)" }}
      >
        INDIA
      </text>
    </svg>
  );
}

export function CidescoSeal({ className }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 100 100" fill="none" className={className} role="img" aria-label="CIDESCO International emblem">
      <circle cx="50" cy="50" r="48" fill="#17145B" stroke="#17145B" strokeWidth="2.5" />
      <circle cx="50" cy="50" r="44" stroke="#fff" strokeDasharray="2 2" strokeWidth="1.2" />
      <path id={`${id}-t`} d="M 16 50 A 34 34 0 0 1 84 50" fill="none" />
      <text fill="#fff" fontSize="7" fontWeight="800" letterSpacing="1.2" style={{ fontFamily: "var(--font-body)" }}>
        <textPath href={`#${id}-t`} startOffset="50%" textAnchor="middle">
          CIDESCO
        </textPath>
      </text>
      <text
        x="50"
        y="54"
        textAnchor="middle"
        fill="#fff"
        fontSize="24"
        fontWeight="600"
        style={{ fontFamily: "var(--font-display)" }}
      >
        ©
      </text>
      <path id={`${id}-b`} d="M 84 50 A 34 34 0 0 1 16 50" fill="none" />
      <text fill="#cde5ff" fontSize="6" fontWeight="700" letterSpacing="1" style={{ fontFamily: "var(--font-body)" }}>
        <textPath href={`#${id}-b`} startOffset="50%" textAnchor="middle">
          EST. ZURICH 1946
        </textPath>
      </text>
    </svg>
  );
}
