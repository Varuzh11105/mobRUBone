import { useMemo, useRef, useState } from "react";
import { useStore } from "../lib/store";
import { dayWord, money, num, pct, plural } from "../lib/format";
import {
  Avatar,
  CountUp,
  CoverImage,
  ProgressBar,
  Reveal,
  ToastProvider,
  useInView,
} from "../components/ui";
import {
  IconArrowR,
  IconArrowUpRight,
  IconBolt,
  IconCard,
  IconCheck,
  IconChevron,
  IconClock,
  IconDoc,
  IconFeed,
  IconHand,
  IconHeart,
  IconLive,
  IconShield,
  IconSpark,
  IconUsers,
  IconWallet,
  LogoMark,
} from "../components/icons";
import { MobileAppEmbed } from "../mobile/MobileApp";
import { FAQ } from "./HistoryAbout";
import { catById, type Mode } from "../lib/data";

const go = (hash: string) => {
  window.location.hash = hash;
};

/* ---------- живая бегущая лента ---------- */
const TICKER_POOL = [
  { name: "Анна", amount: 500, fund: "Тёплый вольер для 40 собак" },
  { name: "Дмитрий", amount: 1000, fund: "Крыловы остались без дома" },
  { name: "Ольга", amount: 300, fund: "Горячие обеды для бездомных" },
  { name: "Сергей", amount: 2000, fund: "Спасём Мирославу" },
  { name: "Мария", amount: 150, fund: "Гоночная коляска для Артёма" },
  { name: "Павел", amount: 700, fund: "Слуховые аппараты для Григория Михайловича" },
  { name: "Екатерина", amount: 500, fund: "Рюкзаки для пятерняшек Смирновых" },
  { name: "Иван", amount: 100, fund: "Тёплый вольер для 40 собак" },
  { name: "Наталья", amount: 1500, fund: "Спасём Мирославу" },
  { name: "Кирилл", amount: 300, fund: "Крыловы остались без дома" },
  { name: "Людмила", amount: 200, fund: "Горячие обеды для бездомных" },
  { name: "Роман", amount: 5000, fund: "Гоночная коляска для Артёма" },
];

function TickerBar() {
  return (
    <div className="flex items-center gap-3 bg-pine-950 py-2 text-mist">
      <span className="hidden shrink-0 items-center gap-2 pl-4 text-[10px] font-bold uppercase tracking-[0.18em] text-amber-300 sm:flex">
        <IconLive className="h-4 w-4 text-coral-400" />
        сейчас помогают
      </span>
      <div className="marquee relative flex-1 overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-pine-950 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-pine-950 to-transparent" />
        <div className="marquee-track">
          {[...TICKER_POOL, ...TICKER_POOL].map((t, i) => (
            <span key={i} className="mx-5 flex shrink-0 items-center gap-2 text-[12px] font-medium">
              <IconHeart className="h-3 w-3 text-coral-400" />
              <b className="font-bold text-paper">{t.name}</b>
              <span className="text-amber-300">{money(t.amount)}</span>
              <span className="max-w-[210px] truncate text-mist/60">→ «{t.fund}»</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- шапка ---------- */
const NAV = [
  { label: "Как это работает", href: "#how" },
  { label: "Сборам", href: "#funds" },
  { label: "Истории", href: "#stories" },
  { label: "Прозрачность", href: "#trust" },
  { label: "Вопросы", href: "#faq" },
];

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5">
        <a href="#top" className="press flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-pine-900 text-coral-400 shadow-card">
            <LogoMark className="h-6.5 w-6.5" />
          </span>
          <span>
            <span className="font-display block text-[17px] font-extrabold leading-none text-ink">Лепта</span>
            <span className="mt-1 block text-[8.5px] font-bold uppercase tracking-[0.18em] text-ink-soft/65">
              народные сборы
            </span>
          </span>
        </a>
        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="text-[13px] font-semibold text-ink-soft transition-colors hover:text-coral-600"
            >
              {n.label}
            </a>
          ))}
        </nav>
        <button
          onClick={() => go("#/app")}
          className="press flex items-center gap-2 rounded-full bg-coral-500 px-4.5 py-2.5 font-display text-[12.5px] font-bold text-paper shadow-[0_14px_28px_-12px_rgba(244,81,44,0.7)] transition-shadow hover:shadow-[0_18px_34px_-10px_rgba(244,81,44,0.8)]"
        >
          Открыть приложение
          <IconArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </header>
  );
}

/* ---------- вращающийся круговой штамп ---------- */
function OrbitBadge() {
  return (
    <div className="relative grid h-28 w-28 place-items-center">
      <svg viewBox="0 0 120 120" className="spin-slow absolute inset-0 h-full w-full">
        <defs>
          <path id="orbit-circ" d="M60,60 m-45,0 a45,45 0 1,1 90,0 a45,45 0 1,1 -90,0" fill="none" />
        </defs>
        <text className="font-display" fontSize="10.5" fontWeight="700" letterSpacing="2.5" fill="rgba(22,36,29,0.55)">
          <textPath href="#orbit-circ">ЛЕПТА · ДОБРО · ЛЕПТА · ДОБРО ·</textPath>
        </text>
      </svg>
      <span className="grid h-14 w-14 place-items-center rounded-full bg-coral-500 text-paper shadow-[0_14px_30px_-10px_rgba(244,81,44,0.7)]">
        <IconHeart className="h-6 w-6" />
      </span>
    </div>
  );
}

