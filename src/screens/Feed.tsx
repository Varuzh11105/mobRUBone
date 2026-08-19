import { useMemo, useState } from "react";
import { useStore } from "../lib/store";
import { CATEGORIES, catById, type Fund, type CategoryId } from "../lib/data";
import { money, num, pct, dayWord, plural } from "../lib/format";
import { Avatar, Chip, CountUp, CoverImage, ProgressBar, Reveal } from "../components/ui";
import {
  CATEGORY_ICONS,
  IconArrowR,
  IconCheck,
  IconClock,
  IconLive,
  IconPlus,
  IconSearch,
  IconUsers,
  IconVerified,
} from "../components/icons";

/* ---------- горизонтальная карточка ---------- */
export function FundRow({ fund, onOpen }: { fund: Fund; onOpen: () => void }) {
  const p = pct(fund.raised, fund.goal);
  return (
    <button
      onClick={onOpen}
      className="press group flex w-full gap-3.5 rounded-[22px] border border-line/80 bg-paper p-3 text-left shadow-card transition-shadow hover:shadow-float"
    >
      <div className="relative h-[104px] w-[100px] shrink-0 overflow-hidden rounded-2xl">
        <CoverImage fund={fund} className="h-full w-full transition-transform duration-500 group-hover:scale-[1.06]" />
        <span className="absolute bottom-1.5 right-1.5 rounded-md bg-pine-950/75 px-1.5 py-0.5 font-display text-[10px] font-bold text-amber-300">
          {p}%
        </span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-1.5">
          <span className="text-[10.5px] font-bold uppercase tracking-[0.08em] text-pine-600">
            {catById(fund.category).label}
          </span>
          {fund.verified && <IconVerified className="h-3.5 w-3.5 text-pine-600" />}
          {fund.closed && (
            <span className="ml-auto flex items-center gap-1 rounded-full bg-mint-100 px-2 py-0.5 text-[10px] font-bold text-mint-500">
              <IconCheck className="h-3 w-3" /> завершён
            </span>
          )}
        </div>
        <h3 className="mt-0.5 line-clamp-2 text-[14px] font-bold leading-snug text-ink">
          {fund.title}
        </h3>
        <div className="mt-auto pt-2">
          <ProgressBar value={p} thin tone={fund.closed ? "mint" : "coral"} />
          <div className="mt-1.5 flex items-baseline justify-between gap-2">
            <span className="font-display text-[12.5px] font-bold text-coral-600">
              <CountUp to={fund.raised} format={money} />
            </span>
            <span className="truncate text-[11.5px] text-ink-soft">из {money(fund.goal)}</span>
          </div>
          <div className="mt-1 flex items-center gap-3 text-[11px] font-medium text-ink-soft/80">
            <span className="flex items-center gap-1">
              <IconUsers className="h-3.5 w-3.5" />
              {num(fund.donors)} {plural(fund.donors, "донор", "донора", "доноров")}
            </span>
            <span className="flex items-center gap-1">
              <IconClock className="h-3.5 w-3.5" />
              {fund.closed ? "финал" : `${fund.daysLeft} ${dayWord(fund.daysLeft)}`}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

/* ---------- большая featured-карточка ---------- */
function FeaturedCard({ fund, onOpen }: { fund: Fund; onOpen: () => void }) {
  const p = pct(fund.raised, fund.goal);
  const urgent = fund.daysLeft <= 7 && !fund.closed;
  return (
    <button
      onClick={onOpen}
      className="press group w-full overflow-hidden rounded-[26px] border border-line/70 bg-paper text-left shadow-card transition-shadow hover:shadow-float"
    >
      <div className="relative h-48 overflow-hidden">
        <CoverImage fund={fund} className="h-full w-full transition-transform duration-700 group-hover:scale-[1.05]" />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3.5">
          <span className="rounded-full bg-pine-950/70 px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.08em] text-mist">
            {catById(fund.category).label}
          </span>
          {urgent && (
            <span className="animate-pop flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1 font-display text-[10.5px] font-bold text-pine-950 shadow-card">
              <IconClock className="h-3.5 w-3.5" />
              осталось {fund.daysLeft} {dayWord(fund.daysLeft)}
            </span>
          )}
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-pine-950/85 via-pine-950/40 to-transparent p-4 pt-12">
          <h2 className="font-display text-[17px] font-bold leading-snug text-paper">
            {fund.title}
          </h2>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-baseline justify-between gap-3">
          <span className="font-display text-[20px] font-extrabold tracking-tight text-pine-700">
            <CountUp to={fund.raised} format={money} />
          </span>
          <span className="text-[12px] font-medium text-ink-soft">
            цель {money(fund.goal)} · {p}%
          </span>
        </div>
        <ProgressBar value={p} className="mt-2" />
        <div className="mt-3.5 flex items-center justify-between gap-3">
          <span className="flex min-w-0 items-center gap-2">
            <Avatar name={fund.author} size={30} />
            <span className="truncate text-[12px] font-semibold text-ink-soft">{fund.author}</span>
            {fund.verified && <IconVerified className="h-4 w-4 shrink-0 text-pine-600" />}
          </span>
          <span className="press flex items-center gap-1.5 rounded-full bg-coral-500 px-4 py-2 text-[12.5px] font-bold text-paper shadow-[0_8px_20px_-8px_rgba(33,160,56,0.7)]">
            Помочь
            <IconArrowR className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </button>
  );
}

/* ---------- экран ленты ---------- */
export function FeedScreen({
  onOpenFund,
  onCreate,
}: {
  onOpenFund: (id: string) => void;
  onCreate: () => void;
}) {
  const { funds, mode, ticker } = useStore();
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<CategoryId | "all">("all");
  const ev = ticker[0];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return funds.filter(
      (f) =>
        (cat === "all" || f.category === cat) &&
        (!q || f.title.toLowerCase().includes(q) || f.author.toLowerCase().includes(q))
    );
  }, [funds, query, cat]);

  const showFeatured = !query.trim() && cat === "all";
  const list = showFeatured ? filtered.slice(1) : filtered;
  const featured = showFeatured ? filtered[0] : undefined;

  return (
    <div className="px-4 pb-8 pt-4">
      {/* живой тикер */}
      {ev && (
        <div className="flex items-center gap-2.5 overflow-hidden rounded-full bg-pine-900 px-3.5 py-2.5 text-mist shadow-card">
          <IconLive className="h-4 w-4 shrink-0 text-coral-400" />
          <p key={ev.id} className="animate-ticker truncate text-[12px] font-medium">
            {ev.own ? (
              <>
                <b className="text-amber-300">Вы</b> пожертвовали{" "}
                <b className="text-amber-300">{money(ev.amount)}</b> на «{ev.fundTitle}»
              </>
            ) : (
              <>
                <b className="text-amber-300">{ev.name}</b> жертвует{" "}
                <b className="text-amber-300">{money(ev.amount)}</b> — «{ev.fundTitle}»
              </>
            )}
          </p>
          <span className="relative ml-auto flex h-2 w-2 shrink-0">
            <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full bg-coral-400" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-coral-400" />
          </span>
        </div>
      )}

      {/* приветствие по роли */}
      {mode === "donor" ? (
        <div className="mt-5">
          <h1 className="font-display text-[22px] font-extrabold leading-tight text-ink">
            Кому помочь
            <br />
            <span className="text-pine-700">прямо сейчас?</span>
          </h1>
          <p className="mt-1.5 text-[13px] leading-relaxed text-ink-soft">
            {funds.filter((f) => !f.closed).length} активных сборов ждут участия. Ваша лепта дойдёт до адресата без комиссии.
          </p>
        </div>
      ) : (
        <button
          onClick={onCreate}
          className="press relative mt-5 w-full overflow-hidden rounded-[24px] bg-pine-900 p-5 text-left shadow-float"
        >
          <div className="absolute -right-8 -top-10 h-36 w-36 rounded-full bg-pine-700/60" />
          <div className="absolute -bottom-14 right-14 h-28 w-28 rounded-full bg-coral-500/25" />
          <p className="relative font-display text-[17px] font-bold leading-snug text-paper">
            Нужна помощь?
            <br />
            <span className="text-amber-300">Расскажите о беде — люди откликнутся</span>
          </p>
          <p className="relative mt-1.5 text-[12px] font-medium text-mist/70">
            Создать сбор · бесплатно · 2 минуты
          </p>
          <span className="relative mt-3.5 inline-flex items-center gap-1.5 rounded-full bg-coral-500 px-4 py-2 text-[12.5px] font-bold text-paper">
            <IconPlus className="h-4 w-4" />
            Начать сбор
          </span>
        </button>
      )}

      {/* поиск + категории */}
      <div className="sticky top-0 z-10 -mx-4 mt-4 bg-mist/95 px-4 pb-2 pt-2 backdrop-blur-sm">
        <label className="flex items-center gap-2.5 rounded-2xl border border-line bg-paper px-3.5 py-2.5 transition-colors focus-within:border-pine-600/50">
          <IconSearch className="h-4.5 w-4.5 shrink-0 text-ink-soft/70" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск по сборам и авторам…"
            className="w-full bg-transparent text-[13.5px] font-medium text-ink outline-none placeholder:text-ink-soft/60"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-[11px] font-bold text-pine-600">
              сброс
            </button>
          )}
        </label>
        <div className="no-scrollbar -mx-4 mt-2.5 flex gap-2 overflow-x-auto px-4">
          <Chip active={cat === "all"} onClick={() => setCat("all")}>
            Все
          </Chip>
          {CATEGORIES.map((c) => {
            const Icon = CATEGORY_ICONS[c.id];
            return (
              <Chip key={c.id} active={cat === c.id} onClick={() => setCat(cat === c.id ? "all" : c.id)}>
                <span className="flex items-center gap-1.5">
                  <Icon className="h-3.5 w-3.5" />
                  {c.label}
                </span>
              </Chip>
            );
          })}
        </div>
      </div>

      {/* список */}
      <div className="mt-3 space-y-3.5">
        {featured && (
          <Reveal>
            <FeaturedCard fund={featured} onOpen={() => onOpenFund(featured.id)} />
          </Reveal>
        )}

        {list.map((f, i) => (
          <Reveal key={f.id} delay={Math.min(i, 4) * 60}>
            <FundRow fund={f} onOpen={() => onOpenFund(f.id)} />
          </Reveal>
        ))}

        {filtered.length === 0 && (
          <div className="animate-fade rounded-[24px] border border-dashed border-line bg-paper p-8 text-center">
            <IconSearch className="mx-auto h-8 w-8 text-ink-soft/40" />
            <p className="mt-3 font-display text-[14px] font-bold text-ink">Ничего не нашлось</p>
            <p className="mt-1 text-[12.5px] text-ink-soft">
              Попробуйте другой запрос или категорию
            </p>
          </div>
        )}

        {/* CTA для жертвователей — создать свой сбор */}
        {mode === "donor" && filtered.length > 0 && (
          <Reveal>
            <button
              onClick={onCreate}
              className="press flex w-full items-center gap-4 rounded-[22px] border-2 border-dashed border-pine-600/35 bg-pine-50 p-4 text-left transition-colors hover:border-pine-600/60"
            >
              <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full bg-pine-700 text-paper">
                <span className="animate-pulse-ring absolute inset-0 rounded-full bg-pine-700" />
                <IconPlus className="relative h-5 w-5" />
              </span>
              <span>
                <span className="block text-[13.5px] font-bold text-pine-700">
                  Вам тоже нужна помощь?
                </span>
                <span className="mt-0.5 block text-[12px] text-ink-soft">
                  Создайте сбор — это бесплатно и занимает пару минут
                </span>
              </span>
              <IconArrowR className="ml-auto h-4 w-4 shrink-0 text-pine-600" />
            </button>
          </Reveal>
        )}
      </div>
    </div>
  );
}
