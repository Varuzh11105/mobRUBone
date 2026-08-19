import { useState, type ComponentType, type SVGProps } from "react";
import { StoreProvider, useStore } from "./lib/store";
import { ToastProvider } from "./components/ui";
import type { Mode } from "./lib/data";
import { FeedScreen } from "./screens/Feed";
import { FundDetailScreen } from "./screens/FundDetail";
import { CreateFundScreen } from "./screens/CreateFund";
import { MyFundsScreen } from "./screens/MyFunds";
import { AboutScreen, HistoryScreen } from "./screens/HistoryAbout";
import {
  IconFeed,
  IconHistory,
  IconPlus,
  IconShield,
  IconTarget,
  LogoMark,
} from "./components/icons";

type Screen = "feed" | "history" | "my" | "about";

function Tab({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`press flex flex-col items-center gap-1 py-1 transition-colors ${
        active ? "text-pine-700" : "text-ink-soft/55 hover:text-ink-soft"
      }`}
    >
      <span className={`relative grid h-7 w-12 place-items-center rounded-full transition-colors duration-300 ${active ? "bg-pine-100" : ""}`}>
        <Icon className="h-[21px] w-[21px]" />
      </span>
      <span className={`text-[9.5px] font-bold tracking-wide ${active ? "" : "font-semibold"}`}>{label}</span>
    </button>
  );
}

