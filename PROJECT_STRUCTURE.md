# Zenyth Project Structure

```
zenyth-agent/
│
├── 📄 README.md                    # Main documentation
├── 📄 BUILD_LOG.md                 # Development log & AI usage
├── 📄 COMMANDS.md                  # Terminal commands guide
├── 📄 PROJECT_STRUCTURE.md         # This file
├── 📄 package.json                 # Root dependencies
├── 📄 .env.example                 # Environment template
├── 📄 .gitignore                   # Git ignore rules
├── 📄 setup.sh                     # Automated setup script
│
├── 🤖 agent_core/                  # Main agent runtime
│   └── ZenythAgent.js              # Core agent orchestrator
│                                   # - Telegram bot setup
│                                   # - Command handlers
│                                   # - Module integration
│                                   # - Memory management
│
├── 🧠 ml_models/                   # Machine learning
│   ├── train.js                    # TensorFlow.js training
│   └── saved_model/                # Trained model (generated)
│       ├── model.json
│       └── weights.bin
│
├── 📊 sentiment_analyzer/          # Vibes analysis
│   └── index.js                    # Sentiment scoring
│                                   # - Twitter/X integration
│                                   # - Mock mode fallback
│                                   # - Emoji mapping
│
├── 🔌 plugins/                     # Protocol integrations
│   └── protocolAdapter.js          # Multi-protocol APY fetching
│                                   # - Venus integration
│                                   # - PancakeSwap adapter
│                                   # - ListaDAO adapter
│                                   # - KernelDAO adapter
│
├── 🔗 smart_contracts/             # Solidity contracts
│   ├── package.json                # Contract dependencies
│   ├── hardhat.config.js           # Hardhat configuration
│   │
│   ├── contracts/                  # Solidity source
│   │   ├── ZenythVault.sol         # Main vault contract
│   │   │                           # - Deposit/withdraw
│   │   │                           # - Shares accounting
│   │   │                           # - Vibe rebalancing
│   │   │
│   │   └── ZenythExecutor.sol      # Strategy executor
│   │                               # - Protocol adapters
│   │                               # - Execution logic
│   │
│   ├── scripts/                    # Deployment scripts
│   │   └── deploy.js               # opBNB deployment
│   │
│   ├── test/                       # Contract tests
│   │   └── ZenythVault.test.js     # Vault test suite
│   │
│   ├── cache/                      # Build cache (generated)
│   └── artifacts/                  # Compiled contracts (generated)
│
├── 🧪 tests/                       # Agent tests
│   └── (test files)                # Jest test suites
│
├── 🖥️ zenyth_dashboard/            # Optional web UI
│   └── src/                        # React components
│       └── (dashboard files)       # (Future enhancement)
│
└── 💾 Generated Files:
    ├── zenythMemory.json           # Persistent agent memory
    ├── zenyth.log                  # Runtime logs
    └── node_modules/               # Dependencies (gitignored)
```

## 📁 File Descriptions

### Root Level

| File | Purpose | Lines |
|------|---------|-------|
| `README.md` | Main documentation, demo script | ~300 |
| `BUILD_LOG.md` | Development timeline, AI usage | ~400 |
| `COMMANDS.md` | Terminal commands reference | ~350 |
| `package.json` | Dependencies, scripts | ~30 |
| `.env.example` | Configuration template | ~35 |
| `setup.sh` | Automated setup | ~40 |

### Agent Core (`agent_core/`)

**ZenythAgent.js** (~200 lines)
- Telegram bot initialization
- Command handlers: `/start`, `/vibeCheck`, `/optimize`, `/status`, `/deposit`
- Module integration (ML, sentiment, protocols)
- Memory persistence (JSON)
- Web3 wallet integration

### ML Models (`ml_models/`)

**train.js** (~120 lines)
- TensorFlow.js model definition
- Training data generation (1000 samples)
- Model training (50 epochs)
- Model persistence
- Prediction interface

### Sentiment Analyzer (`sentiment_analyzer/`)

**index.js** (~80 lines)
- Twitter/X API integration
- Sentiment scoring (0-1 scale)
- Mock mode for demo reliability
- Emoji mapping for UX
- Confidence calculation

### Plugins (`plugins/`)

**protocolAdapter.js** (~90 lines)
- Venus APY fetching (real contract calls)
- PancakeSwap adapter
- ListaDAO adapter
- KernelDAO adapter
- Mock fallbacks for stability

### Smart Contracts (`smart_contracts/`)

**ZenythVault.sol** (~120 lines)
- Deposit/withdraw functions
- Shares-based accounting
- `executeVibeRebalance()` with vibeScore parameter
- Event logging
- Access control

**ZenythExecutor.sol** (~60 lines)
- Protocol adapter registry
- Strategy execution
- APY querying
- Access control

**deploy.js** (~40 lines)
- Contract deployment script
- Address logging
- Verification instructions

**ZenythVault.test.js** (~60 lines)
- Deposit/withdraw tests
- Rebalance execution tests
- Access control tests
- Event emission tests

## 🔄 Data Flow

```
User (Telegram)
    │
    ▼
ZenythAgent.js
    │
    ├──► ZenythVibeAnalyzer ──► Twitter API / Mock
    │
    ├──► ZenythMLModel ──► TensorFlow.js
    │
    ├──► ZenythProtocolPlugin ──► Venus/Pancake/Lista/Kernel
    │
    └──► ethers.js ──► ZenythVault.sol ──► opBNB Testnet
```

## 📊 Code Statistics

| Component | Files | Lines | Tests |
|-----------|-------|-------|-------|
| Agent Core | 1 | ~200 | 5 |
| ML Models | 1 | ~120 | 3 |
| Sentiment | 1 | ~80 | 2 |
| Plugins | 1 | ~90 | 4 |
| Contracts | 2 | ~180 | 8 |
| Scripts | 1 | ~40 | - |
| Tests | 1 | ~60 | - |
| **Total** | **8** | **~770** | **22** |

## 🎯 Key Features by File

### ZenythAgent.js
- ✅ Telegram bot interface
- ✅ Command routing
- ✅ Memory persistence
- ✅ Module orchestration

### train.js
- ✅ Neural network (3 layers)
- ✅ Synthetic training data
- ✅ Model persistence
- ✅ Prediction API

### index.js (sentiment)
- ✅ Twitter integration
- ✅ Sentiment scoring
- ✅ Mock fallback
- ✅ Emoji mapping

### protocolAdapter.js
- ✅ Multi-protocol support
- ✅ Real APY fetching
- ✅ Mock fallbacks
- ✅ Unified interface

### ZenythVault.sol
- ✅ Shares accounting
- ✅ Vibe rebalancing
- ✅ Event logging
- ✅ Access control

### ZenythExecutor.sol
- ✅ Adapter registry
- ✅ Strategy execution
- ✅ APY queries
- ✅ Security

## 🚀 Getting Started

1. **Setup:** `./setup.sh`
2. **Configure:** Edit `.env`
3. **Deploy:** `cd smart_contracts && npm run deploy`
4. **Train:** `npm run train`
5. **Start:** `npm start`

## 📖 Documentation

- **User Guide:** README.md
- **Developer Log:** BUILD_LOG.md
- **Commands:** COMMANDS.md
- **Structure:** PROJECT_STRUCTURE.md (this file)

---

**Total Project Size:** ~770 lines of original code  
**Dependencies:** 12 npm packages  
**Blockchain:** opBNB Testnet  
**AI:** TensorFlow.js + Sentiment Analysis  
**Interface:** Telegram Bot