/* ---------- плавающие чипы живых пожертвований ---------- */
const CHIP_SPOTS = [
  "left-0 top-16 -translate-x-1/2 xl:-translate-x-[70%]",
  "right-0 top-1/2 translate-x-1/3 xl:translate-x-[64%]",
  "left-2 bottom-20 -translate-x-1/3 xl:-translate-x-[58%]",
];

function LiveChips() {
  const { ticker } = useStore();
  const evs = ticker.slice(0, 3);
  return (
    <>
      {evs.map((ev, i) => (
        <div
          key={ev.id}
          className={`animate-ticker pointer-events-none absolute z-20 hidden items-center gap-2.5 rounded-2xl border py-2 pl-2 pr-3.5 shadow-card lg:flex ${
            ev.own ? "border-coral-400 bg-coral-500 text-paper" : "border-line bg-paper text-ink"
          } ${CHIP_SPOTS[i] ?? ""}`}
        >
          <span
            className={`grid h-8 w-8 place-items-center rounded-full ${
              ev.own ? "bg-paper/20 text-paper" : "bg-coral-100 text-coral-600"
            }`}
          >
            <IconHeart className="h-4 w-4" />
          </span>
          <span>
            <span className="block text-[11.5px] font-bold leading-tight">
              {ev.name} · {money(ev.amount)}
            </span>
            <span className={`block max-w-[130px] truncate text-[9.5px] font-medium ${ev.own ? "text-paper/75" : "text-ink-soft"}`}>
              «{ev.fundTitle}»
            </span>
          </span>
        </div>
      ))}
    </>
  );
}

