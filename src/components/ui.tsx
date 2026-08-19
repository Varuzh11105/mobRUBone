import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { num } from "../lib/format";
import { catById, type Fund } from "../lib/data";
import { CATEGORY_ICONS, IconCheck, IconSpark } from "./icons";

/* ================= Toasts ================= */

interface Toast {
  id: number;
  text: string;
  kind: "ok" | "info";
}
interface ToastCtx {
  toast: (text: string, kind?: Toast["kind"]) => void;
}
const TCtx = createContext<ToastCtx>({ toast: () => {} });
export const useToast = () => useContext(TCtx);

let toastId = 0;

export function ToastProvider({
  children,
  containerClass = "fixed inset-x-4 bottom-5",
}: {
  children: ReactNode;
  containerClass?: string;
}) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = (text: string, kind: Toast["kind"] = "ok") => {
    const id = ++toastId;
    setToasts((t) => [...t.slice(-2), { id, text, kind }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3400);
  };

  return (
    <TCtx.Provider value={{ toast }}>
      {children}
      <div className={`pointer-events-none z-[70] flex flex-col items-center gap-2 ${containerClass}`}>
        {toasts.map((t) => (
          <div
            key={t.id}
            className="animate-ticker pointer-events-auto flex w-full items-center gap-2.5 rounded-xl border border-pine-800 bg-pine-900/95 px-3.5 py-3 text-[13px] font-medium text-mist shadow-float"
          >
            <span
              className={`grid h-6 w-6 shrink-0 place-items-center rounded-full ${
                t.kind === "ok" ? "bg-mint-500/25 text-mint-100" : "bg-amber-500/25 text-amber-300"
              }`}
            >
              {t.kind === "ok" ? <IconCheck className="h-3.5 w-3.5" /> : <IconSpark className="h-3.5 w-3.5" />}
            </span>
            <span className="leading-snug">{t.text}</span>
          </div>
        ))}
      </div>
    </TCtx.Provider>
  );
}

/* ================= CountUp ================= */

export function CountUp({
  to,
  duration = 850,
  fromZero = false,
  format = (n: number) => num(n),
  className,
}: {
  to: number;
  duration?: number;
  fromZero?: boolean;
  format?: (n: number) => string;
  className?: string;
}) {
  const [val, setVal] = useState(fromZero ? 0 : to);
  const prev = useRef(fromZero ? 0 : to);

  useEffect(() => {
    const from = prev.current;
    if (from === to) return;
    const start = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const k = Math.min(1, (t - start) / duration);
      const e = 1 - Math.pow(1 - k, 3);
      setVal(Math.round(from + (to - from) * e));
      if (k < 1) raf = requestAnimationFrame(step);
      else prev.current = to;
    };
    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      prev.current = to;
    };
  }, [to, duration]);

  return <span className={className}>{format(val)}</span>;
}

/* ================= ProgressBar ================= */

export function ProgressBar({
  value,
  tone = "coral",
  className = "",
  track = "bg-pine-900/10",
  thin = false,
}: {
  value: number;
  tone?: "coral" | "mint" | "amber";
  className?: string;
  track?: string;
  thin?: boolean;
}) {
  const tones = {
    coral: "bg-gradient-to-r from-coral-500 to-amber-500",
    mint: "bg-gradient-to-r from-pine-600 to-mint-500",
    amber: "bg-gradient-to-r from-amber-500 to-coral-400",
  } as const;
  const v = Math.max(2, Math.min(100, value));
  return (
    <div className={`${track} ${thin ? "h-1.5" : "h-2.5"} w-full overflow-hidden rounded-full ${className}`}>
      <div
        className={`relative h-full rounded-full ${tones[tone]} transition-[width] duration-700 ease-out`}
        style={{ width: `${v}%` }}
      >
        <div className="bar-live absolute inset-0 rounded-full opacity-60" />
      </div>
    </div>
  );
}

/* ================= useInView ================= */

export function useInView<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, inView };
}

/* ================= Reveal on scroll ================= */

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${inView ? "is-in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ================= Avatar ================= */

export function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  const initials = name
    .replace(/[«»"]/g, "")
    .split(/[\s,]+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) % 360;
  return (
    <span
      className="font-display grid shrink-0 place-items-center rounded-full text-paper"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.32,
        background: `linear-gradient(135deg, hsl(${h} 42% 34%), hsl(${(h + 40) % 360} 48% 26%))`,
      }}
    >
      {initials || "?"}
    </span>
  );
}

/* ================= Обложки ================= */

function CoverArt({ fund, className = "" }: { fund: Fund; className?: string }) {
  const cat = catById(fund.category);
  const Icon = CATEGORY_ICONS[fund.category];
  let rot = 0;
  for (const ch of fund.id) rot = (rot + ch.charCodeAt(0)) % 360;
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ background: `linear-gradient(140deg, ${cat.hue} 0%, ${cat.hue2} 130%)` }}
    >
      <div
        className="absolute -left-1/4 -top-1/3 h-[90%] w-[70%] rounded-full bg-white/14"
        style={{ transform: `rotate(${rot}deg)` }}
      />
      <div className="absolute -bottom-1/4 -right-1/5 h-[80%] w-[65%] rounded-full bg-pine-950/18" />
      <div className="absolute inset-0 opacity-[0.16]" style={{
        backgroundImage:
          "repeating-linear-gradient(45deg, transparent 0 14px, rgba(255,255,255,0.5) 14px 16px)",
      }} />
      <Icon className="absolute left-1/2 top-1/2 h-[42%] w-[42%] -translate-x-1/2 -translate-y-1/2 text-paper drop-shadow-lg" strokeWidth={1.4} />
    </div>
  );
}

export function CoverImage({ fund, className = "" }: { fund: Fund; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (!fund.cover || failed) return <CoverArt fund={fund} className={className} />;
  return (
    <img
      src={fund.cover}
      alt={fund.title}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  );
}

/* ================= Chip ================= */

export function Chip({
  children,
  active = false,
  onClick,
  className = "",
}: {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`press shrink-0 rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold transition-colors ${
        active
          ? "bg-pine-900 text-mist shadow-card"
          : "border border-line bg-paper text-ink-soft hover:border-pine-600/40 hover:text-pine-700"
      } ${className}`}
    >
      {children}
    </button>
  );
}

/* ================= Toggle ================= */

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: ReactNode;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-3 text-left"
    >
      <span className="text-[13.5px] font-medium text-ink-soft">{label}</span>
      <span
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? "bg-pine-700" : "bg-pine-900/15"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-paper shadow transition-all ${
            checked ? "left-[22px]" : "left-0.5"
          }`}
        />
      </span>
    </button>
  );
}

/* ================= Money input ================= */

export function formatMoneyInput(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  return digits ? num(Number(digits)) : "";
}

/* ================= copy ================= */

export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      return true;
    } catch {
      return false;
    }
  }
}
