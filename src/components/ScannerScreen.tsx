import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Image, Zap, ScanLine, X } from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";

interface PayeeInfo {
  vpa: string;
  name: string;
  amount?: number;
}

interface ScannerScreenProps {
  onScanComplete: (payee: PayeeInfo) => void;
}

function parseUpiUri(uri: string): PayeeInfo | null {
  try {
    const cleaned = uri.replace("upi://pay?", "upi://pay/?").replace("upi://pay//?", "upi://pay/?");
    let params: URLSearchParams;
    try {
      const url = new URL(cleaned);
      params = url.searchParams;
    } catch {
      const qIndex = uri.indexOf("?");
      if (qIndex === -1) return null;
      params = new URLSearchParams(uri.slice(qIndex + 1));
    }

    const vpa = params.get("pa");
    if (!vpa) return null;

    const name = params.get("pn") || vpa.split("@")[0];
    const amStr = params.get("am");
    const amount = amStr ? parseFloat(amStr) : undefined;

    return { vpa, name: decodeURIComponent(name), amount: amount && !isNaN(amount) ? amount : undefined };
  } catch {
    return null;
  }
}

const SCANNER_ID = "qr-reader";
const FILE_SCANNER_ID = "qr-file-reader";

export function ScannerScreen({ onScanComplete }: ScannerScreenProps) {
  const [phase, setPhase] = useState<"idle" | "camera" | "processing" | "detected">("idle");
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const processedRef = useRef(false);

  const handleQrResult = useCallback((decodedText: string) => {
    if (processedRef.current) return;
    processedRef.current = true;

    const payee = parseUpiUri(decodedText);
    if (payee) {
      setPhase("detected");
      // Stop camera first, then navigate
      const scanner = scannerRef.current;
      if (scanner) {
        scanner.stop().catch(() => {});
        scannerRef.current = null;
      }
      setTimeout(() => onScanComplete(payee), 800);
    } else {
      setError("Not a valid UPI QR code. Please scan a UPI payment QR.");
      processedRef.current = false;
    }
  }, [onScanComplete]);

  const startCamera = useCallback(() => {
    setError(null);
    setPhase("camera");
    processedRef.current = false;

    // Small delay to ensure the container div is rendered and visible
    requestAnimationFrame(() => {
      const scanner = new Html5Qrcode(SCANNER_ID);
      scannerRef.current = scanner;

      scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 220, height: 220 },
          aspectRatio: 1,
        },
        (decodedText) => handleQrResult(decodedText),
        () => {} // ignore partial errors
      ).catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : String(err);
        if (msg.includes("Permission") || msg.includes("NotAllowed")) {
          setError("Camera permission denied. Please allow camera access in your browser settings.");
        } else if (msg.includes("NotFound") || msg.includes("Device")) {
          setError("No camera found on this device.");
        } else {
          setError("Could not start camera: " + msg);
        }
        setPhase("idle");
        scannerRef.current = null;
      });
    });
  }, [handleQrResult]);

  const stopCamera = useCallback(() => {
    const scanner = scannerRef.current;
    if (scanner) {
      scanner.stop().then(() => {
        scannerRef.current = null;
        setPhase("idle");
        processedRef.current = false;
      }).catch(() => {
        scannerRef.current = null;
        setPhase("idle");
        processedRef.current = false;
      });
    } else {
      setPhase("idle");
      processedRef.current = false;
    }
  }, []);

  const handleGalleryImport = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileSelected = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setPhase("processing");
    processedRef.current = false;

    const tempScanner = new Html5Qrcode(FILE_SCANNER_ID);
    tempScanner.scanFile(file, true).then((result) => {
      tempScanner.clear();
      handleQrResult(result);
    }).catch(() => {
      tempScanner.clear();
      setError("No QR code found in the selected image. Please try another image.");
      setPhase("idle");
    });

    e.target.value = "";
  }, [handleQrResult]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      const scanner = scannerRef.current;
      if (scanner) {
        scanner.stop().catch(() => {});
      }
    };
  }, []);

  const isCameraActive = phase === "camera";

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-foreground p-6 relative overflow-hidden">
      {/* Header */}
      <div className="w-full flex items-center justify-between z-10 pt-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <ScanLine className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-primary-foreground font-display font-bold text-lg">UPI Translator</span>
        </div>
        <button className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center">
          <Zap className="w-5 h-5 text-primary-foreground" />
        </button>
      </div>

      {/* Scanner viewfinder */}
      <div className="flex-1 flex items-center justify-center w-full max-w-sm my-8">
        <div className="relative w-72 h-72">
          {/* Corner brackets — always on top */}
          <div className="absolute inset-0 z-30 pointer-events-none">
            <div className="absolute top-0 left-0 w-12 h-12 border-t-3 border-l-3 border-primary rounded-tl-xl" />
            <div className="absolute top-0 right-0 w-12 h-12 border-t-3 border-r-3 border-primary rounded-tr-xl" />
            <div className="absolute bottom-0 left-0 w-12 h-12 border-b-3 border-l-3 border-primary rounded-bl-xl" />
            <div className="absolute bottom-0 right-0 w-12 h-12 border-b-3 border-r-3 border-primary rounded-br-xl" />
          </div>

          {/*
            Camera container — ALWAYS rendered so html5-qrcode can mount into it.
            Hidden via opacity + pointer-events when not active, NOT display:none.
          */}
          <div
            id={SCANNER_ID}
            className="absolute inset-0 rounded-xl overflow-hidden"
            style={{
              opacity: isCameraActive ? 1 : 0,
              pointerEvents: isCameraActive ? "auto" : "none",
            }}
          />

          {/* Hidden element for file scanning */}
          <div id={FILE_SCANNER_ID} style={{ display: "none" }} />

          {/* Scanning line overlay */}
          <AnimatePresence>
            {isCameraActive && (
              <motion.div
                className="absolute left-4 right-4 h-0.5 bg-primary z-30 pointer-events-none"
                style={{ boxShadow: "0 0 12px var(--color-primary)" }}
                initial={{ top: "10%" }}
                animate={{ top: ["10%", "85%", "10%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
          </AnimatePresence>

          {/* Success checkmark */}
          <AnimatePresence>
            {phase === "detected" && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center z-40 bg-foreground/60 rounded-xl"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", duration: 0.5 }}
              >
                <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center">
                  <motion.svg
                    width="40" height="40" viewBox="0 0 24 24"
                    fill="none" stroke="white" strokeWidth="3"
                    strokeLinecap="round" strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    <motion.path d="M5 13l4 4L19 7" />
                  </motion.svg>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Idle state placeholder */}
          {phase === "idle" && (
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <Camera className="w-16 h-16 text-primary-foreground" />
            </div>
          )}

          {/* Loading spinner for gallery processing */}
          {phase === "processing" && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelected}
      />

      {/* Bottom section */}
      <div className="w-full max-w-sm space-y-4 pb-6 z-10">
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="p-3 rounded-xl bg-destructive/20 text-destructive-foreground text-sm text-center"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-center text-primary-foreground/60 text-sm">
          {phase === "detected"
            ? "UPI QR Code detected!"
            : isCameraActive
              ? "Point your camera at a UPI QR code"
              : phase === "processing"
                ? "Processing image..."
                : "Scan a QR code or import from gallery"}
        </p>

        {phase === "idle" && (
          <motion.div className="space-y-3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <button onClick={startCamera} className="pay-button w-full rounded-xl flex items-center justify-center gap-2">
              <Camera className="w-5 h-5" />
              Scan QR Code
            </button>
            <button
              onClick={handleGalleryImport}
              className="w-full h-12 rounded-xl bg-primary-foreground/10 text-primary-foreground/70 text-sm font-medium flex items-center justify-center gap-2"
            >
              <Image className="w-4 h-4" />
              Import from Gallery
            </button>
          </motion.div>
        )}

        {isCameraActive && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <button
              onClick={stopCamera}
              className="w-full h-12 rounded-xl bg-destructive/20 text-destructive-foreground text-sm font-semibold flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
