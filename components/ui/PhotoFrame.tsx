import { cn } from "@/lib/utils";

type Props = {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  position?: string;
};

/** Cropped editorial photo. Fixed ratio so wide event shots do not dump the whole room into the layout. */
export function PhotoFrame({ src, alt, caption, className, position = "object-center" }: Props) {
  return (
    <figure
      className={cn(
        "relative isolate overflow-hidden rounded-3xl border border-white/70 bg-midnight shadow-glass",
        className,
      )}
    >
      <img src={src} alt={alt} className={cn("absolute inset-0 h-full w-full object-cover", position)} />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-midnight/70 via-midnight/5 to-white/10"
      />
      {caption ? (
        <figcaption className="absolute inset-x-0 bottom-0 flex items-center gap-2 p-4 sm:p-5">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-electric-blue" />
          <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-white">{caption}</span>
        </figcaption>
      ) : null}
    </figure>
  );
}
