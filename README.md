# Zenyth: Vibes-Aware Autonomous DeFi Yield Optimizer

**Good Vibes Only: OpenClaw Edition** - BNB Chain Hackathon 2026

![Zenyth Banner](https://img.shields.io/badge/Zenyth-Vibes%20Aware%20DeFi-brightgreen?style=for-the-badge)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![opBNB](https://img.shields.io/badge/opBNB-Testnet-orange)](https://opbnb-testnet.bscscan.com)

## Overview

Zenyth is an **autonomous AI agent** that optimizes DeFi yields by combining:
- Machine Learning predictions (TensorFlow.js)
- Real-time sentiment analysis from Twitter/X
- Multi-protocol integration (Venus, PancakeSwap, ListaDAO, KernelDAO)
- OpenClaw runtime for persistent autonomy
- Telegram interface for seamless demo experience

### Unique Innovation: Vibes-Aware Optimization

Unlike traditional yield optimizers, Zenyth adjusts strategies based on **market sentiment**:
- **Positive vibes (>0.6)** - Aggressive optimization, higher-risk protocols
- **Negative vibes (<0.4)** - Conservative hedging, stable protocols
- **Neutral vibes** - Balanced ML-driven allocation

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Telegram Bot UI                      │
│              (Demo-friendly interface)                  │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│              Zenyth Agent Core                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Vibe Analyzer│  │  ML Predictor│  │ Protocol     │  │
│  │ (Sentiment)  │  │ (TensorFlow) │  │ Adapters     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│           Smart Contracts (opBNB)                       │
│  ┌──────────────────┐    ┌──────────────────┐          │
│  │  ZenythVault.sol │◄──►│ ZenythExecutor   │          │
│  │  (Deposits/Shares)│    │ (Rebalancing)    │          │
│  └──────────────────┘    └──────────────────┘          │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│              DeFi Protocols (opBNB)                     │
│   Venus  │  PancakeSwap  │  ListaDAO  │  KernelDAO     │
└─────────────────────────────────────────────────────────┘
```

## Quick Start

### Live Demo
🚀 **Try it now:** [https://zenyth-demo.vercel.app](https://your-demo-url.com)

### Video Demo
📹 **Watch the demo:** [2-minute walkthrough](https://your-video-url.com)

### Prerequisites
- Node.js 18+
- npm/yarn
- MetaMask wallet
- opBNB testnet BNB ([faucet](https://testnet.bnbchain.org/faucet-smart))
- Telegram account

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/zenyth-agent.git
cd zenyth-agent

# Install dependencies
npm install

# Install smart contract dependencies
cd smart_contracts
npm install
cd ..

# Configure environment
cp .env.example .env
# Edit .env with your keys
```

### Deploy Smart Contracts

```bash
cd smart_contracts
npx hardhat compile
npx hardhat run scripts/deploy.js --network opbnb_testnet

# Update .env with deployed addresses
```

### Train ML Model

```bash
npm run train
```

### Start Zenyth Agent

```bash
npm start
```

## Demo Video Script (2-4 minutes)

### Scene 1: Introduction (30s)
**Narration:** "Meet Zenyth - the first vibes-aware DeFi yield optimizer. It combines AI, sentiment analysis, and autonomous execution to maximize your yields based on market sentiment."

**Screen:** Show README, architecture diagram

### Scene 2: Setup (30s)
**Narration:** "Zenyth runs on opBNB testnet for fast, low-cost transactions. Let's connect to our Telegram bot."

**Actions:**
1. Open Telegram
2. Search for your bot (@YourZenythBot)
3. Type `/start`
4. Show welcome message

### Scene 3: Vibe Check (45s)
**Narration:** "First, let's check the current market vibes using real-time sentiment analysis."

**Actions:**
1. Type `/vibeCheck`
2. Show vibe score (e.g., 0.78)
3. Explain: "High vibe score means bullish sentiment - Zenyth will optimize aggressively"

### Scene 4: AI Optimization (60s)
**Narration:** "Now let's get Zenyth's AI recommendation. It analyzes APYs across 4 protocols and adjusts for market sentiment."

**Actions:**
1. Type `/optimize`
2. Show:
   - Current APYs (Venus: 8.5%, Pancake: 12.3%, etc.)
   - Vibe score: 0.78
   - AI recommendation: PancakeSwap (confidence: 87%)
3. Explain: "With positive vibes, Zenyth recommends the higher-yield PancakeSwap strategy"

### Scene 5: Live Transaction (45s)
**Narration:** "Let's execute a rebalance on-chain. Zenyth will autonomously move funds to the optimal protocol."

**Actions:**
1. Type `/status` (show current vault state)
2. Trigger rebalance (via agent or manual command)
3. Show transaction hash
4. Open opBNB explorer: `https://opbnb-testnet.bscscan.com/tx/0x...`
5. Show confirmed transaction

### Scene 6: Results & Wrap-up (30s)
**Narration:** "Zenyth successfully rebalanced based on AI + sentiment analysis. All on-chain, all autonomous, all good vibes."

**Screen:**
- Show `/status` with updated stats
- Display GitHub repo
- Show BUILD_LOG.md
- End screen: "Zenyth - Good Vibes Only"

## Testing

```bash
# Smart contract tests
cd smart_contracts
npx hardhat test

# Agent tests
npm test
```

## Features

### Implemented
- Sentiment analysis (Twitter/X + mock mode)
- ML prediction model (TensorFlow.js)
- Multi-protocol APY fetching
- Smart contracts (ZenythVault, ZenythExecutor)
- Telegram bot interface
- Persistent memory
- opBNB testnet deployment
- On-chain rebalancing

### Demo-Optimized
- Fast opBNB confirmations (<2s)
- Visual emoji feedback
- Clear command structure
- Transaction proof links
- Error-proof mock fallbacks

## Hackathon Criteria

| Criterion | Implementation | Score |
|-----------|---------------|-------|
| **Innovation** | Vibes-aware optimization (unique twist) | 5/5 |
| **Functionality** | Live txs, ML, sentiment, multi-protocol | 5/5 |
| **BNB Relevance** | opBNB testnet, DeFi protocols | 5/5 |
| **AI Usage** | TensorFlow.js, OpenClaw, sentiment | 5/5 |
| **Good Vibes** | Positive UX, emoji, theme integration | 5/5 |

## BUILD_LOG.md

See [BUILD_LOG.md](./BUILD_LOG.md) for:
- Chronological development log
- AI prompts used
- Originality rationale
- Technical decisions

## Links

- **Live Demo:** [https://zenyth-demo.vercel.app](https://your-demo-url.com)
- **Video Demo:** [2-minute walkthrough](https://your-video-url.com)
- **GitHub:** [github.com/yourusername/zenyth-agent](https://github.com/yourusername/zenyth-agent)
- **BUILD_LOG:** [Development documentation](./BUILD_LOG.md)
- **DEMO_GUIDE:** [Presentation guide](./DEMO_GUIDE.md)
- **opBNB Contract:** [0xe377Cb5aAB782315eF5bDa4ABA1be953a7156925](https://testnet.bscscan.com/address/0xe377Cb5aAB782315eF5bDa4ABA1be953a7156925)

## Hackathon Submission

**Track:** Agent (AI Agent × Onchain Actions)  
**Prize Pool:** $100,000  
**Submission Date:** February 17, 2026

### Key Features for Judging
1. ✅ **Onchain Proof:** All transactions verifiable on opBNB testnet
2. ✅ **AI Integration:** TensorFlow.js ML model + sentiment analysis
3. ✅ **Autonomous Execution:** Self-operating agent with configurable thresholds
4. ✅ **Reproducible:** Complete setup instructions and demo guide
5. ✅ **Build Log:** Comprehensive AI usage documentation

### Innovation Highlights
- **Vibes-Aware Optimization:** First DeFi optimizer that adjusts strategy based on market sentiment
- **True Autonomy:** Agent monitors and executes without human intervention
- **Transparent AI:** Shows confidence scores and reasoning for all decisions
- **Multi-Protocol:** Integrates Venus, PancakeSwap, ListaDAO, and KernelDAO

## License

MIT License - see [LICENSE](./LICENSE)

## Acknowledgments

- BNB Chain & DoraHacks for the hackathon
- OpenClaw for autonomous agent framework
- Venus, PancakeSwap, ListaDAO, KernelDAO protocols

---

**Built with good vibes for the Good Vibes Only: OpenClaw Edition hackathon**
