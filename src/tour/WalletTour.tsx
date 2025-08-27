// src/tour/WalletTour.tsx
import { TourProvider, useTour } from "@reactour/tour";
import type { StepType } from "@reactour/tour";
import { ReactNode, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth"; // named import

const ROUTES = {
  userDashboard: "/dashboard/user",
  agentDashboard: "/dashboard/agent",
  adminDashboard: "/dashboard/admin",
  settings: "/settings",
};

type Role = "user" | "agent" | "admin";

function waitForElem(
  selector: string,
  {
    timeoutMs = 8000,
    pollMs = 80,
  }: { timeoutMs?: number; pollMs?: number } = {}
): Promise<HTMLElement | null> {
  const started = performance.now();
  return new Promise((resolve) => {
    const poll = () => {
      const el = document.querySelector(selector) as HTMLElement | null;
      if (el) return resolve(el);
      if (performance.now() - started >= timeoutMs) return resolve(null);
      setTimeout(poll, pollMs);
    };
    poll();
  });
}

function scrollIntoCenter(el: HTMLElement | null) {
  if (!el) return;
  try {
    el.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
  } catch {
    el.scrollIntoView();
  }
}

type NavStep = StepType & {
  route?: string;
  key?: string;
  afterRouteDelayMs?: number;
};

function buildStepsForRole(role: Role): NavStep[] {
  if (role === "agent") {
    return [
      {
        key: "welcome",
        content: "Welcome Agent! Let’s tour your dashboard.",
        route: ROUTES.agentDashboard,
      },
      {
        key: "balance",
        selector: '[data-tour="balance-card-agent"]',
        route: ROUTES.agentDashboard,
        content: "Your float & quick actions.",
      },
      {
        key: "process",
        selector: '[data-tour="process-cashout-form"]',
        route: ROUTES.agentDashboard,
        content: "Process cash-in / cash-out here.",
      },
      {
        key: "charts",
        selector: '[data-tour="charts-agent"]',
        route: ROUTES.agentDashboard,
        content: "Your activity charts.",
      },
      {
        key: "recent",
        selector: '[data-tour="recent-tx-table-agent"]',
        route: ROUTES.agentDashboard,
        content: "Handled transactions.",
      },
      {
        key: "settings",
        selector: '[data-tour="settings-link"]',
        route: ROUTES.settings,
        afterRouteDelayMs: 250,
        content: "Profile & security settings.",
      },
      { key: "done", content: "All set! You’re ready to work efficiently." },
    ];
  }
  if (role === "admin") {
    return [
      {
        key: "welcome",
        content: "Welcome Admin! Quick tour.",
        route: ROUTES.adminDashboard,
      },
      {
        key: "balance",
        selector: '[data-tour="balance-card-admin"]',
        route: ROUTES.adminDashboard,
        content: "KPIs & snapshots.",
      },
      {
        key: "manage-users",
        selector: '[data-tour="manage-users-table"]',
        route: ROUTES.adminDashboard,
        content: "Manage users here.",
      },
      {
        key: "approve-agents",
        selector: '[data-tour="approve-agents-table"]',
        route: ROUTES.adminDashboard,
        content: "Approve/suspend agents.",
      },
      {
        key: "charts",
        selector: '[data-tour="charts-admin"]',
        route: ROUTES.adminDashboard,
        content: "Analytics & trends.",
      },
      {
        key: "settings",
        selector: '[data-tour="settings-link"]',
        route: ROUTES.settings,
        afterRouteDelayMs: 250,
        content: "Platform settings.",
      },
      { key: "done", content: "You’re set to administer the platform." },
    ];
  }
  // user
  return [
    {
      key: "welcome",
      content: "Welcome! Let’s tour your wallet.",
      route: ROUTES.userDashboard,
    },
    {
      key: "balance",
      selector: '[data-tour="balance-card"]',
      route: ROUTES.userDashboard,
      content: "Your balance & stats.",
    },
    {
      key: "send-money",
      selector: '[data-tour="send-money-form"]',
      route: ROUTES.userDashboard,
      content: "Send money quickly.",
    },
    {
      key: "add-money",
      selector: '[data-tour="add-money-form"]',
      route: ROUTES.userDashboard,
      content: "Deposit / withdraw.",
    },
    {
      key: "charts",
      selector: '[data-tour="charts"]',
      route: ROUTES.userDashboard,
      content: "Activity charts.",
    },
    {
      key: "recent",
      selector: '[data-tour="recent-tx-table"]',
      route: ROUTES.userDashboard,
      content: "Recent transactions.",
    },
    {
      key: "settings",
      selector: '[data-tour="settings-link"]',
      route: ROUTES.settings,
      afterRouteDelayMs: 250,
      content: "Manage profile & security.",
    },
    { key: "done", content: "Tour complete — enjoy your wallet!" },
  ];
}

/** Inside <Router/>. Builds steps, injects them, and opens only after steps are set. */
export function WalletTourSync() {
  const auth = useAuth() as any;
  const role: Role =
    (auth?.user?.role as Role) || (auth?.role as Role) || "user";
  const steps = useMemo<NavStep[]>(() => buildStepsForRole(role), [role]);

  const navigate = useNavigate();
  const location = useLocation();
  const {
    isOpen,
    currentStep,
    setSteps,
    setIsOpen,
    setCurrentStep,
    steps: ctxSteps,
  } = useTour();

  // Keep provider's steps in sync with role
  useEffect(() => {
    setSteps(steps);
  }, [steps, setSteps]);

  // Route & focus on each step
  useEffect(() => {
    if (!isOpen || currentStep == null) return;
    const step = steps[currentStep];
    if (!step) return;

    let cancelled = false;
    (async () => {
      if (step.route && location.pathname !== step.route) {
        navigate(step.route);
        if (step.afterRouteDelayMs) {
          await new Promise((r) => setTimeout(r, step.afterRouteDelayMs));
        }
      }
      if (step.selector) {
        const el = await waitForElem(step.selector, { timeoutMs: 8000 });
        if (!cancelled) scrollIntoCenter(el);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isOpen, currentStep, location.pathname, navigate, steps]);

  // Start button colocated with steps
  return (
    <button
      type="button"
      className="fixed bottom-5 right-5 btn btn-primary shadow-lg z-[99999]"
      onClick={() => {
        setSteps(steps);
        if (!ctxSteps || ctxSteps.length <= 1) {
          queueMicrotask(() => {
            setCurrentStep(0);
            setIsOpen(true);
          });
        } else {
          setCurrentStep(0);
          setIsOpen(true);
        }
      }}
      aria-label="Start tour"
    >
      Start Tour
    </button>
  );
}

/** Named export kept for Settings.tsx compatibility */
export function RestartTourButton({ className = "" }: { className?: string }) {
  const { setIsOpen, setCurrentStep } = useTour();
  return (
    <button
      type="button"
      className={`btn btn-outline ${className}`}
      onClick={() => {
        setCurrentStep(0);
        setIsOpen(true);
      }}
    >
      Restart Tour
    </button>
  );
}

/** Provider shell (no start button here) */
export default function WalletTourProvider({
  children,
}: {
  children: ReactNode;
}) {
  const defaultSteps: StepType[] = [{ content: "Loading tour…" }];
  return (
    <TourProvider
      steps={defaultSteps}
      padding={8}
      scrollSmooth
      disableInteraction={false}
      onClickMask={({ setIsOpen }) => setIsOpen(false)}
      showBadge
      showDots
      showNavigation
      showCloseButton
      highlightedMaskClassName="rounded-2xl"
      className="z-[99998]"
    >
      {children}
    </TourProvider>
  );
}
