import { useEffect, useMemo, useRef, useState } from "react";
import { useStore } from "../lib/store";
import { catById, type Fund } from "../lib/data";
import { dayWord, money, num, pct, plural, timeAgo } from "../lib/format";
import {
  Avatar,
  CountUp,
  CoverImage,
  ProgressBar,
  Toggle,
  formatMoneyInput,
  useToast,
  copyText,
} from "../components/ui";
import {
  IconBack,
  IconCard,
  IconCheck,
  IconClose,
  IconSBP,
  IconShare,
  IconSpark,
  IconUsers,
  IconVerified,
  IconWallet,
} from "../components/icons";

/* ---------- мок-QR для СБП ---------- */
function QrMock({ seed }: { seed: string }) {
  const N = 21;
  const cells = useMemo(() => {
    let h = 2166136261;
    for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
    const rnd = () => {
      h ^= h << 13; h ^= h >>> 17; h ^= h << 5;
      return ((h >>> 0) % 100) / 100;
    };
    const grid: boolean[][] = Array.from({ length: N }, () => Array(N).fill(false));
    for (let y = 0; y < N; y++)
      for (let x = 0; x < N; x++) grid[y][x] = rnd() > 0.52;
    const finder = (ox: number, oy: number) => {
      for (let y = 0; y < 7; y++)
        for (let x = 0; x < 7; x++) {
          const edge = x === 0 || y === 0 || x === 6 || y === 6;
          const core = x >= 2 && x <= 4 && y >= 2 && y <= 4;
          grid[oy + y][ox + x] = edge || core;
        }
      for (let i = -1; i < 8; i++) {
        const px = ox + i, py = oy + i;
        if (grid[oy - 1]?.[px] !== undefined) grid[oy - 1][px] = false;
        if (grid[oy + 7]?.[px] !== undefined) grid[oy + 7][px] = false;
        if (grid[py]?.[ox - 1] !== undefined) grid[py][ox - 1] = false;
        if (grid[py]?.[ox + 7] !== undefined) grid[py][ox + 7] = false;
      }
    };
    finder(0, 0); finder(N - 7, 0); finder(0, N - 7);
    return grid;
  }, [seed]);

  return (
    <svg viewBox={`0 0 ${N} ${N}`} className="h-full w-full" shapeRendering="crispEdges">
      <rect width={N} height={N} fill="#fbfcf9" />
      {cells.map((row, y) =>
        row.map((on, x) =>
          on ? <rect key={`${x}-${y}`} x={x} y={y} width={1.02} height={1.02} fill="#1c2126" /> : null
        )
      )}
    </svg>
  );
}

/* ---------- всплеск сердец ---------- */
function HeartBurst() {
  const hearts = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        id: i,
        left: 12 + Math.random() * 76,
        delay: Math.random() * 0.5,
        dur: 1.1 + Math.random() * 0.8,
        size: 14 + Math.random() * 18,
        rot: -30 + Math.random() * 60,
        color: ["#21a038", "#f2e913", "#0e9b5c", "#3cbb57"][i % 4],
      })),
    []
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {hearts.map((h) => (
        <svg
          key={h.id}
          viewBox="0 0 24 24"
          className="animate-heart-up absolute bottom-1/3"
          style={{
            left: `${h.left}%`,
            width: h.size,
            height: h.size,
            animationDelay: `${h.delay}s`,
            animationDuration: `${h.dur}s`,
            ["--rot" as string]: `${h.rot}deg`,
          }}
        >
          <path
            d="M12 21c-5.5-3.7-9-7.3-9-11.2A5.1 5.1 0 0 1 12 6a5.1 5.1 0 0 1 9 3.8C21 13.7 17.5 17.3 12 21Z"
            fill={h.color}
          />
        </svg>
      ))}
    </div>
  );
}

/* ---------- флоу пожертвования ---------- */
type Step = "amount" | "method" | "processing" | "success";

