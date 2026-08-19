import { useStore } from "../lib/store";
import { dayWord, money, num, pct, plural } from "../lib/format";
import { CountUp, CoverImage, ProgressBar, copyText, useToast } from "../components/ui";
import {
  IconArrowR,
  IconCheck,
  IconClock,
  IconPlus,
  IconShare,
  IconUsers,
} from "../components/icons";

export function MyFundsScreen({
  onCreate,
  onOpenFund,
}: {
  onCreate: () => void;
  onOpenFund: (id: string) => void;
}) {
  const { funds, closeFund } = useStore();
  const { toast } = useToast();
  const mine = funds.filter((f) => f.mine);
  const raised = mine.reduce((s, f) => s + f.raised, 0);
  const donors = mine.reduce((s, f) => s + f.donors, 0);
  const active = mine.filter((f) => !f.closed).length;

  const share = async (id: string, title: string) => {
    await copyText(`Помогите, пожалуйста, моему сбору «${title}» в Лепте: lepta.app/f/${id}`);
    toast("Ссылка на сбор скопирована");
  };

  return (
    <div className="px-4 pb-8 pt-5">
      <h1 className="font-display text-[21px] font-extrabold text-ink">Мои сборы</h1>
      <p className="mt-1 text-[13px] text-ink-soft">
        Здесь видно, как люди откликаются на вашу беду — в реальном времени.
      </p>

      {mine.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-2.5">
          <div className="rounded-[18px] bg-pine-900 p-3.5 text-mist shadow-card">
            <p className="font-display text-[16px] font-extrabold text-amber-300">
              <CountUp to={raised} format={money} />
            </p>
            <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-mist/60">
              собрано
            </p>
          </div>
          <div className="rounded-[18px] border border-line bg-paper p-3.5 shadow-card">
            <p className="font-display text-[16px] font-extrabold text-pine-700">
              <CountUp to={donors} format={num} />
            </p>
            <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink-soft">
              {plural(donors, "донор", "донора", "доноров")}
            </p>
          </div>
          <div className="rounded-[18px] border border-line bg-paper p-3.5 shadow-card">
            <p className="font-display text-[16px] font-extrabold text-coral-600">{active}</p>
            <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink-soft">
              активных
            </p>
          </div>
        </div>
      )}

      <div className="mt-4 space-y-3.5">
        {mine.map((f) => {
          const p = pct(f.raised, f.goal);
          return (
            <div
              key={f.id}
              className="overflow-hidden rounded-[22px] border border-line/80 bg-paper shadow-card"
            >
              <button onClick={() => onOpenFund(f.id)} className="press flex w-full gap-3.5 p-3 text-left">
                <div className="relative h-[92px] w-[92px] shrink-0 overflow-hidden rounded-2xl">
                  <CoverImage fund={f} className="h-full w-full" />
                  <span className="absolute bottom-1.5 right-1.5 rounded-md bg-pine-950/75 px-1.5 py-0.5 font-display text-[10px] font-bold text-amber-300">
                    {p}%
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <h3 className="line-clamp-2 text-[14px] font-bold leading-snug text-ink">{f.title}</h3>
                  <div className="mt-auto pt-2">
                    <ProgressBar value={p} thin tone={f.closed ? "mint" : "coral"} />
                    <div className="mt-1.5 flex items-baseline justify-between gap-2">
                      <span className="font-display text-[12.5px] font-bold text-coral-600">
                        <CountUp to={f.raised} format={money} />
                      </span>
                      <span className="text-[11.5px] text-ink-soft">из {money(f.goal)}</span>
                    </div>
                  </div>
                </div>
              </button>
              <div className="flex items-center gap-2 border-t border-line/60 px-3 py-2.5">
                <span className="flex items-center gap-1 text-[11px] font-medium text-ink-soft">
                  <IconUsers className="h-3.5 w-3.5" />
                  {num(f.donors)}
                </span>
                <span className="flex items-center gap-1 text-[11px] font-medium text-ink-soft">
                  <IconClock className="h-3.5 w-3.5" />
                  {f.closed ? "завершён" : `${f.daysLeft} ${dayWord(f.daysLeft)}`}
                </span>
                <div className="ml-auto flex gap-2">
                  <button
                    onClick={() => share(f.id, f.title)}
                    className="press flex items-center gap-1.5 rounded-full bg-mist px-3 py-1.5 text-[11.5px] font-bold text-pine-700"
                  >
                    <IconShare className="h-3.5 w-3.5" />
                    Поделиться
                  </button>
                  {f.closed ? (
                    <span className="flex items-center gap-1 rounded-full bg-mint-100 px-3 py-1.5 text-[11.5px] font-bold text-mint-500">
                      <IconCheck className="h-3.5 w-3.5" />
                      Завершён
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        closeFund(f.id);
                        toast("Сбор завершён. Спасибо всем, кто помог!");
                      }}
                      className="press rounded-full bg-pine-900 px-3 py-1.5 text-[11.5px] font-bold text-mist"
                    >
                      Завершить
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {mine.length === 0 && (
          <div className="animate-fade relative overflow-hidden rounded-[24px] bg-pine-900 p-6 text-center shadow-float">
            <div className="absolute -left-10 -top-12 h-36 w-36 rounded-full bg-pine-700/60" />
            <div className="absolute -bottom-16 -right-8 h-40 w-40 rounded-full bg-coral-500/20" />
            <span className="relative mx-auto grid h-16 w-16 place-items-center rounded-full bg-coral-500/20 text-coral-400">
              <IconPlus className="h-7 w-7" />
            </span>
            <h2 className="font-display relative mt-4 text-[17px] font-bold leading-snug text-paper">
              У вас пока нет сборов
            </h2>
            <p className="relative mx-auto mt-2 max-w-[260px] text-[12.5px] leading-relaxed text-mist/70">
              Если вам или вашим близким нужна помощь — расскажите об этом. Люди готовы поддерживать.
            </p>
            <button
              onClick={onCreate}
              className="press relative mx-auto mt-5 flex items-center gap-2 rounded-full bg-coral-500 px-6 py-3 font-display text-[13px] font-bold text-paper shadow-[0_14px_30px_-10px_rgba(244,81,44,0.6)]"
            >
              Создать первый сбор
              <IconArrowR className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