/* ---------- hero ---------- */
function Hero() {
  const { funds, setMode } = useStore();
  const totalRaised = funds.reduce((s, f) => s + f.raised, 0);
  const active = funds.filter((f) => !f.closed).length;

  return (
    <section
      id="top"
      className="relative overflow-hidden bg-mist"
      style={{
        backgroundImage: "radial-gradient(rgba(23,89,74,0.08) 1px, transparent 1px)",
        backgroundSize: "22px 22px",
      }}
    >
      <div className="pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-pine-100" />
      <div className="pointer-events-none absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-coral-100/70" />
      <IconHeart className="animate-drift-slow pointer-events-none absolute left-[8%] top-24 h-6 w-6 text-coral-500/40" />
      <IconSpark className="animate-drift pointer-events-none absolute right-[12%] top-40 h-5 w-5 text-amber-500/50" />
      <IconHeart className="animate-drift pointer-events-none absolute bottom-28 left-[42%] h-4 w-4 text-pine-600/30" style={{ animationDelay: "-5s" }} />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 pb-20 pt-12 lg:grid-cols-[1.06fr_0.94fr] lg:gap-8 lg:px-8 lg:pt-16">
        {/* левая колонка */}
        <div>
          <Reveal>
            <p className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-coral-600">
              <IconLive className="h-4.5 w-4.5" />
              платформа народных сборов · 0% комиссии
            </p>
          </Reveal>
          <Reveal delay={90}>
            <h1 className="font-display mt-5 text-[38px] font-extrabold leading-[1.04] tracking-tight text-ink sm:text-[52px] lg:text-[60px]">
              Каждому — по беде.
              <br />
              От каждого —<br />
              <span className="relative inline-block text-coral-500">
                по лепте.
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 220 12" fill="none" preserveAspectRatio="none">
                  <path d="M3 9c40-5 140-7 214-4" stroke="#f5a623" strokeWidth="5" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
          </Reveal>
          <Reveal delay={180}>
            <p className="mt-7 max-w-[440px] text-[15px] leading-relaxed text-ink-soft">
              Лепта соединяет тех, кому сейчас трудно, с теми, кто готов помочь. Автор рассказывает о беде
              и указывает сумму сбора — вы вносите свою лепту за минуту. Напрямую, прозрачно, без комиссий.
            </p>
          </Reveal>

          <Reveal delay={260}>
            <div className="mt-6 inline-flex flex-wrap items-center gap-x-4 gap-y-1.5 rounded-2xl border border-line bg-paper px-4.5 py-3 shadow-card">
              <span className="flex items-center gap-2 text-[12.5px] font-semibold text-ink">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-pulse-ring absolute h-2.5 w-2.5 rounded-full bg-mint-500" />
                  <span className="h-2.5 w-2.5 rounded-full bg-mint-500" />
                </span>
                Прямо сейчас собрано
                <b className="font-display text-pine-700">
                  <CountUp to={totalRaised} format={money} />
                </b>
              </span>
              <span className="hidden h-4 w-px bg-line sm:block" />
              <span className="text-[12.5px] font-semibold text-ink-soft">
                {active} {plural(active, "активный сбор", "активных сбора", "активных сборов")}
              </span>
            </div>
          </Reveal>

          <Reveal delay={340}>
            <div className="mt-7 flex flex-wrap items-center gap-3.5">
              <button
                onClick={() => go("#/app")}
                className="press flex items-center gap-2.5 rounded-full bg-pine-900 px-6.5 py-3.5 font-display text-[13.5px] font-bold text-mist shadow-card transition-colors hover:bg-pine-800"
              >
                Открыть приложение
                <IconArrowR className="h-4 w-4 text-amber-300" />
              </button>
              <button
                onClick={() => {
                  setMode("collector" as Mode);
                  go("#/app/new");
                }}
                className="press flex items-center gap-2 rounded-full border-2 border-pine-900/15 bg-transparent px-6 py-3 font-display text-[13.5px] font-bold text-pine-800 transition-colors hover:border-pine-900/40"
              >
                <IconHand className="h-4.5 w-4.5 text-coral-500" />
                Мне нужна помощь
              </button>
            </div>
          </Reveal>

          <Reveal delay={420}>
            <div className="mt-8 flex items-center gap-3.5">
              <span className="flex -space-x-2.5">
                <Avatar name="Анна Мария" size={34} />
                <Avatar name="Сергей Павлов" size={34} />
                <Avatar name="Ольга Дмитриева" size={34} />
                <span className="font-display grid h-[34px] w-[34px] place-items-center rounded-full border-2 border-mist bg-pine-700 text-[9px] font-bold text-mist">
                  +96к
                </span>
              </span>
              <p className="text-[12px] font-medium leading-snug text-ink-soft">
                уже вносят свою лепту —<br />
                присоединяйтесь
              </p>
            </div>
          </Reveal>
        </div>

        {/* правая колонка: живой телефон */}
        <div className="relative mx-auto w-fit py-4">
          <div className="absolute left-1/2 top-1/2 -z-0 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-pine-100/80" />
          <div className="absolute left-1/2 top-1/2 h-[430px] w-[430px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-pine-600/25" />
          <div className="absolute -right-6 -top-6 z-20 hidden md:block">
            <OrbitBadge />
          </div>
          <LiveChips />
          <div className="relative z-10">
            <MobileAppEmbed />
          </div>
          <p className="mt-5 text-center text-[11.5px] font-semibold text-ink-soft">
            Это не картинка — покрутите настоящее демо прямо здесь
            <IconSpark className="ml-1 inline h-3.5 w-3.5 text-amber-500" />
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------- две стороны ---------- */
const FLOWS = {
  donor: {
    label: "Я хочу помочь",
    steps: [
      {
        icon: IconFeed,
        title: "Найдите сбор",
        text: "Лента проверенных сборов с фильтрами по категориям и срочности. У каждого — история, документы и отчёты автора.",
      },
      {
        icon: IconHeart,
        title: "Нажмите «Помочь»",
        text: "Прочитайте историю и посмотрите, сколько уже собрано. Выберите сумму — от 50 ₽ до любой, при желании анонимно.",
      },
      {
        icon: IconCard,
        title: "Внесите лепту",
        text: "Карта или СБП — как удобнее. Чек появится сразу, а запись о помощи — в вашей личной истории добрых дел.",
      },
    ],
  },
  collector: {
    label: "Мне нужна помощь",
    steps: [
      {
        icon: IconDoc,
        title: "Расскажите о беде",
        text: "Опишите ситуацию, укажите сумму и срок. Приложите документы — и сбор получит значок «Проверен» и больше доверия.",
      },
      {
        icon: IconBolt,
        title: "Следите в реальном времени",
        text: "Каждое пожертвование видно мгновенно: кто и сколько внёс. Ссылкой на сбор можно поделиться одним нажатием.",
      },
      {
        icon: IconWallet,
        title: "Получите и отчитайтесь",
        text: "Выводите собранное на свою карту в любой момент. Опубликуйте чеки — доноры увидят, что их лепта дошла до дела.",
      },
    ],
  },
} as const;

function HowItWorks() {
  const [role, setRole] = useState<"donor" | "collector">("donor");
  const flow = FLOWS[role];

  return (
    <section id="how" className="relative bg-paper py-20 lg:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:px-8">
        {/* левая липкая колонка */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-coral-600">механика</p>
            <h2 className="font-display mt-4 text-[30px] font-extrabold leading-tight tracking-tight text-ink sm:text-[38px]">
              Две стороны
              <br />
              одного тепла
            </h2>
            <p className="mt-5 max-w-[380px] text-[14.5px] leading-relaxed text-ink-soft">
              В Лепте один и тот же человек может быть и тем, кто помогает, и тем, кому помогают.
              Переключитесь — и увидите, как это работает с вашей стороны.
            </p>
          </Reveal>

          <Reveal delay={120}>
            <div className="relative mt-8 grid max-w-[360px] grid-cols-2 rounded-full border border-line bg-mist p-1.5">
              <span
                className={`absolute bottom-1.5 top-1.5 w-[calc(50%-6px)] rounded-full bg-pine-900 shadow-card transition-all duration-300 ease-out ${
                  role === "donor" ? "left-1.5" : "left-[calc(50%+4.5px)]"
                }`}
              />
              {(Object.keys(FLOWS) as ("donor" | "collector")[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`relative z-10 rounded-full px-4 py-3 text-[12.5px] font-bold transition-colors duration-300 ${
                    role === r ? "text-amber-300" : "text-ink-soft hover:text-ink"
                  }`}
                >
                  {FLOWS[r].label}
                </button>
              ))}
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="mt-8 flex items-center gap-3 rounded-2xl border border-line bg-mist px-4.5 py-3.5">
              <IconShield className="h-6 w-6 shrink-0 text-pine-700" />
              <p className="text-[12px] font-medium leading-snug text-ink-soft">
                Сборы на лечение и ЧС проходят ручную проверку документов модераторами.
              </p>
            </div>
          </Reveal>
        </div>

        {/* шаги */}
        <div key={role} className="animate-sheet">
          <ol>
            {flow.steps.map((s, i) => (
              <li key={s.title} className={`flex gap-6 py-8 ${i > 0 ? "border-t border-line/80" : "pt-0"}`}>
                <span
                  className="font-display select-none text-[44px] font-black leading-none"
                  style={{ WebkitTextStroke: "1.5px rgba(22,36,29,0.28)", color: "transparent" }}
                >
                  0{i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <span className="inline-grid h-12 w-12 place-items-center rounded-2xl bg-pine-900 text-amber-300 shadow-card">
                    <s.icon className="h-5.5 w-5.5" />
                  </span>
                  <h3 className="font-display mt-4 text-[18px] font-bold text-ink">{s.title}</h3>
                  <p className="mt-2 max-w-[430px] text-[14px] leading-relaxed text-ink-soft">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-2 rounded-[22px] bg-pine-50 p-5">
            <p className="text-[13px] font-semibold text-pine-800">
              {role === "donor"
                ? "Средняя лепта на платформе — 412 ₽. Небольшие взносы складываются в спасённые жизни."
                : "Средний сбор закрывается за 11 дней. Начните — и уже сегодня о вашей беде узнают люди."}
            </p>
            <button
              onClick={() => go(role === "donor" ? "#/app" : "#/app/new")}
              className="press mt-3.5 inline-flex items-center gap-2 font-display text-[12.5px] font-bold text-coral-600"
            >
              {role === "donor" ? "Посмотреть сборы" : "Создать сбор"}
              <IconArrowR className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- живые сборы ---------- */
function LiveFunds() {
  const { funds } = useStore();
  const scroller = useRef<HTMLDivElement>(null);
  const open = funds.filter((f) => !f.closed);
  const scrollBy = (dir: number) =>
    scroller.current?.scrollBy({ left: dir * 350, behavior: "smooth" });

  return (
    <section id="funds" className="relative overflow-hidden bg-mist py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <Reveal>
            <div>
              <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-coral-600">
                <IconLive className="h-4.5 w-4.5" />
                лента обновляется в реальном времени
              </p>
              <h2 className="font-display mt-4 text-[30px] font-extrabold leading-tight tracking-tight text-ink sm:text-[38px]">
                Прямо сейчас собирают
              </h2>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="hidden gap-2.5 md:flex">
              <button
                onClick={() => scrollBy(-1)}
                aria-label="Назад"
                className="press grid h-11 w-11 place-items-center rounded-full border border-line bg-paper text-ink shadow-card hover:border-pine-600/40"
              >
                <IconArrowR className="h-4.5 w-4.5 rotate-180" />
              </button>
              <button
                onClick={() => scrollBy(1)}
                aria-label="Вперёд"
                className="press grid h-11 w-11 place-items-center rounded-full border border-line bg-paper text-ink shadow-card hover:border-pine-600/40"
              >
                <IconArrowR className="h-4.5 w-4.5" />
              </button>
            </div>
          </Reveal>
        </div>
      </div>

      <Reveal delay={160}>
        <div
          ref={scroller}
          className="no-scrollbar mt-9 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-5 pb-3 [scroll-padding-left:1.25rem] lg:px-[max(1.25rem,calc((100vw-72rem)/2+2rem))]"
        >
          {open.map((f) => {
            const p = pct(f.raised, f.goal);
            const cat = catById(f.category);
            return (
              <article
                key={f.id}
                className="group w-[290px] shrink-0 snap-start overflow-hidden rounded-[24px] border border-line/80 bg-paper shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-float sm:w-[325px]"
              >
                <button onClick={() => go(`#/app/${f.id}`)} className="block w-full text-left">
                  <div className="relative h-[168px] overflow-hidden">
                    <CoverImage
                      fund={f}
                      className="h-full w-full transition-transform duration-500 group-hover:scale-[1.05]"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-pine-950/80 px-3 py-1 text-[10.5px] font-bold text-mist backdrop-blur-sm">
                      {cat.label}
                    </span>
                    <span className="font-display absolute bottom-3 right-3 rounded-lg bg-paper px-2.5 py-1 text-[11px] font-extrabold text-pine-700 shadow-card">
                      {p}%
                    </span>
                  </div>
                  <div className="p-4.5">
                    <h3 className="line-clamp-2 min-h-[42px] text-[14.5px] font-bold leading-snug text-ink">
                      {f.title}
                    </h3>
                    <p className="mt-1.5 line-clamp-1 text-[12px] text-ink-soft">{f.author}</p>
                    <div className="mt-3.5">
                      <ProgressBar value={p} />
                      <div className="mt-2 flex items-baseline justify-between">
                        <span className="font-display text-[14px] font-extrabold text-coral-600">
                          <CountUp to={f.raised} format={money} />
                        </span>
                        <span className="text-[11.5px] font-medium text-ink-soft">из {money(f.goal)}</span>
                      </div>
                    </div>
                    <div className="mt-3.5 flex items-center gap-3 border-t border-line/70 pt-3.5 text-[11px] font-semibold text-ink-soft">
                      <span className="flex items-center gap-1.5">
                        <IconUsers className="h-3.5 w-3.5" />
                        {num(f.donors)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <IconClock className="h-3.5 w-3.5" />
                        {f.daysLeft} {dayWord(f.daysLeft)}
                      </span>
                      <span className="ml-auto flex items-center gap-1 font-display text-[11.5px] font-bold text-pine-700 transition-colors group-hover:text-coral-600">
                        Помочь
                        <IconArrowR className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                </button>
              </article>
            );
          })}

          {/* карточка-приглашение */}
          <button
            onClick={() => go("#/app/new")}
            className="press group flex w-[290px] shrink-0 snap-start flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-pine-600/30 bg-pine-50/60 p-8 text-center transition-colors hover:border-coral-500/60 hover:bg-coral-100/40 sm:w-[325px]"
          >
            <span className="grid h-16 w-16 place-items-center rounded-full bg-pine-900 text-amber-300 shadow-card transition-transform group-hover:scale-110">
              <IconHand className="h-7 w-7" />
            </span>
            <p className="font-display mt-5 text-[16px] font-bold leading-snug text-ink">
              Здесь может быть
              <br />
              ваш сбор
            </p>
            <p className="mt-2 text-[12.5px] leading-relaxed text-ink-soft">
              Создание занимает две минуты. Люди готовы помогать — расскажите им.
            </p>
            <span className="press mt-5 rounded-full bg-coral-500 px-5.5 py-2.5 font-display text-[12px] font-bold text-paper shadow-card">
              Создать сбор
            </span>
          </button>
        </div>
      </Reveal>
    </section>
  );
}

/* ---------- цифры ---------- */
function StatStrip() {
  const { ref, inView } = useInView<HTMLDivElement>(0.35);
  const stats = [
    { v: 214, suffix: " млн ₽", label: "собрано с 2023 года", size: "text-[46px] sm:text-[54px]", tone: "text-coral-600" },
    { v: 12480, suffix: "", label: "сборов закрыто с отчётом", size: "text-[34px] sm:text-[40px]", tone: "text-ink" },
    { v: 96200, suffix: "", label: "человек участвуют", size: "text-[34px] sm:text-[40px]", tone: "text-ink" },
    { v: 412, suffix: " ₽", label: "средняя лепта", size: "text-[28px] sm:text-[32px]", tone: "text-pine-700" },
  ];
  return (
    <section className="border-y border-line bg-paper">
      <div
        ref={ref}
        className="mx-auto flex max-w-6xl flex-wrap items-end justify-center gap-x-14 gap-y-8 px-5 py-14 md:justify-between lg:px-8"
      >
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 90}>
            <div className={i > 0 ? "md:border-l md:border-line md:pl-10" : ""}>
              <p className={`font-display ${s.size} font-extrabold leading-none tracking-tight ${s.tone}`}>
                {inView ? <CountUp to={s.v} fromZero duration={1400} format={num} /> : "0"}
                <span className="text-[0.62em]">{s.suffix}</span>
              </p>
              <p className="mt-2.5 text-[11.5px] font-semibold uppercase tracking-wide text-ink-soft">{s.label}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------- прозрачность: чек доброты ---------- */
const BARCODE = [2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 4, 1, 2, 3, 1, 2, 1, 1, 3, 2, 1, 2, 4, 1];

function Receipt() {
  let x = 0;
  return (
    <div className="relative mx-auto w-[300px] rotate-[2.5deg] rounded-md bg-paper p-6 text-ink shadow-float transition-transform duration-500 hover:rotate-0">
      <span className="absolute -left-2.5 top-[196px] h-5 w-5 rounded-full bg-pine-900" />
      <span className="absolute -right-2.5 top-[196px] h-5 w-5 rounded-full bg-pine-900" />

      <p className="font-display text-center text-[13px] font-extrabold tracking-[0.22em]">ЧЕК ДОБРОТЫ</p>
      <p className="mt-1 text-center text-[10px] font-semibold uppercase tracking-wide text-ink-soft">
        № 04213 · Лепта · сегодня, 14:07
      </p>

      <div className="mt-5 space-y-2.5 text-[12.5px] font-semibold">
        <div className="flex items-baseline gap-2">
          <span>Пожертвование</span>
          <span className="flex-1 border-b border-dotted border-ink/30" />
          <span className="font-display">500 ₽</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span>Комиссия Лепты</span>
          <span className="flex-1 border-b border-dotted border-ink/30" />
          <span className="font-display text-mint-500">0 ₽</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span>Комиссия банка</span>
          <span className="flex-1 border-b border-dotted border-ink/30" />
          <span className="font-display text-mint-500">0 ₽</span>
        </div>
      </div>

      <div className="my-5 border-t-2 border-dashed border-ink/25" />

      <div className="flex items-baseline justify-between text-[13.5px] font-extrabold">
        <span>Итого адресату</span>
        <span className="font-display text-[19px] text-coral-600">500 ₽</span>
      </div>

      <span className="font-display absolute right-4 top-[118px] -rotate-12 rounded-lg border-[3px] border-coral-500 px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-coral-500 opacity-85">
        100% дошло
      </span>

      <svg viewBox="0 0 120 26" className="mx-auto mt-6 h-9 w-[190px]">
        {BARCODE.map((w, i) => {
          const rect = <rect key={i} x={x} y="0" width={w} height="20" fill="#16241d" />;
          x += w + 1.6;
          return rect;
        })}
        <text x="60" y="25.5" textAnchor="middle" fontSize="5" fontWeight="700" fill="#55655b" letterSpacing="2">
          СПАСИБО ЗА ЛЕПТУ
        </text>
      </svg>
    </div>
  );
}

function Trust() {
  const points = [
    { title: "Комиссия платформы — 0 ₽", text: "Навсегда. Лепта живёт на гранты и пожертвования на развитие сервиса." },
    { title: "Ручная проверка сборов", text: "Диагнозы, счета из клиник, сметы и справки о ЧС проверяют модераторы и волонтёры." },
    { title: "Отчёты обязательны", text: "Автор публикует чеки и рассказывает, на что пошли деньги. Без отчёта — нельзя собирать снова." },
    { title: "Платежи через банк", text: "Деньги идут через лицензированный банк-партнёр. Данные карт не хранятся в Лепте." },
  ];
  return (
    <section id="trust" className="relative overflow-hidden bg-pine-900 py-20 text-mist lg:py-28">
      <div className="animate-drift pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-pine-700/50 blur-2xl" />
      <div className="animate-drift-slow pointer-events-none absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-coral-500/15 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <div>
          <Reveal>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-300">прозрачность</p>
            <h2 className="font-display mt-4 text-[30px] font-extrabold leading-tight tracking-tight text-paper sm:text-[38px]">
              Каждый рубль доходит
              <br />
              до адресата
            </h2>
            <p className="mt-5 max-w-[430px] text-[14.5px] leading-relaxed text-mist/70">
              Мы построили Лепту так, чтобы доверие не приходилось просить: всё видно — от первого взноса
              до последнего чека.
            </p>
          </Reveal>
          <div className="mt-9 space-y-6">
            {points.map((pt, i) => (
              <Reveal key={pt.title} delay={i * 90}>
                <div className="flex gap-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-coral-500/15 text-coral-400">
                    <IconCheck className="h-4.5 w-4.5" />
                  </span>
                  <div>
                    <h3 className="font-display text-[14.5px] font-bold text-paper">{pt.title}</h3>
                    <p className="mt-1 max-w-[400px] text-[13px] leading-relaxed text-mist/65">{pt.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        <Reveal delay={200}>
          <Receipt />
          <p className="mt-7 text-center text-[11.5px] font-medium text-mist/50">
            Так выглядит каждое пожертвование в Лепте
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- CTA для собирающих ---------- */
function CollectCta() {
  const { setMode } = useStore();
  return (
    <section id="collect" className="relative overflow-hidden bg-coral-500 py-18 text-paper lg:py-24">
      <IconHand className="pointer-events-none absolute -bottom-10 -right-8 h-64 w-64 rotate-12 text-paper/12" />
      <div className="animate-drift pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-amber-500/30 blur-2xl" />

      <div className="relative mx-auto max-w-6xl px-5 lg:px-8">
        <div className="max-w-[560px]">
          <Reveal>
            <h2 className="font-display text-[32px] font-extrabold leading-[1.06] tracking-tight sm:text-[44px]">
              Беда не ждёт.
              <br />
              Расскажите о ней сегодня.
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="mt-5 max-w-[440px] text-[14.5px] leading-relaxed text-paper/85">
              Если вам или вашим близким нужна помощь — не молчите. Публикация занимает две минуты,
              проверка документов — до суток, а первая лепта может прийти уже через час.
            </p>
          </Reveal>
          <Reveal delay={180}>
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <button
                onClick={() => {
                  setMode("collector");
                  go("#/app/new");
                }}
                className="press flex items-center gap-2.5 rounded-full bg-pine-900 px-7 py-3.5 font-display text-[13.5px] font-bold text-mist shadow-float transition-colors hover:bg-pine-950"
              >
                Создать сбор
                <IconArrowUpRight className="h-4 w-4 text-amber-300" />
              </button>
              <a
                href="#trust"
                className="press rounded-full border-2 border-paper/40 px-6 py-3 font-display text-[13px] font-bold text-paper transition-colors hover:border-paper"
              >
                Как проходит проверка
              </a>
            </div>
          </Reveal>
          <Reveal delay={260}>
            <div className="mt-8 flex flex-wrap gap-2.5">
              {["2 минуты на публикацию", "0% комиссии", "вывод на свою карту", "помощь модераторов"].map((t) => (
                <span key={t} className="rounded-full bg-pine-950/20 px-3.5 py-1.5 text-[11.5px] font-bold">
                  {t}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------- FAQ ---------- */
function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="bg-mist py-20 lg:py-28">
      <div className="mx-auto max-w-3xl px-5">
        <Reveal>
          <p className="text-center text-[11px] font-bold uppercase tracking-[0.2em] text-coral-600">
            прежде чем начать
          </p>
          <h2 className="font-display mt-4 text-center text-[30px] font-extrabold tracking-tight text-ink sm:text-[38px]">
            Частые вопросы
          </h2>
        </Reveal>
        <div className="mt-10 space-y-3">
          {FAQ.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q} delay={i * 60}>
                <div
                  className={`overflow-hidden rounded-[20px] border transition-colors duration-300 ${
                    isOpen ? "border-pine-600/40 bg-paper shadow-card" : "border-line bg-paper/60 hover:bg-paper"
                  }`}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-5.5 py-4.5 text-left"
                  >
                    <span className="text-[14.5px] font-bold leading-snug text-ink">{f.q}</span>
                    <span
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition-all duration-300 ${
                        isOpen ? "rotate-180 bg-pine-900 text-amber-300" : "bg-mist text-ink-soft"
                      }`}
                    >
                      <IconChevron className="h-4 w-4" />
                    </span>
                  </button>
                  <div
                    className="grid transition-[grid-template-rows] duration-300 ease-out"
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5.5 pb-5 text-[13.5px] leading-relaxed text-ink-soft">{f.a}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- подвал ---------- */
function Footer() {
  return (
    <footer className="bg-pine-950 pb-8 pt-14 text-mist">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <span className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-paper/10 text-coral-400">
                <LogoMark className="h-6.5 w-6.5" />
              </span>
              <span>
                <span className="font-display block text-[17px] font-extrabold leading-none text-paper">Лепта</span>
                <span className="mt-1 block text-[8.5px] font-bold uppercase tracking-[0.18em] text-mist/50">
                  народные сборы
                </span>
              </span>
            </span>
            <p className="mt-4 max-w-[300px] text-[13px] leading-relaxed text-mist/60">
              Малая лепта — большая помощь. Платформа, где помогают напрямую: без комиссий, с отчётами
              и человеческими историями.
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              <StoreBadge store="apple" />
              <StoreBadge store="google" />
            </div>
            <button
              onClick={() => go("#/app")}
              className="press mt-4 inline-flex items-center gap-2 rounded-full bg-coral-500 px-5.5 py-3 font-display text-[12.5px] font-bold text-paper shadow-card transition-colors hover:bg-coral-600"
            >
              Открыть веб-версию
              <IconArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <div>
            <p className="font-display text-[12px] font-bold uppercase tracking-[0.16em] text-mist/45">Разделы</p>
            <ul className="mt-4 space-y-2.5 text-[13.5px] font-medium">
              {NAV.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="text-mist/75 transition-colors hover:text-amber-300">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-display text-[12px] font-bold uppercase tracking-[0.16em] text-mist/45">Контакты</p>
            <ul className="mt-4 space-y-2.5 text-[13.5px] font-medium">
              <li>
                <a href="mailto:privet@lepta.app" className="text-mist/75 transition-colors hover:text-amber-300">
                  privet@lepta.app
                </a>
              </li>
              <li>
                <a href="mailto:press@lepta.app" className="text-mist/75 transition-colors hover:text-amber-300">
                  press@lepta.app
                </a>
              </li>
              <li className="text-mist/45">@lepta — мы на связи</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
          <p className="text-[11.5px] font-medium text-mist/40">
            © 2026 Лепта · Учебный демо-проект: платежи не списываются, данные живут в вашем браузере.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="press flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-[11.5px] font-bold text-mist/70 transition-colors hover:border-amber-300/60 hover:text-amber-300"
          >
            Наверх
            <IconChevron className="h-3.5 w-3.5 rotate-180" />
          </button>
        </div>
      </div>
    </footer>
  );
}

/* ---------- бегущая строка-разделитель ---------- */
function MarqueeDivider() {
  return (
    <div className="marquee overflow-hidden border-y-2 border-ink bg-amber-500 py-3.5">
      <div className="marquee-track">
        {Array.from({ length: 6 }).map((_, i) => (
          <span
            key={i}
            className="font-display mx-6 flex shrink-0 items-center gap-6 text-[15px] font-extrabold uppercase tracking-[0.14em] text-ink"
          >
            Малая лепта — большая помощь
            <IconHeart className="h-4 w-4 text-coral-600" />
            Помогают напрямую
            <IconHeart className="h-4 w-4 text-coral-600" />
            0% комиссии
            <IconHeart className="h-4 w-4 text-coral-600" />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------- истории, которые сбылись ---------- */
const STORIES = [
  {
    id: "st1",
    category: "treatment" as const,
    tag: "Лечение",
    title: "Протез для Дани",
    person: "Марина, сестра",
    quote:
      "Сбор закрыли за 12 дней. Даня уже ходит без костылей, а через месяц возвращается в свою футбольную секцию. Мы до сих пор не верим.",
    raised: 740000,
    donors: 862,
    meta: "12 дней · закрыт с отчётом",
  },
  {
    id: "st2",
    category: "disaster" as const,
    tag: "Беда в дом",
    title: "Дом для Соловьёвых",
    person: "Пётр, отец семейства",
    quote:
      "После пожара мы остались в чём стояли. Через Лепту собрали на новый сруб, а соседи помогли с бригадой. К зиме заехали в тёплый дом.",
    raised: 1300000,
    donors: 1204,
    meta: "3 недели · закрыт с отчётом",
  },
  {
    id: "st3",
    category: "animals" as const,
    tag: "Животные",
    title: "Отопление для приюта «Лада»",
    person: "Вера, волонтёр",
    quote:
      "Сорок собак и двенадцать кошек встретили морозы в тепле. Каждый жертвователь получил фотоотчёт — люди плакали от счастья вместе с нами.",
    raised: 260000,
    donors: 517,
    meta: "9 дней · закрыт с отчётом",
  },
];

function StoriesSection() {
  return (
    <section id="stories" className="relative overflow-hidden bg-paper py-20 lg:py-28">
      <div className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-mint-100/60" />
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <Reveal>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-mint-500">уже помогли</p>
              <h2 className="font-display mt-4 text-[30px] font-extrabold leading-tight tracking-tight text-ink sm:text-[38px]">
                Истории, которые
                <br />
                сбылись
              </h2>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <p className="max-w-[320px] text-[13.5px] leading-relaxed text-ink-soft">
              Каждый закрытый сбор заканчивается отчётом. Вот лишь несколько историй, за которыми стоят
              тысячи ваших лепт.
            </p>
          </Reveal>
        </div>

        <div className="mt-11 grid gap-6 md:grid-cols-3">
          {STORIES.map((s, i) => (
            <Reveal key={s.id} delay={i * 110}>
              <article className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-line/80 bg-mist shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-float">
                <div className="relative h-40 overflow-hidden">
                  <CoverImage
                    fund={{ id: s.id, category: s.category, title: s.title } as never}
                    className="h-full w-full transition-transform duration-500 group-hover:scale-[1.06]"
                  />
                  <span className="absolute left-3.5 top-3.5 rounded-full bg-mint-500 px-3 py-1 text-[10.5px] font-bold text-paper shadow-card">
                    ✓ {s.meta}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5.5">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-display text-[16px] font-bold leading-snug text-ink">{s.title}</h3>
                    <span className="font-display shrink-0 text-[14px] font-extrabold text-mint-500">
                      {money(s.raised)}
                    </span>
                  </div>
                  <p className="mt-3 flex-1 border-l-[3px] border-coral-500 pl-3.5 text-[13px] leading-relaxed text-ink-soft">
                    «{s.quote}»
                  </p>
                  <div className="mt-4.5 flex items-center gap-2.5 border-t border-line/80 pt-4">
                    <Avatar name={s.person} size={32} />
                    <div className="min-w-0">
                      <p className="truncate text-[12.5px] font-bold text-ink">{s.person}</p>
                      <p className="text-[10.5px] font-semibold text-ink-soft">
                        {num(s.donors)} {plural(s.donors, "человек", "человека", "человек")} помогли
                      </p>
                    </div>
                    <IconHeart className="ml-auto h-4.5 w-4.5 shrink-0 text-coral-500 transition-transform group-hover:scale-125" />
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- голоса ---------- */
const VOICES = [
  {
    name: "Анна Ковалёва",
    role: "жертвует каждый месяц",
    text: "Мне нравится видеть вживую, как копится сбор. Вношу по 300–500 рублей, и это правда складывается в чью-то операцию.",
    tone: "coral" as const,
  },
  {
    name: "Дмитрий Соколов",
    role: "собрал на лечение мамы",
    text: "Боялся просить. Но когда за первые сутки пришло 40 тысяч от незнакомых людей — понял, что люди хотят помогать.",
    tone: "pine" as const,
  },
  {
    name: "Ольга Мирная",
    role: "волонтёр-модератор",
    text: "Проверяю документы сборов на лечение. Это кропотливо, но именно так рождается доверие — а без него ничего не работает.",
    tone: "amber" as const,
  },
];

function VoicesSection() {
  const tones = {
    coral: "border-coral-500/40",
    pine: "border-pine-600/40",
    amber: "border-amber-500/50",
  } as const;
  return (
    <section className="relative overflow-hidden bg-mist py-20 lg:py-26">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <Reveal>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-coral-600">живые слова</p>
          <h2 className="font-display mt-4 text-[30px] font-extrabold tracking-tight text-ink sm:text-[38px]">
            Что говорят участники
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {VOICES.map((v, i) => (
            <Reveal key={v.name} delay={i * 100}>
              <figure
                className={`flex h-full flex-col rounded-[22px] border-t-4 bg-paper p-6 shadow-card transition-transform duration-300 hover:-translate-y-1 ${tones[v.tone]}`}
              >
                <IconSpark className="h-5 w-5 text-amber-500" />
                <blockquote className="mt-4 flex-1 text-[14px] leading-relaxed text-ink">«{v.text}»</blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-line/80 pt-4">
                  <Avatar name={v.name} size={38} />
                  <div>
                    <p className="font-display text-[13px] font-bold text-ink">{v.name}</p>
                    <p className="text-[11px] font-semibold text-ink-soft">{v.role}</p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- бейджи магазинов ---------- */
function StoreBadge({ store }: { store: "apple" | "google" }) {
  return (
    <button
      onClick={() => go("#/app")}
      className="press flex items-center gap-3 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-left transition-colors hover:border-amber-300/50 hover:bg-white/10"
    >
      {store === "apple" ? (
        <svg viewBox="0 0 24 24" className="h-7 w-7 text-paper" fill="currentColor">
          <path d="M17.05 20.28c-.98.95-2.05.86-3.08.38-1.09-.5-2.08-.53-3.24 0-1.44.66-2.2.47-3.06-.38C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.08zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-6.5 w-6.5" fill="none">
          <path d="M4 3.5v17l9-8.5-9-8.5Z" fill="#f5a623" />
          <path d="M4 3.5 16.5 10 13 12 4 3.5Z" fill="#2e9e6b" />
          <path d="M4 20.5 16.5 14 13 12 4 20.5Z" fill="#f4512c" />
          <path d="M16.5 10 20 12l-3.5 2L13 12l3.5-2Z" fill="#ffc95e" />
        </svg>
      )}
      <span>
        <span className="block text-[9px] font-semibold uppercase tracking-wide text-mist/55">
          {store === "apple" ? "Загрузите в" : "Доступно в"}
        </span>
        <span className="font-display block text-[13.5px] font-bold leading-tight text-paper">
          {store === "apple" ? "App Store" : "Google Play"}
        </span>
      </span>
    </button>
  );
}

/* ---------- страница целиком ---------- */
export function Landing() {
  return (
    <ToastProvider containerClass="fixed inset-x-4 bottom-5">
      <div className="relative min-h-dvh overflow-x-clip bg-mist font-body text-ink">
        <TickerBar />
        <Header />
        <main>
          <Hero />
          <MarqueeDivider />
          <HowItWorks />
          <LiveFunds />
          <StoriesSection />
          <StatStrip />
          <Trust />
          <VoicesSection />
          <CollectCta />
          <FaqSection />
        </main>
        <Footer />
      </div>
    </ToastProvider>
  );
}
