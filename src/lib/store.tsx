import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from "react";
import {
  SEED_FUNDS,
  TICKER_NAMES,
  TICKER_AMOUNTS,
  type Fund,
  type Donation,
  type Mode,
  type TickerEvent,
} from "./data";

const LS_KEY = "lepta:state:v1";

interface State {
  funds: Fund[];
  donations: Donation[];
  mode: Mode;
  ticker: TickerEvent[];
}

type Action =
  | { type: "DONATE"; fundId: string; amount: number; method: string; anonymous: boolean }
  | { type: "INCOMING"; fundId: string; amount: number; name: string }
  | { type: "ADD_FUND"; fund: Fund }
  | { type: "CLOSE_FUND"; fundId: string }
  | { type: "SET_MODE"; mode: Mode };

let eventId = 100;

function pushTicker(ticker: TickerEvent[], ev: TickerEvent) {
  return [ev, ...ticker].slice(0, 8);
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "DONATE": {
      const fund = state.funds.find((f) => f.id === action.fundId);
      if (!fund) return state;
      const donation: Donation = {
        id: `d${Date.now()}`,
        fundId: fund.id,
        fundTitle: fund.title,
        amount: action.amount,
        date: Date.now(),
        method: action.method,
        anonymous: action.anonymous,
      };
      return {
        ...state,
        funds: state.funds.map((f) =>
          f.id === fund.id
            ? { ...f, raised: f.raised + action.amount, donors: f.donors + (action.anonymous ? 0 : 1) }
            : f
        ),
        donations: [donation, ...state.donations],
        ticker: pushTicker(state.ticker, {
          id: ++eventId,
          name: action.anonymous ? "Добрый человек" : "Вы",
          amount: action.amount,
          fundTitle: fund.title,
          own: true,
        }),
      };
    }
    case "INCOMING": {
      const fund = state.funds.find((f) => f.id === action.fundId);
      if (!fund || fund.closed) return state;
      return {
        ...state,
        funds: state.funds.map((f) =>
          f.id === fund.id
            ? { ...f, raised: f.raised + action.amount, donors: f.donors + 1 }
            : f
        ),
        ticker: pushTicker(state.ticker, {
          id: ++eventId,
          name: action.name,
          amount: action.amount,
          fundTitle: fund.title,
        }),
      };
    }
    case "ADD_FUND":
      return { ...state, funds: [action.fund, ...state.funds] };
    case "CLOSE_FUND":
      return {
        ...state,
        funds: state.funds.map((f) => (f.id === action.fundId ? { ...f, closed: true } : f)),
      };
    case "SET_MODE":
      return { ...state, mode: action.mode };
    default:
      return state;
  }
}

function init(): State {
  const base: State = {
    funds: SEED_FUNDS,
    donations: [],
    mode: "donor",
    ticker: [
      { id: 1, name: "Мария", amount: 500, fundTitle: SEED_FUNDS[5].title },
      { id: 2, name: "Павел", amount: 1000, fundTitle: SEED_FUNDS[4].title },
      { id: 3, name: "Анна", amount: 300, fundTitle: SEED_FUNDS[1].title },
    ],
  };
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const saved = JSON.parse(raw) as Partial<State>;
      if (Array.isArray(saved.funds) && saved.funds.length) {
        return {
          funds: saved.funds,
          donations: saved.donations ?? [],
          mode: saved.mode === "collector" ? "collector" : "donor",
          ticker: base.ticker,
        };
      }
    }
  } catch {
    /* повреждённое хранилище — начинаем с демо-данных */
  }
  return base;
}

interface Ctx extends State {
  donate: (fundId: string, amount: number, method: string, anonymous: boolean) => void;
  addFund: (fund: Fund) => void;
  closeFund: (fundId: string) => void;
  setMode: (mode: Mode) => void;
}

const StoreCtx = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, init);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    const { funds, donations, mode } = state;
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({ funds, donations, mode }));
    } catch {
      /* приватный режим — работаем без сохранения */
    }
  }, [state]);

  /* Живая лента: другие люди тоже жертвуют */
  useEffect(() => {
    const tick = () => {
      const s = stateRef.current;
      const open = s.funds.filter((f) => !f.closed);
      if (!open.length) return;
      const fund = open[Math.floor(Math.random() * open.length)];
      const name = TICKER_NAMES[Math.floor(Math.random() * TICKER_NAMES.length)];
      const amount = TICKER_AMOUNTS[Math.floor(Math.random() * TICKER_AMOUNTS.length)];
      dispatch({ type: "INCOMING", fundId: fund.id, amount, name });
    };
    const id = window.setInterval(tick, 9000);
    return () => window.clearInterval(id);
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      ...state,
      donate: (fundId, amount, method, anonymous) =>
        dispatch({ type: "DONATE", fundId, amount, method, anonymous }),
      addFund: (fund) => dispatch({ type: "ADD_FUND", fund }),
      closeFund: (fundId) => dispatch({ type: "CLOSE_FUND", fundId }),
      setMode: (mode) => dispatch({ type: "SET_MODE", mode }),
    }),
    [state]
  );

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error("useStore вне StoreProvider");
  return ctx;
}
