import { useState } from "react";
import { motion } from "framer-motion";
import { X, Download, ExternalLink } from "lucide-react";
import { formatIndian } from "../lib/hindi-number-parser";

interface UpiApp {
  name: string;
  icon: string;
  color: string;
  /** Android intent scheme or UPI-specific deep link prefix */
  deepLinkPrefix: string;
  /** Play Store / App Store fallback URL */
  playStoreUrl: string;
  appStoreUrl: string;
}

const UPI_APPS: UpiApp[] = [
  {
    name: "Google Pay",
    icon: "G",
    color: "oklch(0.6 0.2 145)",
    deepLinkPrefix: "tez://upi/pay",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.google.android.apps.nbu.paisa.user",
    appStoreUrl: "https://apps.apple.com/in/app/google-pay/id1193357041",
  },
  {
    name: "PhonePe",
    icon: "P",
    color: "oklch(0.5 0.2 280)",
    deepLinkPrefix: "phonepe://pay",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.phonepe.app",
    appStoreUrl: "https://apps.apple.com/in/app/phonepe-upi-payments-recharge/id1170055821",
  },
  {
    name: "Paytm",
    icon: "₱",
    color: "oklch(0.55 0.2 200)",
    deepLinkPrefix: "paytmmp://pay",
    playStoreUrl: "https://play.google.com/store/apps/details?id=net.one97.paytm",
    appStoreUrl: "https://apps.apple.com/in/app/paytm-payments-bank/id473941634",
  },
  {
    name: "BHIM",
    icon: "B",
    color: "oklch(0.55 0.18 30)",
    deepLinkPrefix: "upi://pay",
    playStoreUrl: "https://play.google.com/store/apps/details?id=in.org.npci.upiapp",
    appStoreUrl: "https://apps.apple.com/in/app/bhim-making-india-cashless/id1200315258",
  },
  {
    name: "Amazon Pay",
    icon: "A",
    color: "oklch(0.6 0.16 80)",
    deepLinkPrefix: "amazonpay://pay",
    playStoreUrl: "https://play.google.com/store/apps/details?id=in.amazon.mShop.android.shopping",
    appStoreUrl: "https://apps.apple.com/in/app/amazon-shopping/id409965355",
  },
  {
    name: "YONO SBI",
    icon: "Y",
    color: "oklch(0.5 0.18 240)",
    deepLinkPrefix: "upi://pay",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.sbi.lotusintouch",
    appStoreUrl: "https://apps.apple.com/in/app/yono-sbi-banking-lifestyle/id1aborné364157",
  },
];

function getStoreUrl(app: UpiApp): string {
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes("iphone") || ua.includes("ipad") || ua.includes("mac")) {
    return app.appStoreUrl;
  }
  return app.playStoreUrl;
}

interface AppPickerProps {
  amount: number;
  payeeName: string;
  payeeVpa: string;
  onSelectApp: (app: string) => void;
  onClose: () => void;
}

export function AppPicker({ amount, payeeName, payeeVpa, onSelectApp, onClose }: AppPickerProps) {
  const [launching, setLaunching] = useState<string | null>(null);

  const handleAppClick = (app: UpiApp) => {
    setLaunching(app.name);

    // Build UPI payment params
    const params = new URLSearchParams({
      pa: payeeVpa,
      pn: payeeName,
      am: amount.toString(),
      cu: "INR",
      tn: "UPI Translator",
    });

    // Try app-specific deep link first, fall back to generic upi:// scheme
    const appDeepLink = `${app.deepLinkPrefix}?${params.toString()}`;
    const genericDeepLink = `upi://pay?${params.toString()}`;

    // Create a hidden iframe to try the deep link (works on mobile browsers)
    // If the app is installed, it will open. If not, nothing happens and we fall back.
    const startTime = Date.now();

    // Try opening via window.location (most reliable on mobile)
    window.location.href = appDeepLink;

    // After a short delay, check if we're still on the page
    // If we are, the app wasn't installed — redirect to store
    setTimeout(() => {
      // If less than 2s passed and page is still visible, app likely not installed
      if (Date.now() - startTime < 3000 && !document.hidden) {
        // Try generic UPI scheme as second attempt
        if (appDeepLink !== genericDeepLink) {
          window.location.href = genericDeepLink;

          // Final fallback — if still here after another delay, go to store
          setTimeout(() => {
            if (!document.hidden) {
              window.open(getStoreUrl(app), "_blank");
              setLaunching(null);
            } else {
              onSelectApp(app.name);
            }
          }, 1500);
        } else {
          // Already tried generic, go to store
          window.open(getStoreUrl(app), "_blank");
          setLaunching(null);
        }
      } else {
        // App opened successfully
        onSelectApp(app.name);
      }
    }, 1500);

    // Listen for visibility change — if app opened, page becomes hidden
    const handleVisibility = () => {
      if (document.hidden) {
        onSelectApp(app.name);
        document.removeEventListener("visibilitychange", handleVisibility);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    // Cleanup listener after 5 seconds
    setTimeout(() => {
      document.removeEventListener("visibilitychange", handleVisibility);
    }, 5000);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-full max-w-md bg-card rounded-t-3xl p-6 pb-10"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25 }}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-display font-bold text-lg text-card-foreground">Choose UPI App</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <p className="text-sm text-muted-foreground mb-6">
          Pay {formatIndian(amount)} to {payeeName}
        </p>

        {/* App grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {UPI_APPS.map((app, i) => (
            <motion.button
              key={app.name}
              onClick={() => handleAppClick(app)}
              disabled={launching !== null}
              className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-secondary transition-colors disabled:opacity-50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold text-primary-foreground relative"
                style={{ backgroundColor: app.color }}
              >
                {launching === app.name ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  app.icon
                )}
              </div>
              <span className="text-xs font-medium text-card-foreground text-center leading-tight">
                {launching === app.name ? "Opening..." : app.name}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Hint */}
        <div className="text-center space-y-2">
          <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
            <ExternalLink className="w-3 h-3" />
            App not installed? You&apos;ll be redirected to install it
          </p>
          <button
            onClick={() => window.open("https://play.google.com/store/apps/details?id=in.org.npci.upiapp", "_blank")}
            className="text-sm text-primary flex items-center justify-center gap-1 mx-auto"
          >
            <Download className="w-3.5 h-3.5" />
            Don&apos;t have a UPI app? Install BHIM
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
