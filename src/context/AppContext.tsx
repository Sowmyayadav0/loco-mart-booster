import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ServiceHub = "food" | "shop" | "ride" | "courier" | "services";

export interface HomeRouteTarget {
  to: string;
  params?: Record<string, string>;
  pathname: string;
}

interface AppState {
  theme: "light" | "dark";
  toggleTheme: () => void;
  storeOnline: boolean;
  toggleStore: () => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
  activeHub: ServiceHub;
  setActiveHub: (hub: ServiceHub) => void;
  getHomeRoute: () => HomeRouteTarget;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [storeOnline, setStoreOnline] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeHub, setActiveHubState] = useState<ServiceHub>("food");

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("locomart-theme");
    if (storedTheme === "dark" || storedTheme === "light") setTheme(storedTheme);

    const storedHub = window.localStorage.getItem("locomart-active-hub");
    if (storedHub && ["food", "shop", "ride", "courier", "services"].includes(storedHub)) {
      setActiveHubState(storedHub as ServiceHub);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem("locomart-theme", theme);
  }, [theme]);

  const setActiveHub = useCallback((hub: ServiceHub) => {
    setActiveHubState(hub);
    window.localStorage.setItem("locomart-active-hub", hub);
  }, []);

  const toggleTheme = useCallback(() => setTheme((t) => (t === "dark" ? "light" : "dark")), []);
  const toggleStore = useCallback(() => setStoreOnline((s) => !s), []);
  const toggleSidebar = useCallback(() => setSidebarCollapsed((s) => !s), []);

  const getHomeRoute = useCallback((): HomeRouteTarget => {
    if (activeHub === "shop") {
      return { to: "/category/$slug", params: { slug: "shop" }, pathname: "/category/shop" };
    }
    if (activeHub === "ride") {
      return { to: "/rides", pathname: "/rides" };
    }
    if (activeHub === "courier") {
      return { to: "/courier", pathname: "/courier" };
    }
    if (activeHub === "services") {
      return { to: "/services", pathname: "/services" };
    }
    return { to: "/", pathname: "/" };
  }, [activeHub]);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
      storeOnline,
      toggleStore,
      sidebarCollapsed,
      toggleSidebar,
      mobileNavOpen,
      setMobileNavOpen,
      activeHub,
      setActiveHub,
      getHomeRoute,
    }),
    [
      theme,
      toggleTheme,
      storeOnline,
      toggleStore,
      sidebarCollapsed,
      toggleSidebar,
      mobileNavOpen,
      activeHub,
      setActiveHub,
      getHomeRoute,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
