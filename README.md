# UPI Translator (Speak Pay Swift)

A revolutionary mobile-first web application that enables Indian users to enter UPI payment amounts in their native Hindi/Hinglish language instead of English numerals, making digital payments more accessible and inclusive.

## 🎯 Problem Solved

In India, millions of people are comfortable speaking Hindi/Hinglish but struggle with English numerals when making UPI payments. This app bridges that gap by allowing users to input amounts like "do lakh bees hazaar" (₹220,000) instead of "220000".

## ✨ Features

### Core Functionality
- **Hindi Number Parser**: Advanced parsing engine that converts Hindi/Hinglish text to numeric amounts
- **QR Code Scanning**: Integrated camera support for reading UPI payment QR codes
- **Smart Corrections**: Automatic typo detection and correction with fuzzy matching
- **Multi-App Support**: Seamless integration with 6 major UPI apps (Google Pay, PhonePe, Paytm, BHIM, Amazon Pay, YONO SBI)
- **Security Warnings**: Built-in alerts for high-value transactions (₹10k+)

### Technical Features
- **Real-time Parsing**: Live feedback as users type in Hindi
- **Contextual Corrections**: Intelligent suggestions for common typing mistakes
- **Regional Variations**: Support for multiple Hindi dialects and pronunciations
- **Mobile-Optimized**: Touch-friendly interface designed for smartphones
- **Offline-Capable**: Core parsing works without internet connection

## 🛠️ Technology Stack

| Component | Technology |
|-----------|------------|
| **Frontend** | React 19 + TypeScript |
| **Routing** | TanStack Router |
| **State Management** | TanStack React Query |
| **Styling** | Tailwind CSS 4 + Framer Motion |
| **UI Components** | Radix UI (shadcn/ui) |
| **Build Tool** | Vite |
| **Deployment** | Cloudflare Workers |
| **QR Scanning** | html5-qrcode |
| **Forms** | React Hook Form + Zod |

## 🚀 Installation

### Prerequisites
- **Bun** runtime (recommended) or Node.js 18+
- Modern web browser with camera support

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/speak-pay-swift.git
   cd speak-pay-swift
   ```

2. **Install dependencies**
   ```bash
   # Using Bun (recommended)
   bun install

   # Or using npm
   npm install
   ```

3. **Start development server**
   ```bash
   # Using Bun
   bun run dev

   # Or using npm
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:8080
   ```

### Production Build

```bash
# Build for production
bun run build

# Preview production build
bun run preview
```

## 📱 Usage

### Basic Flow
1. **Scan QR Code**: Point camera at UPI payment QR code
2. **Enter Amount**: Type amount in Hindi (e.g., "paanch sau" for ₹500)
3. **Review & Confirm**: Verify parsed amount and payee details
4. **Complete Payment**: Redirect to your preferred UPI app

### Hindi Input Examples

| Hindi Input | Parsed Amount | English Equivalent |
|-------------|---------------|-------------------|
| `ek lakh` | ₹100,000 | One lakh |
| `do lakh bees hazaar` | ₹220,000 | Two lakh twenty thousand |
| `paanch sau` | ₹500 | Five hundred |
| `teen hazaar` | ₹3,000 | Three thousand |
| `sau bees` | ₹120 | One hundred twenty |

### Supported Variations

The parser handles extensive variations including:
- **Spelling variations**: `paanch`/`panch`, `saat`/`sat`
- **Regional pronunciations**: `gyarah`/`giyarah`, `bees`/`bis`
- **Common typos**: `pachees` for `pachaas` (50), `pacchis` for `pachees` (25)
- **Phonetic similarities**: `shat` for `saat`, `bich` for `bees`

## 🏗️ Architecture

### Project Structure
```
src/
├── components/
│   ├── ScannerScreen.tsx      # QR code scanning
│   ├── PaymentEntry.tsx       # Hindi input interface
│   ├── ConfirmationDialog.tsx # Amount verification
│   ├── AppPicker.tsx         # UPI app selection
│   └── ui/                   # Reusable UI components
├── lib/
│   ├── hindi-number-parser.ts # Core parsing logic
│   └── utils.ts
├── routes/
│   ├── __root.tsx            # App shell
│   └── index.tsx             # Main flow orchestrator
└── hooks/
    └── use-mobile.tsx        # Mobile detection
```

### Parser Architecture

The Hindi number parser uses a multi-layered approach:

1. **Tokenization**: Splits input into words and numbers
2. **Dictionary Lookup**: Matches against comprehensive Hindi vocabulary
3. **Fuzzy Matching**: Levenshtein distance for typo correction
4. **Grammar Evaluation**: Handles multiplier precedence (crore > lakh > hazaar > sau)
5. **Validation**: Ensures logical number combinations

### Key Algorithms

- **Edit Distance**: Scaled Levenshtein distance (max 1 for short words, 2 for long)
- **Precedence Rules**: crore > lakh > hazaar > sau > units
- **Context Awareness**: Fraction handling and connector detection

## 🔧 Configuration

### Environment Variables
Create a `.env` file for local development:

```env
# Development settings
VITE_API_URL=http://localhost:8080
VITE_ENVIRONMENT=development
```

### Build Configuration
- **Vite**: Custom config in `vite.config.ts`
- **Cloudflare**: Deployment settings in `wrangler.jsonc`
- **ESLint**: Linting rules in `eslint.config.js`

## 🧪 Testing

### Manual Testing
Test various Hindi inputs in the browser console:

```javascript
import { parseHindiNumber } from './lib/hindi-number-parser';

// Test parsing
console.log(parseHindiNumber("do lakh bees hazaar"));
// Output: { amount: 220000, formatted: "₹220,000", corrected: false, ... }
```

### Common Test Cases
- Basic numbers: `paanch`, `das`, `bees`
- Compounds: `pachaas`, `sau`, `hazaar`
- Complex: `ek crore do lakh`, `paanch lakh teen hazaar`
- Typos: `pachees` (should correct to 25), `pacchis` (should correct to 25)

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-improvement
   ```
3. **Make your changes**
4. **Add tests** for new functionality
5. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/amazing-improvement
   ```
7. **Open a Pull Request**

### Development Guidelines

- **Code Style**: Follow existing TypeScript/React patterns
- **Parser Extensions**: Add new Hindi variations to `MISSPELLINGS` dictionary
- **UI Components**: Use shadcn/ui components for consistency
- **Mobile First**: Test on mobile devices and browsers

### Adding New Hindi Variations

To extend the parser with new Hindi words or variations:

1. Add to `UNITS` for canonical forms
2. Add variations to `MISSPELLINGS` mapping to canonical forms
3. Test with various inputs
4. Update documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Indian UPI Ecosystem**: For enabling digital payments revolution
- **Open Source Community**: For the amazing tools and libraries
- **Hindi Language Experts**: For guidance on regional variations
- **Beta Testers**: For valuable feedback and edge case discoveries

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-username/speak-pay-swift/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/speak-pay-swift/discussions)
- **Email**: support@speakpayswift.com

---

**Made with ❤️ for India** 🇮🇳

*Empowering every Indian to participate in the digital economy in their mother tongue.*