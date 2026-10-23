"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Magnetic } from "@/components/motion/Magnetic";
import { PanelShell } from "@/components/motion/PanelShell";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { TiltCard } from "@/components/motion/TiltCard";
import { cn } from "@/lib/utils";

const light = "rounded-3xl border border-white/80 bg-white/70 p-6 shadow-glass backdrop-blur-xl sm:p-10 md:p-14";
const dark = "rounded-3xl border border-white/10 bg-gradient-to-br from-midnight via-royal-navy to-royal-purple p-6 text-white shadow-glass-dark sm:p-10 md:p-14";

type Event = {
  loc: string;
  place: string;
  date: string;
  kicker: string;
  title: string;
  body: string;
  foot: string;
  src: string;
};

const EVENTS: Event[] = [
  { loc: "pune", place: "Pune", date: "Outreach", kicker: "Community initiative", title: "Free Beauty Course – Swadhar NGO, Pune", body: "Foundational aesthetics, skin hygiene, and salon practice for community development.", foot: "Accredited workshop", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBLLoJyN3T5ukWFouHvKh58uvCCF5yfXFJli0VZTsOVfojiExoIq9j-NSxDKVEmg4Pxl0iqsprfiWMmdxU5YLelr3Po-sY3OyLbcuE92y0ANl8eUDDhUZsb14MNEXdBWvCMWmZaOdW7jQzme1niN5tf9sJMncPeCAwXS0DdVcaOGGzWbcTk99bSatI4CrCTdYceI5kZj5ebJZIhb2_Btd9VPipd9bG8sW9rGMEceRPy2VL2QHf3ElX6Ag" },
  { loc: "nashik", place: "Nashik", date: "10 Dec 2018", kicker: "National conclave", title: "ABTC Grand Seminar, Nashik", body: "Regional practitioners reviewed CIDESCO clinical hygiene modules and peel certifications.", foot: "State conclave", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAhOe4-J_sfVjXittRfJtPn-EGYXlblUGEkLMc_dvk4TcuTSpNTPMI06Wpp6Omrx4rQI-d5y6eMoio1hBfat4QjXiGE3y7ignB-_cyDmDUoBRO70GOGqSoVvYISUZZZKuV1c-_aLuSTBUGdGCLAnvUnxK1ynUps02zcohwoUdJz-QgebsR0nfQsf4welcbHBL-siWzv5LLHTZ4JMBg-qwE9KIvvvG3gssGqGU64Ap7Wj9B1STAp23wstA" },
  { loc: "kakinada", place: "Kakinada", date: "17 Mar 2019", kicker: "State chapter", title: "Opening of the Andhra Pradesh chapter, Kakinada", body: "Charter installation for the Andhra Pradesh branch of international certifications.", foot: "Inaugural session", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuB-7mijAUzeKfDm_ziDrytdBuxUnfooA_txN5KfLDOtmh5fa3pogMXkkfzoWZLArFMMB7CA0Q2AGv0HcYhMCtxBTJyoMT450-PijNMyXwBX1A-CBkvKwtT0P07ZaRLZixjteh1F1avFfaHPuyKur0J8WKioja5dnTWUmtuUubJTlZFmEIY9S_j1FzLFNDopllMk_EqawYjOGEY978u5JcpW5IkGUOSQSFCVDEHlmY803M3XoKWAoOOdFw" },
  { loc: "pune", place: "Pune", date: "22 Oct 2018", kicker: "Continuing education", title: "Refresher course, Pune", body: "Lymphatic drainage, electronic facials, and clinic sterilisation protocols.", foot: "Certified faculty", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCIiMy1T_spA4B2mj-xHExgjJAZ2FG_gCBoCc6bcEF_3YgNYv6QEHqMNBnpq3_g3Pw-_-gV-R5HaPbela-dhiP_ASPGde65r0kd1DQAJs-q5YEVmh5g8UpZpoYuze3xEriAbL02QvPq6MlDYlSkKeExK5WvuqXmJnHsiZeHCeeC5VyN1t0ZXfo6IWr_XgGNJIUtNDvuRQOtGj8h-8VKv5BYX66ti1R0mS0344BN3hrTj2eT-EihuwZq7Q" },
  { loc: "mumbai", place: "Mumbai", date: "1 Sep 2018", kicker: "Practical assessment", title: "Examiners’ practical exam, Mumbai", body: "Clinical assessment by national examiners under CIDESCO Zurich criteria.", foot: "Practical jury", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCowLQcqOb6HEXjRANW9U7GkILYi8xSMkuZNpkRxBkW2kb5rQSD4zhfq7VJfkUGOGvv7X10czqkZhQIa3FRcW8KSLCxBqytYvX9wB-xXUat5KCUU4uqUPLuLM1PEOODlqpl-DaCPaf1C46Boy6E7rmFUo3IRlNAfDOi-fU-SLJ07ds4o6uFVJqQTnzlHVxYOIhjQ3tZ4iwmpBnL1AX86CfxlTjZwJ6Yfo_pwdyKDMfNzqDRovooWJYGCw" },
  { loc: "pune", place: "Pune", date: "31 Aug 2018", kicker: "Diploma panel", title: "Examiners’ practical exam, Pune", body: "Electrotherapy, body massage, and clinical client consultation.", foot: "Diploma jury", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBT870qo-TpH3SRIZunzdpt-OrGpDUaNexqFadReJvQXh730UWvmb0WripSa2nX79cd7WuqOQdH-wUdK5gzBzQOtH3IaFxrOFo1_Icug9bWSBroSsQ81GId5vgYmI7NuNht_0WIdeY3ROuba_R6hi7eWio99ECl-ByZT7hYw0iyyoAf2kZH1yZe6UA0HJHFEVb9ytA3gptXM4HRkRCdqoH307BCKQKiuj4NWc8HUXLAfxFCKQWztL15wg" },
  { loc: "mumbai", place: "Mumbai", date: "20 Aug 2018", kicker: "Written exam", title: "Written examination, Mumbai", body: "Anatomy, cosmetic chemistry, physiology, and health codes under proctoring.", foot: "Written exam", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDcajzLVN9w824s0i4S3rdk4GI_rBZk_Q7FOx9pfbgKHOCNwICzzj0ErxsVH-3dJjIFCSJ4vacAH9C2oKGx8YUtzASYNjf5foLlckVBV3_QrUxJH4NR9x1-vJ_3o8TY_F30AUvaikWl0MZBuJEx38suMTOKvXcW7n5SKF1ROLd0Qw5Yrp85aMnb1o1qenkbCzGfTDKpfQkTWzRFkojba_85PJd9N3pJKd6VMFnrJiaqU1iQfoOFp3Y_bQ" },
  { loc: "mumbai", place: "Mumbai", date: "1 Jan 2018", kicker: "Centre assessment", title: "ABTC exam at Mena Kantawala Institute, Mumbai", body: "New Year cohort on cosmetic therapeutics and salon management.", foot: "Centre exam", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBtGJYtF_ua7pb1Iui8_5Uz989Sy0WqyHGqLIaM8jtqni3lSV-pbrHbtwK_fnveVlw4iI7mF4eh5G-jiXh_Rm-gEBnBShJBV4_vAnAh33PpLHuQLi7uzgTN0_Gx5ue4XQPQH_Ij_37Uciyjg3gLafqIqh07_tV_ysi274blixiHAbofbIDH9oz9obosF_iTGv6Iv-jltZN_HknWQ7wKP_kxPT_UNPhq1Um_18QW3NhIiMHh67bzAb8z0A" },
  { loc: "nashik", place: "Nashik", date: "30 Jan 2017", kicker: "Regional exam", title: "ABTC exam, Nashik", body: "Diploma examinations for northern Maharashtra under CIDESCO guidelines.", foot: "Regional convocation", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBJm08HLHXpQNh7WaLM4rNuxGFJF0hG8jy8MebQs-FqLUD_fpggvxtwvRIbjv34GTLiRDrjzvfRQgQnPNk86F0eoA_YarUQFHqdrMt9iV4dlilTfoJwI91XvMjvdP_G6enYCqHXdjoeqku6LrUsYXbncdMJlCiYiOK353HwLjxLc58yPFdsP3CnCuugwWtFbHBs6qSLHWAuMt0ed0MCUxV_ydn7udYf4nKwSNM26s5cTF3zexboUcPE9Q" },
  { loc: "pune", place: "Pune", date: "16 Dec 2016", kicker: "Winter session", title: "ABTC exam, Pune", body: "Winter practicals on diagnostics, face-lifting equipment, and facial treatments.", foot: "Winter series", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDlSfXmKuHkKH5tVVHRV8Xe-TsVV2FeT274QWAYreI8_H4j2udPXHTSfbnzGA8Z2eHU2WpVuZGYz1hth7X8VFvtwl4Zu87nVbMmG0y0VdapW1mMeZirS9vUTTeROlXP_5j42r6o5ZOBSI5xozVX8CmL_qIkNjE4aoOl0SUAAIvXqGz_42mDnGUOYy-oSpKYFg32ZkqoAuIuy59cz9alSygP_8FrD2aRH8dtoNax7aX5WmUC8MurJ5qgJA" },
  { loc: "pune", place: "Pune", date: "22 Apr 2016", kicker: "Spring cohort", title: "ABTC exam, Pune", body: "Spring graduation and theory series for newly certified therapists.", foot: "Certified batch", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAqIWaVd5ILc_cmjtKyd1YHoUeAMDdKbmlpiPFLbXuX3uUmZmuE9sggdazD-LrQqiV1PQOpeqnvge_1DUToXIyd-9n0tlrrZqOhImW7JHFL_SCa3pyeu549_z0y0i0UyIXWS40olxCrCGKmmyvVJVoGxvzFZFFh8vTvFiF1RHVSOzjuyfCPvViczYvwEuyHffSfX4ZsFFwgNEXaPF-vjf7GPumFmP8b-uzh_CQrT6-Q2JzATkdfO7mNNA" },
  { loc: "solapur", place: "Solapur", date: "1 Oct 2015", kicker: "Regional centre", title: "ABTC exam, Solapur", body: "Standardised testing extended to Solapur centres.", foot: "Solapur centre", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDqyHyd1QE4ifyVUSArQWvSVUVkT3aLO5Ij2DQiig6yvxwQx1SS_H0zcutdT9e7gCpriHQkRwVETBHcDDYdPw4_AyVyesNHsqdLeR5YmZBvGB6dL4_udhzA582DhybMJZbcs05EUEM1OdU3q3NHQh243A4whF0fIqlWnfsTkoVXdo0MC0N7YzJ0ctG0IcwQb89RP0yOtO0QJHx2d5x-JdTe1_6tqSC-RR9chkp8CGsOcbtnGSesFsEWDQ" },
  { loc: "pune", place: "Pune", date: "11 Aug 2015", kicker: "Seminar", title: "ABTC seminar, Pune", body: "Presentations on dermal histology, anti-ageing, and curriculum across academies.", foot: "Symposium", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCzrWSxFyZN0KCTeH5_9OR6s0xF3ScvcM1hKJ2fKzpHswjIi6mfDNMoEZdPM6Bp5S3_7876W-jYMbZP0LKRHF5nGlQp3ANqCYv9fJN9fruvvYwOaThi1NiW128ml6cb1qBrMVrMxl8SAI1ihmqipJ038dsO1GGbsWQe3v7nKl9C3XFbd83wxQr5ZKJOsTpi3bqoyMTr22v2xk3A1nnlaG9TCxUwoaosU9femPZMbhX0h62Y6rIDjnzm1A" },
  { loc: "pune", place: "Pune", date: "5 Aug 2015", kicker: "Mid-year exam", title: "ABTC exam, Pune", body: "Diploma assessment with peer evaluation by national examiners.", foot: "Mid-year cohort", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCcHSH79wd2SbtRb3RUUf0qqZkV4Ei86oxsNrOohJkgISrZytrpZNBmOJcKkGRWVZP4bsP3Ui16t39LfVQiy3rvDc5BtWWlaiU7Np_5pYac4kUPEKxVMhpoq_JG9SNevbA2pXtQ8sMJV2mxFleYM7kK_FHtUrE7YdtjGnNcqd_nkL0B4ZTp7z0AkI0sCeFknzcep3OjwiU2QLDNc_17dIWGYNV4CvEM6TqY4i_29VX16lsgWiM5R-1ZpA" },
  { loc: "pune", place: "Pune", date: "17 May 2015", kicker: "Clinical evaluation", title: "ABTC exam, Pune", body: "Skin analysis, diagnostic records, microdermabrasion, and aftercare.", foot: "May session", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCR-Nn3QQ8M8TLulp4zc06c5PaM1MdzTxP0cIytKPeTMNSxDg_Hw69ulN0JjK-kHCbT361pZF7y3mLZ78JsdqW-JwHyxfSK8Y7jjsZDexLHBAY6T3GMvPuVSTirzLU8qkLtAAz1z2ckBuxvmwgEDh_hR70QXDH9daybZPT0e37DZFu9LVq_HxQB2oLWMGL3bxAjDt95VvlGGYHC5-HByM9lmlBZYApsxVQUdFFkXt6PHiSCj639MW9JoQ" },
  { loc: "pune", place: "National", date: "20 Jan 2014", kicker: "Masterclass", title: "ABTC seminar", body: "Skin-peel safety, facial electrical contraindications, and sanitisation.", foot: "Technical series", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDJ7Kgc_iB87pBxrooxzrdjjnlIfxquCGtNCHvkr6RGEgU2FNdCPTLCvz4Rp9Stenb1Y7_zytgvspd13GZOSVufNS7BmgNo8wIxOKVVzq01enTyfaOuVSZqzNr9MS2AHqm7JtW2q3HOxgCEZl1ySswe_r_hHBHzRgFyqloCejE1uVVvX_joL2URgUlaxX0dspaTz7r60cqZPTO-syEwjOm3Yp5--H3sDcJWuAXIvPrpHofEntC4irPN5w" },
  { loc: "archive", place: "Pune", date: "Nov 2013", kicker: "Archive", title: "Association of Beauty Therapy exams, November 2013", body: "A national batch completed CIDESCO competency milestones.", foot: "National batch", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuA0lX5QPtUwjRtrMjFAe_DgCErO2aB_qRfr4D5NRHMFZbY4Ig96us6C1HcT2cqfBkFpDa22L8g6qWU0IoSaPySEU9WklNd5ve6O9feo-V9276WSZSDZjWYbp7fnPZlbT7KHNBhvsyW1eMGcHt7usidPyvxiUYqxjzU8SRqDmrVKpUf_UnmiEHFJC9KKuW43Zvp2yL_nW57Ludedn13ne-v2EMZFVG1i9vNT6qzDBl_x5FetUfSCljM43A" },
  { loc: "archive", place: "CIDESCO 2013", date: "Sept 2013", kicker: "Milestone conclave", title: "CIDESCO Section India exam, Pune, September 2013", body: "National sitting with international delegates confirming standard alignment.", foot: "CIDESCO Section India", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAwho3aHiiZOZ6-JK3NFRs2SxdzMXLIzCqWN3XLmcm54nJYT3Ayq9JIYkkRRFBbPh6ii_FCXuwBkX_mQVhlNI0xQ6R4st0pOT6SHlCyi9XvDnYsol55lryULTQmIDJGJ235qTv4nBJp4bFMMmxomaetomErmQx_BJF9wkrJEw7tDjDntNPdgX6q-dw_uDQGTLBSEhGr1unL2XiaQfMYOyOh71uCV4-2TA9f9-w4Fql_zkOzv4SkKHkaUA" },
  { loc: "archive", place: "Heritage", date: "1990–2000", kicker: "Foundational decades", title: "The ABTC activities: 1990 – 2000", body: "The founding board’s work to introduce formal scientific aesthetic qualifications in India.", foot: "Foundational era", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuD7uy8KK5oWQfJMdRzq2Kn19HIiFw3zMpHkJCCD4-d2jl3xUs5VrK0zRzSRNsaqJNRXG0155krLSC5fZAwwmES60CjSFfAs5NV2PEFv7Yh089pm7H-ZE4t1iZO_S6UMvW6YL3GpqEo4WUhz5kK63c5MTmvoiS7LeAJPNoZSiyVeWysKGgg8teh1L29KiJA0B6Cwlo3VDpUXOcrsImkn7KB5ehK2KxSA71bwdt1acDJvDCexh5e3HBnykA" },
];

const FILTERS = [
  ["all", "All events"],
  ["pune", "Pune"],
  ["mumbai", "Mumbai"],
  ["nashik", "Nashik"],
  ["kakinada", "Kakinada"],
  ["solapur", "Solapur"],
  ["archive", "1990–2013"],
] as const;

export function GalleryPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number][0]>("all");
  const list = useMemo(() => EVENTS.filter((e) => filter === "all" || e.loc === filter), [filter]);

  return (
    <div className="space-y-16 md:space-y-24">
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <PanelShell className={`${light} text-center`}>
          <Badge>Institutional archives & conclaves</Badge>
          <SplitHeading as="h1" type="words" className="mt-4 font-display text-4xl font-bold text-royal-navy sm:text-5xl">
            ABTC Events & Academic Convocations
          </SplitHeading>
          <p className="mx-auto mt-3 max-w-2xl text-text-subtle">
            National milestones, board meetings, CIDESCO examinations, and seminars at accredited institutes.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[["1990+", "Legacy"], ["100%", "CIDESCO verified"], ["19+", "Regional hubs"], ["FI1552", "National registry"]].map(([n, l]) => (
              <div key={l} className="rounded-xl border border-ice-blue bg-white p-3">
                <p className="font-display text-2xl font-bold text-royal-navy">{n}</p>
                <p className="text-[11px] font-bold uppercase tracking-wider text-text-subtle">{l}</p>
              </div>
            ))}
          </div>
        </PanelShell>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setFilter(id)}
                className={cn("rounded-lg px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider", filter === id ? "bg-royal-navy text-white" : "border border-ice-blue bg-white text-text-subtle")}
              >
                {id === "all" ? `${label} (${EVENTS.length})` : label}
              </button>
            ))}
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-text-subtle">Showing {list.length}</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.map((e) => (
            <TiltCard key={e.title + e.date} max={4} spotlight={false} className="flex h-full flex-col overflow-hidden rounded-2xl border border-white bg-white shadow-glass">
              <div className="relative h-56 overflow-hidden">
                <img alt="" src={e.src} className="h-full w-full object-cover transition duration-700 hover:scale-105" />
                <div className="absolute left-3 top-3 flex gap-1.5">
                  <span className="rounded bg-royal-navy px-2 py-1 text-[10px] font-bold uppercase text-white">{e.place}</span>
                  <span className="rounded bg-white/90 px-2 py-1 text-[10px] font-bold text-electric-blue">{e.date}</span>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-electric-blue">
                  <Icon name="event" className="text-sm" /> {e.kicker}
                </p>
                <h3 className="mt-2 font-display text-lg font-bold leading-snug text-royal-navy">{e.title}</h3>
                <p className="mt-2 text-sm text-text-subtle">{e.body}</p>
                <p className="mt-4 border-t border-ice-blue pt-3 text-xs font-bold text-royal-navy">{e.foot}</p>
              </div>
            </TiltCard>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <PanelShell className={dark}>
          <Badge dark>Reg. No. FI1552</Badge>
          <SplitHeading type="words" className="mt-3 font-display text-3xl font-bold">Need a past certificate checked?</SplitHeading>
          <p className="mt-2 max-w-2xl text-white/75">The secretariat keeps examination records from 1990 through the current year.</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Magnetic strength={0.2}><Button href="/contact" variant="white">Verify credentials</Button></Magnetic>
            <Magnetic strength={0.2}><Button href="mailto:abtcindia@gmail.com" variant="ghost-dark">Contact secretariat</Button></Magnetic>
          </div>
        </PanelShell>
      </section>
    </div>
  );
}
