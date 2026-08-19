import { useState } from "react";
import { useStore } from "../lib/store";
import { CATEGORIES, catById, type CategoryId, type Fund } from "../lib/data";
import { money } from "../lib/format";
import { Chip, formatMoneyInput, useToast } from "../components/ui";
import { FundRow } from "./Feed";
import {
  CATEGORY_ICONS,
  IconArrowR,
  IconBack,
  IconCheck,
  IconClose,
  IconSpark,
} from "../components/icons";

const STEPS = ["Категория", "История", "Сумма", "Проверка"];

export function CreateFundScreen({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (id: string) => void;
}) {
  const { addFund, setMode } = useStore();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState<CategoryId | null>(null);
  const [title, setTitle] = useState("");
  const [about, setAbout] = useState("");
  const [story, setStory] = useState("");
  const [author, setAuthor] = useState("");
  const [goal, setGoal] = useState("");
  const [days, setDays] = useState(30);
  const [err, setErr] = useState("");

  const goalNum = Number(goal.replace(/\D/g, "") || 0);

  const validate = (s: number) => {
    if (s === 0 && !category) return "Выберите категорию — так сбор быстрее найдут";
    if (s === 1) {
      if (title.trim().length < 8) return "Заголовок слишком короткий — минимум 8 символов";
      if (author.trim().length < 2) return "Укажите, от чьего имени сбор";
      if (story.trim().length < 40) return "Расскажите подробнее — минимум 40 символов. Люди жертвуют историям";
    }
    if (s === 2 && (goalNum < 1000 || goalNum > 10_000_000))
      return "Укажите цель от 1 000 до 10 000 000 ₽";
    return "";
  };

  const next = () => {
    const e = validate(step);
    if (e) {
      setErr(e);
      return;
    }
    setErr("");
    setStep(step + 1);
  };

  const publish = () => {
    const fund: Fund = {
      id: `u${Date.now()}`,
      title: title.trim(),
      category: category ?? "other",
      author: author.trim(),
      about: about.trim() || story.trim().slice(0, 120) + "…",
      story: story.trim(),
      goal: goalNum,
      raised: 0,
      donors: 0,
      createdAt: Date.now(),
      daysLeft: days,
      verified: false,
      mine: true,
      updates: [
        {
          date: new Date().toLocaleDateString("ru-RU", { day: "numeric", month: "long" }),
          text: "Сбор открыт! Расскажу здесь, как идут дела.",
        },
      ],
    };
    addFund(fund);
    setMode("collector");
    toast("Сбор опубликован — он уже в общей ленте!");
    onCreated(fund.id);
  };

  const previewFund: Fund = {
    id: "preview",
    title: title.trim() || "Заголовок вашего сбора",
    category: category ?? "other",
    author: author.trim() || "Ваше имя",
    about: "",
    story: "",
    goal: goalNum || 100_000,
    raised: 0,
    donors: 0,
    createdAt: Date.now(),
    daysLeft: days,
    verified: false,
    mine: true,
    updates: [],
  };

  const inputCls =
    "w-full rounded-2xl border border-line bg-mist/50 px-4 py-3.5 text-[14px] font-medium text-ink outline-none transition-colors placeholder:text-ink-soft/50 focus:border-pine-600/60";

  return (
    <div className="animate-fade absolute inset-0 z-40 flex flex-col bg-mist">
      {/* шапка */}
      <div className="flex items-center gap-3 border-b border-line/70 bg-paper px-4 py-3.5">
        <button
          onClick={() => (step === 0 ? onClose() : setStep(step - 1))}
          aria-label="Назад"
          className="press grid h-10 w-10 place-items-center rounded-full bg-mist text-ink"
        >
          {step === 0 ? <IconClose className="h-4.5 w-4.5" /> : <IconBack className="h-5 w-5" />}
        </button>
        <div className="flex-1">
          <p className="font-display text-[14px] font-bold text-ink">Новый сбор</p>
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-ink-soft">
            Шаг {step + 1} из 4 · {STEPS[step]}
          </p>
        </div>
        <div className="flex gap-1.5">
          {STEPS.map((s, i) => (
            <span
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i < step ? "w-4 bg-pine-600" : i === step ? "w-7 bg-coral-500" : "w-4 bg-line"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5">
        {step === 0 && (
          <div className="animate-fade">
            <h2 className="font-display text-[19px] font-extrabold leading-snug text-ink">
              Для чего
              <br />
              собираете?
            </h2>
            <p className="mt-1.5 text-[13px] text-ink-soft">
              Категория помогает показать сбор тем, кто готов помочь именно в этой беде.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-2.5">
              {CATEGORIES.map((c, i) => {
                const Icon = CATEGORY_ICONS[c.id];
                const active = category === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setCategory(c.id)}
                    style={{ animationDelay: `${i * 45}ms` }}
                    className={`press animate-pop relative flex flex-col items-start gap-2.5 rounded-[20px] border-2 p-4 text-left transition-colors ${
                      active
                        ? "border-pine-700 bg-pine-900 text-mist shadow-float"
                        : "border-line bg-paper text-ink hover:border-pine-600/40"
                    }`}
                  >
                    <span
                      className={`grid h-10 w-10 place-items-center rounded-xl ${
                        active ? "bg-coral-500 text-paper" : "bg-mist text-pine-700"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-[13px] font-bold leading-tight">{c.label}</span>
                    {active && (
                      <span className="absolute right-3 top-3 grid h-5 w-5 place-items-center rounded-full bg-coral-500 text-paper">
                        <IconCheck className="h-3 w-3" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="animate-fade space-y-4">
            <div>
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.1em] text-ink-soft">
                Заголовок сбора
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value.slice(0, 64))}
                placeholder="Например: «Тёплые окна для бабушки Зины»"
                className={inputCls}
              />
              <p className="mt-1 text-right text-[10.5px] text-ink-soft/60">{title.length}/64</p>
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.1em] text-ink-soft">
                От чьего имени сбор
              </label>
              <input
                value={author}
                onChange={(e) => setAuthor(e.target.value.slice(0, 40))}
                placeholder="Имя или название организации"
                className={inputCls}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.1em] text-ink-soft">
                Короткое описание
              </label>
              <input
                value={about}
                onChange={(e) => setAbout(e.target.value.slice(0, 140))}
                placeholder="Одно-два предложения, которые увидят в ленте"
                className={inputCls}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.1em] text-ink-soft">
                История — почему нужна помощь
              </label>
              <textarea
                value={story}
                onChange={(e) => setStory(e.target.value)}
                rows={7}
                placeholder="Расскажите честно и по-человечески: что случилось, на что пойдут деньги, что уже сделано…"
                className={`${inputCls} resize-none leading-relaxed`}
              />
              <div className="mt-1 flex items-center justify-between">
                <p className={`text-[10.5px] font-semibold ${story.trim().length < 40 ? "text-coral-600" : "text-mint-500"}`}>
                  {story.trim().length < 40 ? `Ещё ${40 - story.trim().length} символов` : "Хорошо, убедительно"}
                </p>
                <p className="text-[10.5px] text-ink-soft/60">{story.length}</p>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade">
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.1em] text-ink-soft">
              Сколько нужно собрать
            </label>
            <label className="flex items-center gap-2 rounded-[20px] border-2 border-line bg-paper px-4 py-4 transition-colors focus-within:border-coral-500">
              <input
                inputMode="numeric"
                value={goal}
                onChange={(e) => setGoal(formatMoneyInput(e.target.value))}
                placeholder="150 000"
                className="font-display w-full bg-transparent text-[22px] font-extrabold text-ink outline-none placeholder:text-ink-soft/40"
              />
              <span className="font-display text-[18px] font-bold text-coral-600">₽</span>
            </label>
            <div className="mt-3 flex flex-wrap gap-2">
              {[50_000, 150_000, 400_000, 1_000_000].map((v) => (
                <Chip key={v} onClick={() => setGoal(formatMoneyInput(String(v)))} active={goalNum === v}>
                  {money(v)}
                </Chip>
              ))}
            </div>

            <label className="mb-1.5 mt-7 block text-[11px] font-bold uppercase tracking-[0.1em] text-ink-soft">
              Сколько дней идёт сбор
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[7, 14, 30, 60].map((d) => (
                <button
                  key={d}
                  onClick={() => setDays(d)}
                  className={`press rounded-2xl border-2 py-3.5 text-center transition-colors ${
                    days === d ? "border-pine-700 bg-pine-900 text-mist" : "border-line bg-paper text-ink"
                  }`}
                >
                  <span className="font-display block text-[17px] font-extrabold">{d}</span>
                  <span className="text-[10px] font-semibold text-current opacity-70">
                    {d === 1 ? "день" : d < 5 ? "дня" : "дней"}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-7 rounded-[20px] bg-pine-900 p-4.5 text-mist">
              <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.1em] text-amber-300">
                <IconSpark className="h-4 w-4" /> Совет
              </p>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-mist/85">
                Сбор с конкретной суммой и понятной целью собирает в среднем втрое больше.
                Напишите, на что пойдёт каждый рубль.
              </p>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade">
            <h2 className="font-display text-[19px] font-extrabold text-ink">Так вас увидят в ленте</h2>
            <p className="mt-1.5 text-[13px] text-ink-soft">
              Проверьте карточку. После публикации её смогут найти все пользователи Лепты.
            </p>
            <div className="mt-4">
              <FundRow fund={previewFund} onOpen={() => {}} />
            </div>
            <dl className="mt-4 space-y-2.5 rounded-[20px] border border-line bg-paper p-4 text-[12.5px]">
              {[
                ["Категория", catById(previewFund.category).label],
                ["Цель", money(previewFund.goal)],
                ["Длительность", `${days} дней`],
                ["Автор", previewFund.author],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between gap-3">
                  <dt className="font-semibold text-ink-soft">{k}</dt>
                  <dd className="text-right font-bold text-ink">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 flex items-start gap-2 text-[11.5px] leading-relaxed text-ink-soft/85">
              <IconSpark className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
              После публикации добавьте документы, подтверждающие беду, — модераторы поставят значок
              «Проверен», и доверие к сбору вырастет.
            </p>
          </div>
        )}
      </div>

      {/* низ */}
      <div className="border-t border-line/70 bg-paper px-4 pb-5 pt-3">
        {err && (
          <p className="animate-ticker mb-2.5 rounded-xl bg-coral-100 px-3.5 py-2.5 text-[12px] font-semibold text-coral-600">
            {err}
          </p>
        )}
        <button
          onClick={step === 3 ? publish : next}
          className="press flex w-full items-center justify-center gap-2 rounded-2xl bg-coral-500 py-4 font-display text-[14.5px] font-bold text-paper shadow-[0_14px_30px_-10px_rgba(244,81,44,0.65)]"
        >
          {step === 3 ? "Опубликовать сбор" : "Дальше"}
          <IconArrowR className="h-4.5 w-4.5" />
        </button>
      </div>
    </div>
  );
}
