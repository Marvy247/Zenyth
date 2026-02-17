# Zenyth Frontend Dashboard

Modern, vibes-aware DeFi dashboard for the Zenyth AI agent.

## Features

- 🎨 Beautiful gradient UI with good vibes theme
- 📊 Real-time vibe score gauge
- 📈 Protocol APY comparison charts
- 💰 Portfolio tracking
- 🤖 AI-powered optimization
- 🔗 opBNB testnet integration
- 📱 Fully responsive

## Setup

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Add your contract addresses to .env:
# VITE_ZENYTH_VAULT_ADDRESS=0x...
# VITE_ZENYTH_EXECUTOR_ADDRESS=0x...

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Demo Video Script

### Scene 1: Landing (15s)
1. Open browser to `http://localhost:5173`
2. Show landing page with Zenyth logo
3. Narration: "This is Zenyth - a vibes-aware DeFi optimizer"

### Scene 2: Connect Wallet (20s)
1. Click "Connect Wallet" button
2. MetaMask popup appears
3. Approve connection
4. Show connected address in header
5. Narration: "Connect to opBNB testnet"

### Scene 3: View Dashboard (30s)
1. Dashboard loads with data
2. Point to Vibe Gauge: "Current market sentiment: 0.78 🔥 Bullish"
3. Point to APY Chart: "Real-time yields across 4 protocols"
4. Point to Portfolio: "Your current balance and shares"
5. Narration: "All data updates in real-time"

### Scene 4: AI Optimization (45s)
1. Click "Optimize with AI" button
2. Show toast: "AI analyzing optimal strategy..."
3. Show recommendation: "PancakeSwap (87% confidence)"
4. Show toast: "Executing rebalance..."
5. MetaMask confirmation popup
6. Approve transaction
7. Show success toast with tx hash link
8. Click link to open opBNB explorer
9. Show confirmed transaction
10. Narration: "AI analyzes vibes + yields, executes on-chain"

### Scene 5: Updated Dashboard (20s)
1. Return to dashboard
2. Show updated portfolio
3. Show rebalance in history
4. Narration: "Portfolio automatically optimized based on market vibes"

### Scene 6: Wrap-up (10s)
1. Scroll through full dashboard
2. Show footer: "Good Vibes Only 🔥"
3. Narration: "Zenyth - autonomous, vibes-aware, on-chain"

**Total: ~2:20 minutes**

## Tech Stack

- React 18 + TypeScript
- Vite (fast dev server)
- Tailwind CSS (styling)
- wagmi + viem (Web3)
- Recharts (charts)
- Sonner (toasts)
- Lucide React (icons)

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── WalletButton.tsx
│   │   ├── VibeGauge.tsx
│   │   ├── YieldChart.tsx
│   │   ├── OptimizeButton.tsx
│   │   └── PortfolioCard.tsx
│   ├── hooks/
│   │   ├── useVibeScore.ts
│   │   ├── useYields.ts
│   │   └── usePortfolio.ts
│   ├── lib/
│   │   └── wagmi.ts
│   ├── pages/
│   │   └── Dashboard.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

### Manual Build

```bash
npm run build
# Upload dist/ folder to any static host
```

## Environment Variables

```env
VITE_ZENYTH_VAULT_ADDRESS=0x...
VITE_ZENYTH_EXECUTOR_ADDRESS=0x...
```

## API Endpoints (Backend)

The frontend expects these endpoints from the agent:

- `GET /api/vibes` - Current vibe score
- `GET /api/yields` - Protocol APYs
- `POST /api/optimize` - AI recommendation

## Tips for Demo Recording

1. **Use OBS Studio** or Loom for screen recording
2. **Prepare testnet BNB** before recording
3. **Test full flow** once before final recording
4. **Keep MetaMask ready** (already connected)
5. **Clear browser cache** for clean start
6. **Use 1080p resolution** for clarity
7. **Speak clearly** during narration
8. **Show tx hash** on explorer (proof!)

## Troubleshooting

### Wallet won't connect
- Check MetaMask is on opBNB testnet
- Network: opBNB Testnet
- RPC: https://opbnb-testnet-rpc.bnbchain.org
- Chain ID: 5611

### Data not loading
- Ensure agent backend is running on port 3001
- Check browser console for errors
- Verify API endpoints are accessible

### Transaction fails
- Check you have testnet BNB
- Verify contract addresses in .env
- Check gas settings in MetaMask

## License

MIT
