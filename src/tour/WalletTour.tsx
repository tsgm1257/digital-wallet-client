import { TourProvider, useTour } from "@reactour/tour";
import { useEffect } from "react";

const steps = [
  { selector: "#nav-menu", content: "Use the navigation to switch sections." },
  {
    selector: "#stats-cards",
    content: "These cards summarize your balance and activity.",
  },
  {
    selector: "#chart-area",
    content: "Charts visualize trends like deposits and sends.",
  },
  {
    selector: "#table-search",
    content: "Filter and search your transactions here.",
  },
  { selector: "#theme-toggle", content: "Toggle between light and dark mode." },
];

function AutoStartOnce({ userKey }: { userKey?: string }) {
  const { setIsOpen } = useTour();
  useEffect(() => {
    const key = `wallet_tour_done_v1${userKey ? `_${userKey}` : ""}`;
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, "1"); // set first to avoid StrictMode double-trigger
      setIsOpen(true);
    }
  }, [setIsOpen, userKey]);
  return null;
}

export default function WalletTourProvider({
  children,
  userKey,
}: {
  children: React.ReactNode;
  userKey?: string; // pass username/id if you want "once per user"
}) {
  return (
    <TourProvider steps={steps} showDots showCloseButton>
      <AutoStartOnce userKey={userKey} />
      {children}
    </TourProvider>
  );
}

export function RestartTourButton() {
  const { setIsOpen, setCurrentStep } = useTour();
  return (
    <button
      className="btn btn-outline"
      onClick={() => {
        setCurrentStep(0);
        setIsOpen(true);
      }}
    >
      Restart Tour
    </button>
  );
}
