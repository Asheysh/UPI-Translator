import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { formatIndian } from "../lib/hindi-number-parser";

interface SuccessScreenProps {
  amount: number;
  payeeName: string;
  appName: string;
  onNewPayment: () => void;
}

export function SuccessScreen({ amount, payeeName, appName, onNewPayment }: SuccessScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-6">
      <motion.div
        className="w-24 h-24 rounded-full bg-primary flex items-center justify-center mb-8"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.1 }}
      >
        <Check className="w-12 h-12 text-primary-foreground" strokeWidth={3} />
      </motion.div>

      <motion.div
        className="text-center space-y-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="font-display font-bold text-2xl text-foreground">Redirected to {appName}</h2>
        <p className="text-muted-foreground">
          {formatIndian(amount)} to {payeeName}
        </p>
        <p className="text-sm text-muted-foreground/70 mt-4">
          Complete the payment in {appName} using your UPI PIN.
        </p>
      </motion.div>

      <motion.button
        onClick={onNewPayment}
        className="mt-12 flex items-center gap-2 px-6 py-3 rounded-2xl bg-secondary text-secondary-foreground font-semibold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        New Payment <ArrowRight className="w-4 h-4" />
      </motion.button>
    </div>
  );
}
