import { useEffect, useRef, useState } from "react";
import { StoreProvider } from "./lib/store";
import { Landing } from "./screens/Landing";
import { MobileAppPage } from "./mobile/MobileApp";

type Route =
  | { view: "site" }
  | { view: "app"; fundId?: string; create?: boolean };

function parseHash(): Route {
  const h = window.location.hash.replace(/^#\/?/, "");
  if (h === "app") return { view: "app" };
  if (h === "app/new") return { view: "app", create: true };
  if (h.startsWith("app/")) return { view: "app", fundId: h.slice(4) };
  return { view: "site" };
}

/* Роуты вида #/app... — переключение вёрстки;
   якоря вида #how — обычный скролл внутри сайта. */
const isRouteHash = (hash: string) => hash === "" || hash.startsWith("#/");

export default function App() {
  const [route, setRoute] = useState<Route>(parseHash);
  const prevView = useRef(route.view);

  useEffect(() => {
    const onHash = () => {
      const next = parseHash();
      if (isRouteHash(window.location.hash)) {
        setRoute(next);
        if (next.view === "site" && prevView.current === "app") {
          window.scrollTo(0, 0);
        }
        prevView.current = next.view;
      }
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  return (
    <StoreProvider>
      {route.view === "site" ? (
        <Landing />
      ) : (
        <MobileAppPage
          key={route.fundId ?? (route.create ? "new" : "app")}
          initialFundId={route.fundId}
          initialCreate={route.create}
        />
      )}
    </StoreProvider>
  );
}
