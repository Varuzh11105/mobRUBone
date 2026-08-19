import { useState } from "react";
import { useStore } from "../lib/store";
import { formatDate, money, num, plural } from "../lib/format";
import { CountUp, Reveal, copyText, useToast } from "../components/ui";
import {
  IconArrowR,
  IconCard,
  IconChevron,
  IconDoc,
  IconHand,
  IconHeart as IconHeartRow,
  IconShield,
  IconWallet,
} from "../components/icons";

/* ---------- История помощи ---------- */
export function HistoryScreen({ onGoFeed }: { onGoFeed: () => void }) {
  const { donations } = useStore();
  const total = donations.reduce((s, d) => s + d.amount, 0);

  return (
    <div className="px-4 pb-8 pt-5">
      <h1 className="font-display text-[21px] font-extrabold text-ink">Моя помощь</h1>

      {donations.length > 0 ? (
        <>
          <div className="relative mt-4 overflow-hidden rounded-[22px] bg-coral-500 p-5 text-paper shadow-float">
            <IconHeartRow className="absolute -right-4 -top-5 h-32 w-32 text-paper/15" />
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-paper/75">
              вы пожертвовали
            </p>
            <p className="font-display mt-1 text-[30px] font-extrabold leading-none">
              <CountUp to={total} format={money} />
            </p>
            <p className="mt-2 text-[12.5px] font-medium text-paper/85">
              {donations.length} {plural(donations.length, "пожертвование", "пожертвования", "пожертвований")} ·
              спасибо, что вы с нами
            </p>
          </div>

          <div className="mt-4 space-y-2.5">
            {donations.map((d, i) => (
              <Reveal key={d.id} delay={Math.min(i, 4) * 50}>
                <div className="flex items-center gap-3.5 rounded-[18px] border border-line/80 bg-paper p-3.5 shadow-card">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-coral-100 text-coral-600">
                    <IconHeartRow className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-bold text-ink">{d.fundTitle}</p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-[11px] font-medium text-ink-soft">
                      {formatDate(d.date)} · {d.method}
                      {d.anonymous && <span className="rounded bg-mist px-1.5 py-px text-[9.5px] font-bold uppercase text-ink-soft">анонимно</span>}
                    </p>
                  </div>
                  <span className="font-display text-[14px] font-extrabold text-pine-700">
                    +{money(d.amount)}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </>
      ) : (
        <div className="animate-fade mt-6 rounded-[24px] border border-dashed border-line bg-paper p-7 text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-coral-100 text-coral-500">
            <IconHeartRow className="h-7 w-7" />
          </span>
          <h2 className="font-display mt-4 text-[16px] font-bold text-ink">Здесь появятся ваши добрые дела</h2>
          <p className="mx-auto mt-2 max-w-[250px] text-[12.5px] leading-relaxed text-ink-soft">
            Каждое пожертвование сохраняется в истории — чтобы вы видели, сколько тепла уже подарили.
          </p>
          <button
            onClick={onGoFeed}
            className="press mx-auto mt-5 flex items-center gap-2 rounded-full bg-pine-900 px-6 py-3 font-display text-[13px] font-bold text-mist"
          >
            Найти, кому помочь
            <IconArrowR className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------- О сервисе ---------- */
export const FAQ = [
  {
    q: "Откуда платформа берёт деньги на комиссии?",
    a: "Ниоткуда — комиссии нет вовсе. Лепта существует на гранты и пожертвования на развитие сервиса. 100% вашего взноса доходит до адресата.",
  },
  {
    q: "Как проверяются сборы со значком «Проверен»?",
    a: "Автор загружает документы: диагнозы и счета из клиники, сметы, справки о ЧС. Модераторы и волонтёры проверяют их вручную, а после сбора публикуют отчёт о тратах.",
  },
  {
    q: "Что будет, если сбор не доберёт нужную сумму?",
    a: "Автор получает всё, что собрали, и обязан рассказать в обновлениях, на что направлены средства. Если цель не достигнута — честно пишет об этом донорам.",
  },
  {
    q: "Можно ли жертвовать анонимно?",
    a: "Да. Включите переключатель «Пожертвовать анонимно» перед оплатой — автор увидит только сумму, а в истории вы будете «Добрым человеком».",
  },
];

const STEPS = [
  {
    icon: IconDoc,
    title: "Расскажите о беде",
    text: "Опишите ситуацию, приложите документы и укажите сумму. Публикация занимает две минуты.",
  },
  {
    icon: IconHand,
    title: "Люди вносят свою лепту",
    text: "Сбор появляется в ленте. Кто-то даст 100 ₽, кто-то — тысячу. Каждое пожертвование видно в реальном времени.",
  },
  {
    icon: IconWallet,
    title: "Получите деньги и отчитайтесь",
    text: "Выводите средства на свою карту в любой момент. Расскажите донорам, как помогли их деньги.",
  },
];

export function AboutScreen() {
  const [open, setOpen] = useState<number | null>(0);
  const { toast } = useToast();

  return (
    <div className="px-4 pb-8 pt-5">
      {/* манифест */}
      <div className="relative overflow-hidden rounded-[26px] bg-pine-900 p-6 text-mist shadow-float">
        <div className="absolute -right-12 -top-14 h-44 w-44 rounded-full bg-pine-700/60" />
        <div className="absolute -bottom-16 -left-10 h-36 w-36 rounded-full bg-coral-500/20" />
        <p className="relative text-[10.5px] font-bold uppercase tracking-[0.18em] text-amber-300">
          Лепта · что это
        </p>
        <h1 className="font-display relative mt-2.5 text-[22px] font-extrabold leading-snug">
          Малая лепта —<br />
          <span className="text-amber-300">большая помощь</span>
        </h1>
        <p className="relative mt-2.5 text-[13px] leading-relaxed text-mist/75">
          Платформа, где тот, кому трудно, рассказывает о беде, а тот, кто готов, — помогает.
          Напрямую, прозрачно, без комиссий.
        </p>
        <div className="relative mt-5 grid grid-cols-3 gap-2">
          {[
            { v: 12_480, l: "сборов", f: num },
            { v: 214_000_000, l: "собрано, ₽", f: (n: number) => (n >= 1_000_000 ? num(n / 1_000_000) + " млн" : num(n)) },
            { v: 96_200, l: "участников", f: num },
          ].map((s, i) => (
            <div key={s.l} className="rounded-[16px] bg-pine-950/50 p-3 text-center">
              <p className="font-display text-[14.5px] font-extrabold text-paper">
                <CountUp to={s.v} fromZero format={s.f} duration={1200 + i * 250} />
              </p>
              <p className="mt-0.5 text-[9.5px] font-semibold uppercase tracking-wide text-mist/55">{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* как это работает */}
      <h2 className="font-display mt-7 text-[16px] font-extrabold text-ink">Как это работает</h2>
      <div className="relative mt-4 space-y-0">
        <span className="absolute bottom-6 left-[21px] top-6 w-px bg-line" />
        {STEPS.map((s, i) => (
          <Reveal key={s.title} delay={i * 90}>
            <div className="relative flex gap-4 pb-6 last:pb-0">
              <span className="relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-line bg-paper text-pine-700 shadow-card">
                <s.icon className="h-5 w-5" />
              </span>
              <div className="min-w-0 pt-0.5">
                <p className="font-display text-[13.5px] font-bold text-ink">
                  <span className="text-coral-500">0{i + 1}</span> · {s.title}
                </p>
                <p className="mt-1 text-[12.5px] leading-relaxed text-ink-soft">{s.text}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* безопасность */}
      <div className="mt-2 rounded-[22px] border border-line bg-paper p-4.5 shadow-card">
        <p className="flex items-center gap-2 font-display text-[13.5px] font-bold text-ink">
          <IconShield className="h-5 w-5 text-pine-700" />
          Безопасность и прозрачность
        </p>
        <ul className="mt-3 space-y-2.5">
          {[
            "Платежи проходят через лицензированный банк, данные карт не хранятся",
            "Сборы на лечение проверяются по документам вручную",
            "Комиссия платформы — 0%, отчёты о тратах обязательны",
          ].map((t) => (
            <li key={t} className="flex items-start gap-2.5 text-[12.5px] leading-relaxed text-ink-soft">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-coral-500" />
              {t}
            </li>
          ))}
        </ul>
      </div>

      {/* FAQ */}
      <h2 className="font-display mt-7 text-[16px] font-extrabold text-ink">Частые вопросы</h2>
      <div className="mt-3.5 space-y-2.5">
        {FAQ.map((f, i) => {
          const isOpen = open === i;
          return (
            <div
              key={f.q}
              className={`overflow-hidden rounded-[18px] border transition-colors ${
                isOpen ? "border-pine-600/40 bg-pine-50" : "border-line bg-paper"
              }`}
            >
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
              >
                <span className="text-[13px] font-bold leading-snug text-ink">{f.q}</span>
                <IconChevron
                  className={`h-4.5 w-4.5 shrink-0 text-pine-700 transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className="grid transition-[grid-template-rows] duration-300 ease-out"
                style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
              >
                <div className="overflow-hidden">
                  <p className="px-4 pb-4 text-[12.5px] leading-relaxed text-ink-soft">{f.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={async () => {
          await copyText("Лепта — платформа добрых сборов: lepta.app");
          toast("Ссылка на Лепту скопирована");
        }}
        className="press mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-pine-900 py-3.5 font-display text-[13px] font-bold text-mist"
      >
        <IconCard className="h-4.5 w-4.5" />
        Рассказать о Лепте друзьям
      </button>
    </div>
  );
}
