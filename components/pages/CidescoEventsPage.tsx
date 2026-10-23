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

type Event = { cat: string; badge: string; place: string; date: string; kicker: string; title: string; body: string; foot: string; src: string };

const EVENTS: Event[] = [
  { cat: "world", badge: "66th Congress", place: "Stockholm", date: "6–9 Sep 2018", kicker: "International assembly", title: "66th CIDESCO World Congress, Stockholm", body: "The Indian delegation at the congress on education standards and aesthetic syllabus.", foot: "Stockholm, Sweden", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAxVZHiZa6OzbuntGEz_NeHQ1VRkd3bCW02s5VIUJlBLe3_I66AGRwzGRtx5UxB4ypD-T8tNe07vtUj_bQsrVmrBVa6olxFA19MS6N5w4WE9Xx1MyMhN1-2GsjZKoEJBmHhqlzp04XU7zu0Vgp_JS-HwDtWKR0M6E911AGQ6WK8CKdPHlycPCf8OknDtNKbkgSVoHCPlk3_QoTJxw5IJB9BZ2Urt1_NKrxlqyChkv1WSZ_WpXKQLxhECA" },
  { cat: "world", badge: "65th Congress", place: "Mumbai", date: "18–19 Sep 2017", kicker: "World congress", title: "65th CIDESCO World Congress, Mumbai", body: "ABTC hosted worldwide delegates at Hall 2A, Mumbai.", foot: "Hall 2A, Mumbai", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAgV5U0_1D1IfzRl-U6nND-8m6aePcNTFv-HSnWAwN3cX1Og6YKiaPLgtpAgaBCLX8KbrAC-ASwySzWT8Wa7-VGgTfDHPcE1SaXItblgzfcKV9cFBUPXSy4Hun_qacvif3mF1BJ0aXCB5FeKQptKexd0-ghRO0MKqsN_UZrG0vhOz7erg2so_bo1BZWL-OPrJO1aknt9Rc7Nhj1gj7vGB2aVxIw-P6hvuk7G-G8KIw4BHdtFdOl-BhPog" },
  { cat: "world", badge: "Cultural gala", place: "Bandra", date: "16 Sep 2017", kicker: "Cultural night", title: "Congress 2017 cultural evening, Hotel Rangsharda", body: "Delegates were hosted for cultural fellowship and executive networking in Bandra.", foot: "Rangsharda, Bandra", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuB5KXwFxZ7iHkL00y4HFtKTQvGoN5lbeDESj5hSi9CFRn8ml83VO2WUypPJWBh2JFdqrCiigzL8mAoFNBvARwVvxZXOhFSLKMEPbUsuFJwLKnEadd1L2YEadcpwhBqDFVDUdZ5wkGyPz9tmJS3CyVa7bLMx8Z-t7JCLpue7g44O-uy6jQuwso9ZwDetV3fuNboW86bKvL2y3pnVv-p7M8bhunJvEFMAhuDSM_ZsKyhqT2emN--vrOCBSw" },
  { cat: "examiners", badge: "Schools", place: "Taj Lands End", date: "16 Sep 2017", kicker: "School council", title: "CIDESCO international schools meeting", body: "Syllabus criteria across accredited academies and Zurich guidelines.", foot: "Taj Lands End", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDjP8jpJihRKAmCkegPUS8kwNRoyqzEuf6PdwDeTY4IUcro_UXsi2_TZ5zX9hs_EyMSd2cvwP6AD5ClTPj1xm4gehEwHbfTX3hr_QR8uSP_cHZqAepZ7Y7L7-pR15NGloHCtl_8hW5f-lhdrEXiz-uF7iQVd8vw9lK-wGohRHRoPgT_UCP_XMXQse52lnVgtBos72_F1et5IqxY3EEBbhDlzTeexE5DNf8YmfHDvprElFcoWxstR22Zlw" },
  { cat: "examiners", badge: "Examiners", place: "Bandra", date: "15 Sep 2017", kicker: "Examiner calibration", title: "CIDESCO examiners’ meet, Taj Lands End", body: "Grading protocols, practical metrics, and clinical hygiene audits.", foot: "Examiner council", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDGGIkU8kcSHSqeHWlj0anJCrS_GLiOK1yHqR_A2vckpnyXLENiYv52PkiX56EysMdWuMmtBRc1valU8nwKrWrS09PEZjAMu3XALLqEUQl5a31CevlczOJAwUslQe09RUC52RJdJAwL1j_mCutFjE0iNciKnPbgVNujU5thaCCyH3ZZLtXwkmr40dajfyOfjUuMPnxRLXR1h2IhUvJ0f891Hf4O3Q41QyrqExu9p2eOfBCBFyknLl4wPA" },
  { cat: "world", badge: "China", place: "Wuhan", date: "2013", kicker: "Diplomacy", title: "CIDESCO World Congress, Wuhan", body: "ABTC India represented holistic aesthetics and botanical dermato-cosmetology.", foot: "Wuhan, China", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCFizYdodT58lQh4qMbpmH-YXrnt175E8jwzb0r1H9Ogd4NFy8Bya-SsmwYpKaI1Cdt3WSB2u-tFr-bNLTYzWZj6Yo0qs5Bh1l50Jh-TBdOjKLAAP1n2q7RNnN8gBC84U9LNGrcGHAAhUlQDOg504WRjsjDih85viYuL-sHMuFjLMEhLoGJpP1Okfr1Z00P730RBBtCh4JDWJ97dzTBPNfZF1_BAGprmiT1jtCWuJIVBaO6YU6go5i_Ew" },
  { cat: "examiners", badge: "Diploma", place: "Pune", date: "Sep 2013", kicker: "Convocation", title: "CIDESCO Section India exam, Pune", body: "Practical and theory evaluation under Zurich standards.", foot: "Pune division", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAE_XWHzSa5c5FOSlO4MXSwnCwxLkU5AlJ5XiXAKrDrhs-myiIhX3soKJ9O4hRF3DauAT446u5bMnu6A9l-PlYB1zf6VnwuVg162zNYficbwemW0PKL6K6eiqhDQ8dK9IpeYHErnJ3grtHCKWm8Izy1nJ5ZDxbTxQWZsk59g7i3Uo6QKLS_oimSbUyv9CRzQ611urFDsSpU3Qhp2cZGix7T5QrKVaUVRGncFjedSSbEoL-o5lMHEtEC8A" },
  { cat: "national", badge: "Conference", place: "India", date: "2013", kicker: "Industry partnership", title: "CIDESCO National Division Conference, India 2013", body: "Keynote with industry partners aligning research and clinical practice.", foot: "Symposium", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDgGmFM7-WXxwzRNZauLlO-Ka0IAy-bpf8Ir0FrHqwy0opcQ7DsgZLLCIXzYoVqAUF5AcXXZFfjBvDJgY-GxtghsjaHrq2JDvdrBJfqxDtiG6g3AJ0Oclkzd-RILOiWgtMXS1dJFF4Sf-jPPHLQOP3RJPeOvb6hnlEQ0sNWAy2yeV9b0DXwRruBWPV_XZofF8MKkJ4b89ruyDmumH5V7GwzlVGUGHJV9lEvHaQ-WmL3qOkuPdP0SCDUZQ" },
  { cat: "national", badge: "Charter", place: "Mumbai", date: "2011", kicker: "Foundation", title: "Formation of the national CIDESCO division, Mumbai", body: "The Indian Section was formally established under charter FI1552.", foot: "Charter 2011", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAYrQGWO9AcuPaZRzMZ7L_Oy60Wn-MYSZcp_5G9OQhgAIhSh4UAaocs2iYZyaxU4vbbrTYM3PMDQJtObwtJwKSGWSXhrw_l2rENJpzXQU29XKef-O6ZE8c3SfC7fX2j8TUnQXaXp88eKA1dPm-wEFy6ZKVOMC90Uf4ZzZlbdYuleIAWFwFjUxevmloTt2Y0hvS5XsvJBiYyxzHAxrGh03kXvt3IAcavcpohWSZ01kY64tzwxy36Wco7SQ" },
  { cat: "examiners", badge: "Exams", place: "National", date: "Session", kicker: "Clinical audits", title: "The CIDESCO exams delegation", body: "Practical assessments with visiting international invigilators.", foot: "FI1552 exam", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDWSAnaCG8kK3ONI-Lb0NxvklT-tMa9jzAwwlLCpTD-cXgNzS2NVWci8raH89OmwvaYjeGtk4R1kqeok03S7ae6RR1khxhzgKMkn4IEHjhYuOkjCImBudzOcHREm6RGfDsIp1NMVAtW8Vbos3F-IcjYEXeu3PQmy19AEoVsemFq_2Yh4cYKRr_Im0wNwXDuAXQ6XA1kSAGTxCfilwgEHQjyKN_pmt8GvzkPo9QMkmQMszqsyRByM5kBjg" },
  { cat: "history", badge: "Tribute", place: "Archive", date: "Section", kicker: "Heritage", title: "India as a CIDESCO section", body: "Decades of work to place Indian vocational credentials on a global footing.", foot: "ABTC India", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCSnJFwY7yYccQLsoustA0hyGjRMQQn_35-GlqAFwi0JnPyT65KartiGaNctf1V9xbT1sJkDwy-iOXBuf__DyLRlu1IYo9IvxxapEXmuOFx60Fj5Ixh4M-IXOQ4YshDvLR9kbjbfAYCPfnF0ThPTbxtZeZXeRD4URQzkZo8FmJtdS0guJHNtSih-znCvaGMgGdRBswcAKDNXvqzdMTh4WU66gDmAsS5lHzK2n-sOSPyIoaTE6q8WrRWvg" },
  { cat: "history", badge: "1985–1995", place: "Chronicle", date: "A decade", kicker: "Annals", title: "The history of CIDESCO: 1985 – 1995", body: "The decade when international standards were set into the modern diploma framework.", foot: "Charter heritage", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCF4edlbDv3FmAaCXIQnQsZokxmPECxd5cyWsUgleWPDPLT9DDwY51ur78KXDTx6FIqasGkl1Ttw6IEr0WNmY6bazdqB7tigBiT4Vo7c6KX-JFTkZnBQkWcfufAG61NfHoCL7K5U48QotJCdjMwwf9XcHT4_74XM9v_pzFy0NbBuYj-VsQUjfacSFJu4eN6o3GBbKM6h52_OLdB2e4UbAjwz7dVYvVsAs01XWCHuCfR9ubrN-E6OwZY4w" },
];

const FILTERS = [
  ["all", "All events"],
  ["world", "World congresses"],
  ["national", "National division"],
  ["examiners", "Examiners & schools"],
  ["history", "Historical archive"],
] as const;

export function CidescoEventsPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number][0]>("all");
  const list = useMemo(() => EVENTS.filter((e) => filter === "all" || e.cat === filter), [filter]);

  return (
    <div className="space-y-16 md:space-y-24">
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <PanelShell className={`${light} text-center`}>
          <Badge>World congress & diplomacy</Badge>
          <SplitHeading as="h1" type="words" className="mt-4 font-display text-4xl font-bold text-royal-navy sm:text-5xl">
            CIDESCO Events
          </SplitHeading>
          <p className="mx-auto mt-3 max-w-3xl text-text-subtle">
            International congresses, delegations, examination summits, and milestones of the Indian Section of CIDESCO.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[["66+", "World congresses"], ["1985", "Foundation era"], ["FI1552", "Section number"], ["Global", "Diplomatic status"]].map(([n, l]) => (
              <div key={l} className="rounded-xl border border-ice-blue bg-white p-3">
                <p className="font-display text-2xl font-bold text-royal-navy">{n}</p>
                <p className="text-[11px] font-bold uppercase tracking-wider text-text-subtle">{l}</p>
              </div>
            ))}
          </div>
        </PanelShell>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-6 flex flex-wrap gap-2">
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.map((e) => (
            <TiltCard key={e.title} max={4} spotlight={false} className="flex h-full flex-col overflow-hidden rounded-2xl border border-white bg-white shadow-glass">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img alt="" src={e.src} className="h-full w-full object-cover transition duration-700 hover:scale-105" />
                <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                  <span className="rounded bg-white px-2 py-1 text-[10px] font-bold uppercase text-royal-navy">{e.badge}</span>
                  <span className="rounded bg-electric-blue px-2 py-1 text-[10px] font-bold uppercase text-white">{e.place}</span>
                </div>
                <span className="absolute bottom-3 left-3 text-[11px] font-semibold text-white">{e.date}</span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="text-[11px] font-bold uppercase tracking-widest text-electric-blue">{e.kicker}</p>
                <h3 className="mt-1 font-display text-lg font-bold leading-snug text-royal-navy">{e.title}</h3>
                <p className="mt-2 text-sm text-text-subtle">{e.body}</p>
                <p className="mt-4 flex items-center gap-1 border-t border-ice-blue pt-3 text-xs font-bold text-royal-navy">
                  <Icon name="pin_drop" className="text-sm text-electric-blue" /> {e.foot}
                </p>
              </div>
            </TiltCard>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <PanelShell className={light}>
          <p className="text-[11px] font-bold uppercase tracking-widest text-electric-blue">Chronicle</p>
          <SplitHeading type="words" className="mt-2 font-display text-3xl font-bold text-royal-navy">Four decades of global standard stewardship</SplitHeading>
          <p className="mt-3 max-w-3xl text-sm text-text-subtle">
            ABTC is the link between Indian academies and CIDESCO International in Zurich, through congresses, delegations, and examiner training.
          </p>
        </PanelShell>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <PanelShell className={dark}>
          <SplitHeading type="words" className="font-display text-2xl font-bold sm:text-3xl">Verify event credentials or school accreditation</SplitHeading>
          <p className="mt-2 text-sm text-white/75">Registry for examination centres, past diplomas, and school affiliations in India.</p>
          <div className="mt-6">
            <Magnetic strength={0.2}><Button href="/accreditations" variant="white">Schools & charter</Button></Magnetic>
          </div>
        </PanelShell>
      </section>
    </div>
  );
}
