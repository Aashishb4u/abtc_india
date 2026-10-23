"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { PanelShell } from "@/components/motion/PanelShell";
import { RiseGrid } from "@/components/motion/RiseGrid";
import { SplitHeading } from "@/components/motion/SplitHeading";

const light = "rounded-3xl border border-white/80 bg-white/70 p-6 shadow-glass backdrop-blur-xl sm:p-10 md:p-14";

const OFFICERS = [
  ["President", "Smita Deo", "9890744545"],
  ["Chairperson", "Anjali Joshi", "9766606869"],
  ["Secretary", "Vandana Jagtap", "9860301750"],
  ["Treasurer", "Namrata Goud", "9822098522"],
  ["Education & schools", "Deepaa Bhagwat", "9422086335"],
  ["Education & schools", "Bina Chetty", "9619205444"],
  ["Program in charge", "Rashmi Tapkir", "8983211181"],
  ["Program in charge", "Geeta Pardeshi", "9766805986"],
];

export function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="space-y-16 md:space-y-24">
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <PanelShell className={light}>
          <Badge>Secretariat & inquiries</Badge>
          <SplitHeading as="h1" type="words" className="mt-4 font-display text-4xl font-bold text-royal-navy sm:text-5xl">
            Contact Us
          </SplitHeading>
          <p className="mt-3 max-w-3xl font-medium text-electric-blue">
            Association of Beauty Therapy & Cosmetology (India) · Indian Section of CIDESCO International
          </p>
          <p className="mt-2 max-w-2xl text-sm text-text-subtle">
            Headquarters, accreditation, the diploma register, and secretariat contacts.
          </p>
        </PanelShell>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="space-y-5 lg:col-span-5">
            <div className="rounded-3xl border border-white/80 bg-white/80 p-6 shadow-glass sm:p-8">
              <p className="text-[11px] font-bold uppercase tracking-widest text-electric-blue">Registered head office</p>
              <h2 className="mt-2 font-display text-2xl font-bold text-royal-navy">ABTC India Secretariat</h2>
              <address className="mt-3 not-italic text-sm leading-relaxed text-text-subtle">
                Radhakunj CHS Ltd, Flat No. 1/A, Ground Floor, D Wing,<br />
                Manmala Tank Road, Mahim, Mumbai 400 016,<br />
                Maharashtra, India.
              </address>
              <div className="mt-5 space-y-2 text-sm">
                <a href="tel:9820994882" className="flex items-center gap-2 font-semibold text-royal-navy"><Icon name="call" className="text-electric-blue" /> 9820994882</a>
                <a href="mailto:abtcindia@gmail.com" className="flex items-center gap-2 font-semibold text-royal-navy"><Icon name="mail" className="text-electric-blue" /> abtcindia@gmail.com</a>
                <a href="https://www.abtcindia.com" className="flex items-center gap-2 font-semibold text-royal-navy"><Icon name="language" className="text-electric-blue" /> www.abtcindia.com</a>
              </div>
              <p className="mt-5 rounded-xl bg-royal-navy px-4 py-3 text-sm text-white">Registered No. FI1552 · National section of CIDESCO International, Zurich</p>
            </div>
            <a
              href="https://maps.google.com/?q=Manmala+Tank+Road+Mahim+Mumbai+400016"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between rounded-2xl border border-ice-blue bg-white px-5 py-4 text-sm font-bold text-royal-navy shadow-glass"
            >
              Directions · Mahim, Mumbai
              <Icon name="directions" className="text-electric-blue" />
            </a>
          </div>

          <form
            className="rounded-3xl border border-white/80 bg-white p-6 shadow-glass sm:p-8 lg:col-span-7"
            onSubmit={(e) => { e.preventDefault(); setSent(true); }}
          >
            <p className="text-[11px] font-bold uppercase tracking-widest text-electric-blue">Official communication</p>
            <h2 className="mt-1 font-display text-2xl font-bold text-royal-navy">Send in your enquiry</h2>
            {sent ? (
              <p className="mt-6 rounded-xl bg-ice-blue p-4 text-sm text-royal-navy">Thank you. The secretariat will reply to the address you entered.</p>
            ) : (
              <div className="mt-6 space-y-4">
                <Field label="Full name" name="name" />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Phone" name="phone" type="tel" />
                  <Field label="Email" name="email" type="email" />
                </div>
                <label className="block text-xs font-bold uppercase tracking-wider text-royal-navy">
                  Interested in
                  <select name="topic" required className="mt-1 w-full rounded-xl border border-ice-blue bg-white px-3 py-3 text-sm font-medium normal-case tracking-normal">
                    <option value="">Please select</option>
                    <option>CIDESCO school accreditation</option>
                    <option>CIDESCO centre accreditation</option>
                    <option>ABTC exam inquiry</option>
                    <option>CIDESCO diploma verification</option>
                    <option>Life membership</option>
                    <option>General secretariat</option>
                  </select>
                </label>
                <label className="block text-xs font-bold uppercase tracking-wider text-royal-navy">
                  Message
                  <textarea name="message" required rows={5} className="mt-1 w-full rounded-xl border border-ice-blue px-3 py-3 text-sm font-medium normal-case tracking-normal" />
                </label>
                <button type="submit" className="rounded-xl bg-royal-navy px-8 py-3 text-xs font-bold uppercase tracking-wider text-white">
                  Submit enquiry
                </button>
              </div>
            )}
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <PanelShell className={light}>
          <p className="text-[11px] font-bold uppercase tracking-widest text-electric-blue">2026–2029</p>
          <SplitHeading type="words" className="mt-2 font-display text-3xl font-bold text-royal-navy">Head Office Mumbai – Committee Members</SplitHeading>
          <div className="mt-6 rounded-2xl border-l-4 border-royal-navy bg-white p-5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-electric-blue">Founder & trustee</p>
            <p className="font-display text-xl font-bold text-royal-navy">Late Maya Paranjapye</p>
          </div>
          <RiseGrid className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {OFFICERS.map(([role, name, phone]) => (
              <div key={name} className="rounded-xl border border-ice-blue bg-white p-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-electric-blue">{role}</p>
                <p className="font-display text-lg font-bold text-royal-navy">{name}</p>
                <a href={`tel:${phone}`} className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-electric-blue">
                  <Icon name="call" className="text-base" /> {phone}
                </a>
              </div>
            ))}
          </RiseGrid>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {["Madhuri Bhandare", "Rakhee Rathod"].map((name) => (
              <div key={name} className="rounded-xl border border-ice-blue bg-white p-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-text-subtle">Sub committee · 2026–2029</p>
                <p className="font-display font-bold text-royal-navy">{name}</p>
              </div>
            ))}
          </div>
        </PanelShell>
      </section>
    </div>
  );
}

function Field({ label, name, type = "text" }: { label: string; name: string; type?: string }) {
  return (
    <label className="block text-xs font-bold uppercase tracking-wider text-royal-navy">
      {label}
      <input name={name} type={type} required className="mt-1 w-full rounded-xl border border-ice-blue px-3 py-3 text-sm font-medium normal-case tracking-normal" />
    </label>
  );
}
