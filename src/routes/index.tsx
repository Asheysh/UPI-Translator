import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ScannerScreen } from "../components/ScannerScreen";
import { PaymentEntry } from "../components/PaymentEntry";
import { ConfirmationDialog } from "../components/ConfirmationDialog";
import { AppPicker } from "../components/AppPicker";
import { SuccessScreen } from "../components/SuccessScreen";
import { parseHindiNumber } from "../lib/hindi-number-parser";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "UPI Translator — Scan. Speak. Pay." },
      { name: "description", content: "Type payment amounts in Hindi, Hinglish, or numerals. Smart parser converts vernacular numbers to ₹ amounts for seamless UPI payments." },
      { property: "og:title", content: "UPI Translator — Scan. Speak. Pay." },
      { property: "og:description", content: "Pay in the language you think. Hindi number parser for UPI payments." },
    ],
  }),
  component: Index,
});

type Screen = "scanner" | "payment" | "success";

interface PayeeInfo {
  vpa: string;
  name: string;
  amount?: number;
}

function Index() {
  const [screen, setScreen] = useState<Screen>("scanner");
  const [payee, setPayee] = useState<PayeeInfo | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showAppPicker, setShowAppPicker] = useState(false);
  const [pendingAmount, setPendingAmount] = useState(0);
  const [pendingInput, setPendingInput] = useState("");
  const [selectedApp, setSelectedApp] = useState("");

  const handleScanComplete = (p: PayeeInfo) => {
    setPayee(p);
    setScreen("payment");
  };

  const handleProceed = (amount: number, inputText: string) => {
    setPendingAmount(amount);
    setPendingInput(inputText);
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    setShowConfirmation(false);
    setShowAppPicker(true);
  };

  const handleSelectApp = (appName: string) => {
    setSelectedApp(appName);
    setShowAppPicker(false);
    setScreen("success");
  };

  const handleNewPayment = () => {
    setScreen("scanner");
    setPayee(null);
    setShowConfirmation(false);
    setShowAppPicker(false);
    setPendingAmount(0);
    setPendingInput("");
    setSelectedApp("");
  };

  const parsed = parseHindiNumber(pendingInput);

  return (
    <div className="max-w-md mx-auto min-h-screen relative">
      {screen === "scanner" && <ScannerScreen onScanComplete={handleScanComplete} />}
      {screen === "payment" && payee && (
        <PaymentEntry payee={payee} onBack={() => setScreen("scanner")} onProceed={handleProceed} />
      )}
      {screen === "success" && payee && (
        <SuccessScreen amount={pendingAmount} payeeName={payee.name} appName={selectedApp} onNewPayment={handleNewPayment} />
      )}

      <AnimatePresence>
        {showConfirmation && payee && (
          <ConfirmationDialog
            amount={pendingAmount}
            inputText={pendingInput}
            payeeName={payee.name}
            payeeVpa={payee.vpa}
            corrected={parsed.corrected}
            onConfirm={handleConfirm}
            onCancel={() => setShowConfirmation(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAppPicker && payee && (
          <AppPicker
            amount={pendingAmount}
            payeeName={payee.name}
            payeeVpa={payee.vpa}
            onSelectApp={handleSelectApp}
            onClose={() => setShowAppPicker(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
