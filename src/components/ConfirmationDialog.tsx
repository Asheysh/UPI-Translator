import { motion } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import { formatIndian } from "../lib/hindi-number-parser";

interface ConfirmationDialogProps {
  amount: number;
  inputText: string;
  payeeName: string;
  payeeVpa: string;
  corrected: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmationDialog({
  amount, inputText, payeeName, payeeVpa, corrected, onConfirm, onCancel
}: ConfirmationDialogProps) {
  const isHighAmount = amount > 10000;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-full max-w-md bg-card rounded-t-3xl p-6 pb-10 space-y-5"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25 }}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-lg text-card-foreground">Confirm Payment</h3>
          <button onClick={onCancel} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Amount display */}
        <div className="text-center py-4">
          <p className="amount-display text-4xl text-card-foreground">{formatIndian(amount)}</p>
          <p className="text-sm text-muted-foreground mt-1">You typed: "{inputText}"</p>
        </div>

        {/* Payee info */}
        <div className="bg-secondary rounded-2xl p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Paying to</span>
            <span className="font-semibold text-card-foreground">{payeeName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">UPI ID</span>
            <span className="font-mono text-card-foreground">{payeeVpa.slice(0,3)}***@{payeeVpa.split("@")[1]}</span>
          </div>
        </div>

        {/* Warnings */}
        {corrected && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-warning/10">
            <AlertTriangle className="w-4 h-4 text-warning mt-0.5 shrink-0" />
            <p className="text-sm text-warning-foreground">We interpreted your input as {formatIndian(amount)} — please verify.</p>
          </div>
        )}

        {isHighAmount && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-destructive/10">
            <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
            <p className="text-sm text-destructive">High amount — please confirm you want to pay {formatIndian(amount)}.</p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 h-14 rounded-2xl bg-secondary text-secondary-foreground font-semibold">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 pay-button rounded-2xl">
            Confirm
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