function ModeSwitch() {
  const { mode, setMode } = useStore();
  const opts: { id: Mode; label: string }[] = [
    { id: "donor", label: "Жертвую" },
    { id: "collector", label: "Собираю" },
  ];
  return (
    <div className="relative grid shrink-0 grid-cols-2 rounded-full bg-mist p-1">
      <span
        className={`absolute bottom-1 top-1 w-[calc(50%-4px)] rounded-full bg-pine-900 shadow-card transition-all duration-300 ease-out ${
          mode === "donor" ? "left-1" : "left-[calc(50%+3px)]"
        }`}
      />
      {opts.map((o) => (
        <button
          key={o.id}
          onClick={() => setMode(o.id)}
          className={`relative z-10 rounded-full px-3 py-1.5 text-[11px] font-bold transition-colors duration-300 ${
            mode === o.id ? "text-amber-300" : "text-ink-soft"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function AppShell() {
  const { setMode } = useStore();
  const [screen, setScreen] = useState<Screen>("feed");
  const [openFund, setOpenFund] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const openCreate = () => {
    setMode("collector");
    setCreateOpen(true);
  };

  return (
    <div className="relative flex h-full flex-col bg-mist">
      {/* шапка */}
      <header className="z-20 flex shrink-0 items-center justify-between gap-2 border-b border-line/70 bg-paper px-4 py-3">
        <button onClick={() => setScreen("feed")} className="press flex items-center gap-2.5 text-left">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-pine-900 text-coral-400 shadow-card">
            <LogoMark className="h-6 w-6" />
          </span>
          <span>
            <span className="font-display block text-[15px] font-extrabold leading-none text-ink">
              Лепта
            </span>
            <span className="mt-1 block text-[8.5px] font-bold uppercase tracking-[0.16em] text-ink-soft/65">
              народные сборы
            </span>
          </span>
        </button>
        <ModeSwitch />
      </header>

      {/* контент */}
      <main key={screen} className="animate-fade min-h-0 flex-1 overflow-y-auto">
        {screen === "feed" && (
          <FeedScreen onOpenFund={setOpenFund} onCreate={openCreate} />
        )}
        {screen === "history" && <HistoryScreen onGoFeed={() => setScreen("feed")} />}
        {screen === "my" && (
          <MyFundsScreen onCreate={openCreate} onOpenFund={setOpenFund} />
        )}
        {screen === "about" && <AboutScreen />}
      </main>

      {/* нижняя навигация */}
      <nav className="z-20 shrink-0 border-t border-line/70 bg-paper px-2 pb-[max(0.6rem,env(safe-area-inset-bottom))] pt-1.5">
        <div className="grid grid-cols-5 items-end">
          <Tab icon={IconFeed} label="Сборы" active={screen === "feed"} onClick={() => setScreen("feed")} />
          <Tab icon={IconHistory} label="Помощь" active={screen === "history"} onClick={() => setScreen("history")} />
          <div className="relative -mt-8 flex justify-center">
            <span className="animate-pulse-ring absolute top-1 h-14 w-14 rounded-full bg-coral-500/70" />
            <button
              onClick={openCreate}
              aria-label="Создать сбор"
              className="press relative z-10 grid h-14 w-14 place-items-center rounded-full bg-coral-500 text-paper shadow-[0_18px_36px_-12px_rgba(244,81,44,0.8)]"
            >
              <IconPlus className="h-6 w-6" />
            </button>
          </div>
          <Tab icon={IconTarget} label="Мои сборы" active={screen === "my"} onClick={() => setScreen("my")} />
          <Tab icon={IconShield} label="О сервисе" active={screen === "about"} onClick={() => setScreen("about")} />
        </div>
      </nav>

      {/* оверлеи */}
      {openFund && (
        <FundDetailScreen fundId={openFund} onClose={() => setOpenFund(null)} />
      )}
      {createOpen && (
        <CreateFundScreen
          onClose={() => setCreateOpen(false)}
          onCreated={() => {
            setCreateOpen(false);
            setScreen("my");
          }}
        />
      )}
    </div>
  );
}

function Ambience() {
  return (
    <>
      <div className="animate-drift pointer-events-none absolute -left-28 -top-32 h-[26rem] w-[26rem] rounded-full bg-coral-500/[0.16] blur-3xl" />
      <div className="animate-drift-slow pointer-events-none absolute -bottom-40 -right-24 h-[30rem] w-[30rem] rounded-full bg-amber-500/[0.12] blur-3xl" />
      <div className="animate-drift pointer-events-none absolute left-1/3 top-1/2 h-[20rem] w-[20rem] rounded-full bg-pine-600/30 blur-3xl" style={{ animationDelay: "-7s" }} />
      <p
        aria-hidden
        className="font-display text-outline pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap text-[17vw] font-black tracking-tight md:block"
      >
        ЛЕПТА
      </p>
      <div className="pointer-events-none absolute bottom-12 left-12 hidden max-w-[250px] lg:block">
        <p className="font-display text-[16px] font-bold leading-snug text-mist/85">
          Каждому — по беде,
          <br />
          от каждого — <span className="text-coral-400">по лепте.</span>
        </p>
        <p className="mt-3.5 text-[11px] font-medium leading-relaxed text-mist/40">
          Демо-приложение. Платежи не списываются, данные живут в вашем браузере.
        </p>
      </div>
      <div className="pointer-events-none absolute right-12 top-1/2 hidden -translate-y-1/2 space-y-5 text-right lg:block">
        {["0% комиссии — всё доходит адресату", "Сборы проверяются по документам", "Помощь видна в реальном времени"].map((t, i) => (
          <p key={t} className="text-[11.5px] font-semibold text-mist/50" style={{ opacity: 1 - i * 0.18 }}>
            {t}
          </p>
        ))}
      </div>
    </>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <div className="grain relative h-[100dvh] overflow-hidden bg-pine-900">
        <Ambience />
        <div className="relative z-10 flex h-full items-stretch justify-center md:items-center md:py-7">
          <div className="relative h-full w-full overflow-hidden bg-mist md:h-[min(870px,94%)] md:w-[400px] md:shrink-0 md:rounded-[42px] md:border-[10px] md:border-pine-950 md:shadow-float md:ring-1 md:ring-white/10">
            <ToastProvider>
              <AppShell />
            </ToastProvider>
          </div>
        </div>
      </div>
    </StoreProvider>
  );
}
