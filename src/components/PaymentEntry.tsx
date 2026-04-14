import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, AlertTriangle, Check, X } from "lucide-react";
import { parseHindiNumber, type ParseResult } from "../lib/hindi-number-parser";

interface PayeeInfo {
  vpa: string;
  name: string;
  amount?: number;
}

interface PaymentEntryProps {
  payee: PayeeInfo;
  onBack: () => void;
  onProceed: (amount: number, inputText: string) => void;
}

function maskVpa(vpa: string): string {
  const [name, bank] = vpa.split("@");
  if (!bank) return vpa;
  return name.slice(0, 3) + "***@" + bank;
}

export function PaymentEntry({ payee, onBack, onProceed }: PaymentEntryProps) {
  const [input, setInput] = useState(payee.amount?.toString() ?? "");
  const [result, setResult] = useState<ParseResult | null>(null);

  const parse = useCallback((text: string) => {
    const parsed = parseHindiNumber(text);
    setResult(parsed);
  }, []);

  useEffect(() => {
    parse(input);
  }, [input, parse]);

  const isValid = result?.valid && result.amount > 0;
  const isHighAmount = result?.valid && result.amount > 10000;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="p-4 flex items-center gap-3">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="flex-1">
          <h2 className="font-display font-bold text-foreground text-lg">Payment</h2>
          <p className="text-sm text-muted-foreground">Enter amount to pay</p>
        </div>
      </div>

      {/* Payee card */}
      <div className="mx-4 p-4 glass-card rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-xl font-bold text-primary">{payee.name[0]}</span>
          </div>
          <div>
            <p className="font-display font-semibold text-foreground">{payee.name}</p>
            <p className="text-sm text-muted-foreground font-mono">{maskVpa(payee.vpa)}</p>
          </div>
        </div>
      </div>

      {/* Amount input */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm space-y-6">
          {/* Live preview */}
          <motion.div
            className="text-center"
            key={result?.formatted}
            initial={{ scale: 0.95, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.15 }}
          >
            <p className={`amount-display text-5xl ${
              !input ? "text-muted-foreground/30" : isValid ? "text-foreground" : "text-warning"
            }`}>
              {!input ? "₹0" : result?.formatted ?? "---"}
            </p>
          </motion.div>

          {/* Input field */}
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. 500, paanch sau, ek hazaar"
              className="w-full h-14 rounded-2xl bg-secondary px-5 text-lg font-body text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
              autoFocus
            />
            {input && (
              <button
                onClick={() => setInput("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-muted flex items-center justify-center"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>

          {/* Correction chips */}
          <AnimatePresence>
            {result?.corrected && result.corrections.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex flex-wrap gap-2"
              >
                {result.corrections.map((c, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-warning/10 text-warning-foreground text-xs font-medium">
                    <Check className="w-3 h-3" />
                    {c}
                  </span>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Status message */}
          {input && !isValid && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-sm text-warning flex items-center justify-center gap-1"
            >
              <AlertTriangle className="w-4 h-4" />
              Could not parse amount
            </motion.p>
          )}

          {/* Quick amount chips */}
          <div className="flex flex-wrap gap-2 justify-center">
            {["100", "500", "paanch sau", "ek hazaar", "do hazaar", "paanch hazaar"].map((amt) => (
              <button
                key={amt}
                onClick={() => setInput(amt)}
                className="px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium hover:bg-primary/10 transition-colors"
              >
                {amt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Pay button */}
      <div className="p-4 pb-8">
        <button
          disabled={!isValid}
          onClick={() => isValid && onProceed(result!.amount, input)}
          className="pay-button w-full rounded-2xl"
        >
          {isValid
            ? isHighAmount
              ? `PAY NOW ${result!.formatted}`
              : `PAY NOW ${result!.formatted}`
            : "Enter amount to proceed"
          }
        </button>
      </div>
    </div>
  );
}