function DonateSheet({ fund, onClose }: { fund: Fund; onClose: () => void }) {
  const { donate } = useStore();
  const { toast } = useToast();
  const [step, setStep] = useState<Step>("amount");
  const [amount, setAmount] = useState(500);
  const [custom, setCustom] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [method, setMethod] = useState<"card" | "sbp">("card");
  const [card, setCard] = useState({ number: "", exp: "", cvc: "", name: "" });
  const [cardErr, setCardErr] = useState("");
  const dispatched = useRef(false);

  const finalAmount = custom ? Number(custom.replace(/\D/g, "")) : amount;
  const p = pct(fund.raised, fund.goal);

  const setCustomFmt = (v: string) => {
    setCustom(formatMoneyInput(v));
    setAmount(0);
  };

  const validCard = () => {
    const digits = card.number.replace(/\D/g, "");
    if (digits.length !== 16) return "Введите номер карты полностью";
    const m = card.exp.match(/^(\d{2})\/(\d{2})$/);
    if (!m || Number(m[1]) < 1 || Number(m[1]) > 12) return "Срок действия — ММ/ГГ";
    if (card.cvc.length !== 3) return "CVC — 3 цифры с обратной стороны";
    if (card.name.trim().length < 2) return "Введите имя, как на карте";
    return "";
  };

  const pay = () => {
    if (method === "card") {
      const err = validCard();
      if (err) {
        setCardErr(err);
        return;
      }
    }
    setCardErr("");
    setStep("processing");
    window.setTimeout(() => {
      if (!dispatched.current) {
        dispatched.current = true;
        donate(fund.id, finalAmount, method === "card" ? "Банковская карта" : "СБП", anonymous);
      }
      setStep("success");
    }, 1500);
  };

  const shareGood = async () => {
    await copyText(`Я только что помог(ла) сбору «${fund.title}» в Лепте. Присоединяйтесь: lepta.app/f/${fund.id}`);
    toast("Сообщение скопировано — поделитесь добром!");
  };

  const inputCls =
    "w-full rounded-xl border border-line bg-mist/60 px-3.5 py-3 text-[14px] font-semibold text-ink outline-none transition-colors placeholder:font-normal placeholder:text-ink-soft/50 focus:border-pine-600/60";

  return (
    <div className="absolute inset-0 z-50 flex flex-col">
      <button aria-label="Закрыть" onClick={onClose} className="animate-fade absolute inset-0 bg-pine-950/55" />
      <div className="animate-sheet relative mt-auto flex max-h-[94%] flex-col rounded-t-[28px] bg-paper shadow-float">
        <div className="mx-auto mt-2.5 h-1 w-10 shrink-0 rounded-full bg-line" />

        {step === "success" ? (
          <div className="relative flex flex-col items-center px-6 pb-9 pt-8 text-center">
            <HeartBurst />
            <span className="animate-pop relative grid h-20 w-20 place-items-center rounded-full bg-mint-100">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-mint-500 text-paper">
                <IconCheck className="h-7 w-7" />
              </span>
            </span>
            <h2 className="font-display relative mt-5 text-[21px] font-extrabold text-ink">
              Спасибо за вашу лепту!
            </h2>
            <p className="relative mt-2 text-[13.5px] leading-relaxed text-ink-soft">
              <b className="text-coral-600">{money(finalAmount)}</b> уже в пути к «{fund.title}».
              {anonymous ? " Вы остались инкогнито — как и просили." : " Автор увидит ваше имя в списке доноров."}
            </p>
            <div className="relative mt-5 w-full space-y-2.5">
              <button
                onClick={shareGood}
                className="press flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-pine-700/25 bg-paper py-3.5 text-[14px] font-bold text-pine-700"
              >
                <IconShare className="h-4.5 w-4.5" />
                Поделиться добром
              </button>
              <button
                onClick={onClose}
                className="press w-full rounded-2xl bg-pine-900 py-3.5 text-[14px] font-bold text-mist"
              >
                Вернуться к сборам
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* шапка с мини-инфой о сборе */}
            <div className="flex items-center gap-3 border-b border-line/70 px-5 py-3.5">
              <button
                onClick={() => (step === "method" ? setStep("amount") : onClose())}
                disabled={step === "processing"}
                aria-label="Назад"
                className="press grid h-9 w-9 shrink-0 place-items-center rounded-full bg-mist text-ink disabled:opacity-40"
              >
                {step === "method" ? <IconBack className="h-4.5 w-4.5" /> : <IconClose className="h-4 w-4" />}
              </button>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-bold text-ink">{fund.title}</p>
                <div className="mt-1 flex items-center gap-2">
                  <ProgressBar value={p} thin className="flex-1" />
                  <span className="font-display text-[10.5px] font-bold text-pine-700">{p}%</span>
                </div>
              </div>
              <button
                onClick={onClose}
                disabled={step === "processing"}
                aria-label="Закрыть"
                className="press grid h-9 w-9 shrink-0 place-items-center rounded-full bg-mist text-ink disabled:opacity-40"
              >
                <IconClose className="h-4 w-4" />
              </button>
            </div>

            {step === "processing" ? (
              <div className="flex flex-col items-center px-6 py-14 text-center">
                <span className="relative grid h-16 w-16 place-items-center">
                  <span className="animate-pulse-ring absolute inset-0 rounded-full bg-coral-500/50" />
                  <svg viewBox="0 0 24 24" className="animate-spin-slow h-14 w-14 text-pine-700" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                    <path d="M12 3a9 9 0 1 0 9 9" />
                  </svg>
                </span>
                <p className="font-display mt-5 text-[15px] font-bold text-ink">Проводим платёж…</p>
                <p className="mt-1.5 text-[12.5px] text-ink-soft">
                  Безопасное соединение с банком. Обычно это пара секунд.
                </p>
              </div>
            ) : (
              <div className="overflow-y-auto px-5 pb-6 pt-4">
                {step === "amount" && (
                  <>
                    <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-soft">
                      Сумма пожертвования
                    </p>
                    <div className="mt-3 grid grid-cols-3 gap-2.5">
                      {[100, 300, 500, 1000, 3000, 5000].map((v) => (
                        <button
                          key={v}
                          onClick={() => { setAmount(v); setCustom(""); }}
                          className={`press rounded-2xl border-2 py-3 font-display text-[13.5px] font-bold transition-colors ${
                            !custom && amount === v
                              ? "border-coral-500 bg-coral-100 text-coral-600"
                              : "border-line bg-paper text-ink hover:border-coral-400/50"
                          }`}
                        >
                          {num(v)} ₽
                        </button>
                      ))}
                    </div>
                    <label className="mt-3 flex items-center gap-2 rounded-2xl border-2 border-line bg-mist/50 px-4 py-3.5 transition-colors focus-within:border-coral-500">
                      <input
                        inputMode="numeric"
                        value={custom}
                        onChange={(e) => setCustomFmt(e.target.value)}
                        placeholder="Своя сумма"
                        className="font-display w-full bg-transparent text-[16px] font-bold text-ink outline-none placeholder:font-body placeholder:text-[14px] placeholder:font-normal placeholder:text-ink-soft/60"
                      />
                      <span className="font-display text-[15px] font-bold text-ink-soft">₽</span>
                    </label>
                    <div className="mt-4 rounded-2xl bg-mist/70 px-4 py-3.5">
                      <Toggle
                        checked={anonymous}
                        onChange={setAnonymous}
                        label="Пожертвовать анонимно"
                      />
                    </div>
                    <p className="mt-3 flex items-start gap-2 text-[11.5px] leading-relaxed text-ink-soft/80">
                      <IconSpark className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                      Комиссия платформы — 0%. Вся сумма дойдёт до адресата.
                    </p>
                  </>
                )}

                {step === "method" && (
                  <>
                    <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-soft">
                      Удобный способ оплаты
                    </p>
                    <div className="mt-3 space-y-2.5">
                      <button
                        onClick={() => setMethod("card")}
                        className={`press flex w-full items-center gap-3 rounded-2xl border-2 p-3.5 text-left transition-colors ${
                          method === "card" ? "border-pine-700 bg-pine-50" : "border-line bg-paper"
                        }`}
                      >
                        <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${method === "card" ? "bg-pine-700 text-paper" : "bg-mist text-ink-soft"}`}>
                          <IconCard className="h-5 w-5" />
                        </span>
                        <span className="flex-1">
                          <span className="block text-[14px] font-bold text-ink">Банковская карта</span>
                          <span className="text-[11.5px] text-ink-soft">Visa · Mastercard · МИР</span>
                        </span>
                        <span className={`h-4.5 w-4.5 rounded-full border-2 ${method === "card" ? "border-pine-700 bg-pine-700 shadow-[inset_0_0_0_2.5px_#fbfcf9]" : "border-line"}`} />
                      </button>
                      <button
                        onClick={() => setMethod("sbp")}
                        className={`press flex w-full items-center gap-3 rounded-2xl border-2 p-3.5 text-left transition-colors ${
                          method === "sbp" ? "border-pine-700 bg-pine-50" : "border-line bg-paper"
                        }`}
                      >
                        <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${method === "sbp" ? "bg-pine-700 text-paper" : "bg-mist text-ink-soft"}`}>
                          <IconSBP className="h-5 w-5" />
                        </span>
                        <span className="flex-1">
                          <span className="block text-[14px] font-bold text-ink">СБП — по QR-коду</span>
                          <span className="text-[11.5px] text-ink-soft">Из любого банка, без комиссии</span>
                        </span>
                        <span className={`h-4.5 w-4.5 rounded-full border-2 ${method === "sbp" ? "border-pine-700 bg-pine-700 shadow-[inset_0_0_0_2.5px_#fbfcf9]" : "border-line"}`} />
                      </button>
                    </div>

                    {method === "card" ? (
                      <div className="animate-fade mt-4 space-y-2.5">
                        <input
                          inputMode="numeric"
                          value={card.number}
                          onChange={(e) => {
                            const d = e.target.value.replace(/\D/g, "").slice(0, 16);
                            setCard({ ...card, number: d.replace(/(\d{4})(?=\d)/g, "$1 ") });
                          }}
                          placeholder="0000 0000 0000 0000"
                          className={inputCls}
                        />
                        <div className="flex gap-2.5">
                          <input
                            inputMode="numeric"
                            value={card.exp}
                            onChange={(e) => {
                              let d = e.target.value.replace(/\D/g, "").slice(0, 4);
                              if (d.length > 2) d = d.slice(0, 2) + "/" + d.slice(2);
                              setCard({ ...card, exp: d });
                            }}
                            placeholder="ММ/ГГ"
                            className={inputCls}
                          />
                          <input
                            inputMode="numeric"
                            type="password"
                            value={card.cvc}
                            onChange={(e) => setCard({ ...card, cvc: e.target.value.replace(/\D/g, "").slice(0, 3) })}
                            placeholder="CVC"
                            className={inputCls}
                          />
                        </div>
                        <input
                          value={card.name}
                          onChange={(e) => setCard({ ...card, name: e.target.value.toUpperCase() })}
                          placeholder="IVAN IVANOV"
                          className={inputCls}
                        />
                        {cardErr && (
                          <p className="animate-ticker rounded-xl bg-coral-100 px-3.5 py-2.5 text-[12px] font-semibold text-coral-600">
                            {cardErr}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="animate-fade mt-4 flex flex-col items-center rounded-2xl border border-line bg-mist/50 p-5">
                        <div className="h-40 w-40 overflow-hidden rounded-2xl border border-line bg-paper p-2 shadow-card">
                          <QrMock seed={fund.id + finalAmount} />
                        </div>
                        <p className="mt-3 text-center text-[12px] leading-relaxed text-ink-soft">
                          Отсканируйте код камерой телефона
                          <br />
                          или в приложении вашего банка
                        </p>
                      </div>
                    )}
                  </>
                )}

                {/* итог + кнопка */}
                <div className="sticky bottom-0 mt-5 rounded-2xl bg-paper pt-1">
                  <div className="mb-3 flex items-center justify-between text-[12.5px]">
                    <span className="font-medium text-ink-soft">К оплате</span>
                    <span className="font-display text-[17px] font-extrabold text-ink">
                      {money(finalAmount || 0)}
                    </span>
                  </div>
                  <button
                    onClick={() => (step === "amount" ? setStep("method") : pay())}
                    disabled={!finalAmount || finalAmount < 10}
                    className="press relative w-full overflow-hidden rounded-2xl bg-coral-500 py-4 font-display text-[14.5px] font-bold text-paper shadow-[0_14px_30px_-10px_rgba(33,160,56,0.65)] transition-opacity disabled:opacity-40"
                  >
                    {step === "amount" ? "Продолжить" : `Пожертвовать ${money(finalAmount || 0)}`}
                  </button>
                  <p className="mt-2.5 text-center text-[10.5px] text-ink-soft/70">
                    Нажимая, вы соглашаетесь с офертой платформы · демо-режим
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ---------- экран сбора ---------- */
export function FundDetailScreen({ fundId, onClose }: { fundId: string; onClose: () => void }) {
  const { funds } = useStore();
  const { toast } = useToast();
  const [donating, setDonating] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const fund = funds.find((f) => f.id === fundId);

  useEffect(() => {
    const t = window.setTimeout(() => setExpanded(false), 50);
    return () => window.clearTimeout(t);
  }, [fundId]);

  if (!fund) return null;
  const p = pct(fund.raised, fund.goal);
  const urgent = fund.daysLeft <= 7 && !fund.closed;

  const share = async () => {
    await copyText(`Помогите сбору «${fund.title}» — не хватает ${money(Math.max(0, fund.goal - fund.raised))}. lepta.app/f/${fund.id}`);
    toast("Ссылка на сбор скопирована");
  };

  return (
    <div className="animate-fade absolute inset-0 z-40 flex flex-col bg-mist">
      <div className="relative flex-1 overflow-y-auto">
        <div className="relative">
          <CoverImage fund={fund} className="h-56 w-full" />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-mist to-transparent" />
          <div className="absolute left-4 top-4 flex items-center gap-2">
            <button
              onClick={onClose}
              aria-label="Назад"
              className="press grid h-10 w-10 place-items-center rounded-full bg-pine-950/65 text-paper backdrop-blur-sm"
            >
              <IconBack className="h-5 w-5" />
            </button>
          </div>
          <button
            onClick={share}
            aria-label="Поделиться"
            className="press absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-pine-950/65 text-paper backdrop-blur-sm"
          >
            <IconShare className="h-4.5 w-4.5" />
          </button>
          <div className="absolute bottom-3 left-4 flex items-center gap-2">
            <span className="rounded-full bg-pine-900 px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.08em] text-mist">
              {catById(fund.category).label}
            </span>
            {fund.verified && (
              <span className="flex items-center gap-1 rounded-full bg-mint-500 px-2.5 py-1 text-[10.5px] font-bold text-paper">
                <IconVerified className="h-3.5 w-3.5" /> Проверен
              </span>
            )}
            {fund.closed && (
              <span className="rounded-full bg-amber-500 px-2.5 py-1 text-[10.5px] font-bold text-pine-950">
                Сбор завершён
              </span>
            )}
            {urgent && (
              <span className="animate-pop rounded-full bg-amber-500 px-2.5 py-1 font-display text-[10.5px] font-bold text-pine-950">
                {fund.daysLeft} {dayWord(fund.daysLeft)} до финала
              </span>
            )}
          </div>
        </div>

        <div className="-mt-2 px-4">
          <h1 className="font-display text-[20px] font-extrabold leading-snug text-ink">
            {fund.title}
          </h1>

          <div className="mt-3 flex items-center gap-2.5 rounded-2xl border border-line bg-paper p-3 shadow-card">
            <Avatar name={fund.author} size={38} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-bold text-ink">{fund.author}</p>
              <p className="text-[11px] text-ink-soft">сбор начат {timeAgo(fund.createdAt)}</p>
            </div>
            {fund.verified && <IconVerified className="h-5 w-5 shrink-0 text-pine-600" />}
          </div>

          {/* прогресс */}
          <div className="mt-3.5 rounded-[22px] border border-line bg-paper p-4.5 shadow-card">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-[10.5px] font-bold uppercase tracking-[0.1em] text-ink-soft">собрано</p>
                <p className="font-display mt-0.5 text-[24px] font-extrabold leading-none text-coral-600">
                  <CountUp to={fund.raised} format={money} />
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10.5px] font-bold uppercase tracking-[0.1em] text-ink-soft">цель</p>
                <p className="font-display mt-0.5 text-[15px] font-bold text-ink">{money(fund.goal)}</p>
              </div>
            </div>
            <ProgressBar value={p} className="mt-3" tone={fund.closed ? "mint" : "coral"} />
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-mist/80 py-2.5">
                <p className="font-display text-[15px] font-extrabold text-pine-700">{p}%</p>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-soft">от цели</p>
              </div>
              <div className="rounded-xl bg-mist/80 py-2.5">
                <p className="font-display text-[15px] font-extrabold text-pine-700">
                  <CountUp to={fund.donors} format={num} />
                </p>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-soft">
                  {plural(fund.donors, "донор", "донора", "доноров")}
                </p>
              </div>
              <div className="rounded-xl bg-mist/80 py-2.5">
                <p className="font-display text-[15px] font-extrabold text-pine-700">
                  {fund.closed ? "—" : fund.daysLeft}
                </p>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-soft">
                  {fund.closed ? "финал" : dayWord(fund.daysLeft)}
                </p>
              </div>
            </div>
          </div>

          {/* история */}
          <div className="mt-5">
            <h2 className="font-display text-[15px] font-bold text-ink">История</h2>
            <p className={`mt-2 whitespace-pre-line text-[13.5px] leading-relaxed text-ink-soft ${expanded ? "" : "line-clamp-[9]"}`}>
              {fund.story}
            </p>
            <button
              onClick={() => setExpanded(!expanded)}
              className="press mt-1.5 text-[12.5px] font-bold text-pine-700 underline decoration-pine-600/30 underline-offset-4"
            >
              {expanded ? "Свернуть" : "Читать полностью"}
            </button>
          </div>

          {/* обновления */}
          {fund.updates.length > 0 && (
            <div className="mt-6">
              <h2 className="font-display text-[15px] font-bold text-ink">Новости сбора</h2>
              <div className="mt-3 space-y-0">
                {fund.updates.map((u, i) => (
                  <div key={i} className="relative flex gap-3.5 pb-5 last:pb-0">
                    {i < fund.updates.length - 1 && (
                      <span className="absolute left-[13px] top-8 h-[calc(100%-2rem)] w-px bg-line" />
                    )}
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-amber-100 text-amber-500">
                      <IconSpark className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 rounded-2xl border border-line bg-paper p-3.5 shadow-card">
                      <p className="text-[10.5px] font-bold uppercase tracking-wide text-pine-600">{u.date}</p>
                      <p className="mt-1 text-[13px] leading-relaxed text-ink">{u.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 flex items-center gap-2 rounded-2xl bg-pine-50 px-4 py-3 text-[11.5px] font-medium text-pine-700">
            <IconUsers className="h-4.5 w-4.5 shrink-0" />
            Платформа проверяет документы сборов со значком «Проверен». Комиссия 0%.
          </div>
          <div className="h-28" />
        </div>
      </div>

      {/* нижняя панель */}
      <div className="absolute inset-x-0 bottom-0 border-t border-line/70 bg-paper/95 px-4 pb-5 pt-3 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={share}
            aria-label="Поделиться сбором"
            className="press grid h-[52px] w-[52px] shrink-0 place-items-center rounded-2xl border border-line bg-paper text-pine-700"
          >
            <IconShare className="h-5 w-5" />
          </button>
          {fund.closed ? (
            <div className="flex h-[52px] flex-1 items-center justify-center gap-2 rounded-2xl bg-mint-100 font-display text-[13.5px] font-bold text-mint-500">
              <IconCheck className="h-5 w-5" />
              Сбор завершён — спасибо всем!
            </div>
          ) : (
            <button
              onClick={() => setDonating(true)}
              className="press flex h-[52px] flex-1 items-center justify-center gap-2.5 rounded-2xl bg-coral-500 font-display text-[14.5px] font-bold text-paper shadow-[0_16px_34px_-12px_rgba(33,160,56,0.75)] transition-transform hover:scale-[1.01]"
            >
              <IconWallet className="h-5 w-5" />
              Пожертвовать
            </button>
          )}
        </div>
      </div>

      {donating && !fund.closed && (
        <DonateSheet fund={fund} onClose={() => setDonating(false)} />
      )}
    </div>
  );
}
