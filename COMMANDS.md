# Zenyth Terminal Commands Guide

## 🚀 Initial Setup

```bash
# Clone repository
git clone https://github.com/yourusername/zenyth-agent.git
cd zenyth-agent

# Run automated setup
chmod +x setup.sh
./setup.sh

# OR manual setup:
npm install
cd smart_contracts && npm install && cd ..
npm run train
```

## ⚙️ Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit configuration (use your favorite editor)
nano .env
# OR
vim .env
# OR
code .env

# Required variables:
# - TELEGRAM_BOT_TOKEN (from @BotFather)
# - PRIVATE_KEY (your wallet private key)
# - OPBNB_RPC_URL (default provided)
```

## 🔗 Smart Contract Deployment

```bash
# Navigate to contracts directory
cd smart_contracts

# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to opBNB testnet
npx hardhat run scripts/deploy.js --network opbnb_testnet

# Expected output:
# 🚀 Deploying Zenyth contracts to opBNB testnet...
# Deployer: 0x...
# Balance: 0.5
# ✅ ZenythVault deployed: 0x...
# ✅ ZenythExecutor deployed: 0x...

# Copy the addresses and update .env:
# ZENYTH_VAULT_ADDRESS=0x...
# ZENYTH_EXECUTOR_ADDRESS=0x...

# Return to root
cd ..
```

## 🧠 ML Model Training

```bash
# Train the model (takes ~1 minute)
npm run train

# Expected output:
# 🧠 Zenyth: Training ML model...
# Epoch 0: loss = 1.3863, acc = 0.2500
# Epoch 10: loss = 0.8234, acc = 0.6250
# ...
# Epoch 50: loss = 0.2145, acc = 0.9125
# ✅ Zenyth: Model trained and saved

# Model saved to: ./ml_models/saved_model/
```

## 🤖 Start Zenyth Agent

```bash
# Start the agent
npm start

# Expected output:
# 🚀 Zenyth Agent initialized
# ✅ Zenyth: ML model loaded
# ✅ Zenyth: Telegram commands registered
# ✅ Zenyth Agent running. Telegram bot active.
# 📱 Bot username: @YourZenythBot

# Agent is now running and listening for Telegram commands
# Keep this terminal open
```

## 📱 Telegram Bot Commands

Open Telegram and interact with your bot:

```
/start          - Initialize bot and see welcome message
/vibeCheck      - Analyze current market sentiment
/optimize       - Get AI optimization recommendation
/status         - View vault status and statistics
/deposit 0.1    - Deposit BNB (amount in BNB)
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run smart contract tests only
cd smart_contracts
npx hardhat test

# Run specific test file
npx hardhat test test/ZenythVault.test.js

# Run with gas reporting
npx hardhat test --gas-reporter

# Run with coverage
npx hardhat coverage
```

## 🔍 Verification & Debugging

```bash
# Check agent logs
npm start | tee zenyth.log

# View memory state
cat zenythMemory.json | jq

# Check ML model exists
ls -lh ml_models/saved_model/

# Verify contract deployment
npx hardhat verify --network opbnb_testnet <VAULT_ADDRESS>
npx hardhat verify --network opbnb_testnet <EXECUTOR_ADDRESS> <VAULT_ADDRESS>

# Check opBNB testnet balance
npx hardhat run scripts/checkBalance.js --network opbnb_testnet
```

## 🎬 Demo Recording Setup

```bash
# Terminal 1: Start agent with verbose logging
npm start

# Terminal 2: Monitor logs
tail -f zenyth.log

# Terminal 3: Watch blockchain events
npx hardhat run scripts/watchEvents.js --network opbnb_testnet

# Screen recording tools:
# - OBS Studio (free, cross-platform)
# - Loom (web-based, easy)
# - Camtasia (professional)

# Demo flow:
# 1. Show project structure: tree -L 2
# 2. Show README.md
# 3. Open Telegram
# 4. Execute commands: /vibeCheck → /optimize → /status
# 5. Show transaction on explorer
# 6. Show BUILD_LOG.md
```

## 🐛 Troubleshooting

```bash
# Agent won't start
# Check Node.js version
node --version  # Should be 18+

# Check dependencies
npm list

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Telegram bot not responding
# Verify token in .env
echo $TELEGRAM_BOT_TOKEN

# Test bot token
curl https://api.telegram.org/bot<YOUR_TOKEN>/getMe

# Contract deployment fails
# Check balance
npx hardhat run scripts/checkBalance.js --network opbnb_testnet

# Get testnet BNB
# Visit: https://testnet.bnbchain.org/faucet-smart

# ML model training fails
# Check TensorFlow installation
npm list @tensorflow/tfjs-node

# Reinstall TensorFlow
npm uninstall @tensorflow/tfjs-node
npm install @tensorflow/tfjs-node

# Sentiment analyzer errors
# Check Twitter API (optional)
# If no token, it will use mock mode automatically

# View detailed error logs
DEBUG=* npm start
```

## 📊 Monitoring & Analytics

```bash
# Watch vault events in real-time
npx hardhat run scripts/watchEvents.js --network opbnb_testnet

# Query vault state
npx hardhat run scripts/queryVault.js --network opbnb_testnet

# Check rebalance history
node -e "console.log(require('./zenythMemory.json').rebalances)"

# View vibe history
node -e "console.log(require('./zenythMemory.json').vibeHistory)"

# Export data for analysis
node scripts/exportData.js > zenyth_data.json
```

## 🚀 Production Deployment (Mainnet)

```bash
# ⚠️ WARNING: Use mainnet only after thorough testing

# Update .env for mainnet
OPBNB_RPC_URL=https://opbnb-mainnet-rpc.bnbchain.org
OPBNB_CHAIN_ID=204

# Deploy to mainnet
cd smart_contracts
npx hardhat run scripts/deploy.js --network opbnb_mainnet

# Verify contracts
npx hardhat verify --network opbnb_mainnet <VAULT_ADDRESS>

# Start agent with mainnet config
NODE_ENV=production npm start
```

## 🧹 Cleanup

```bash
# Stop agent
# Press Ctrl+C in the terminal running npm start

# Clean build artifacts
cd smart_contracts
npx hardhat clean
rm -rf cache artifacts

# Remove ML model (will retrain on next start)
rm -rf ml_models/saved_model

# Reset memory
rm zenythMemory.json

# Full cleanup
rm -rf node_modules smart_contracts/node_modules
npm install
cd smart_contracts && npm install && cd ..
```

## 📦 Git Workflow

```bash
# Initialize repository
git init
git add .
git commit -m "Initial commit: Zenyth vibes-aware DeFi optimizer"

# Create GitHub repository (via web or CLI)
gh repo create zenyth-agent --public

# Push to GitHub
git remote add origin https://github.com/yourusername/zenyth-agent.git
git branch -M main
git push -u origin main

# Tag release for hackathon submission
git tag -a v1.0.0 -m "Hackathon submission version"
git push origin v1.0.0
```

## 🎥 Video Recording Commands

```bash
# Start recording with OBS Studio
# Then execute demo flow:

# 1. Show project
tree -L 2 -I node_modules

# 2. Show README
cat README.md | head -50

# 3. Show contracts
cat smart_contracts/contracts/ZenythVault.sol | head -30

# 4. Start agent (if not running)
npm start

# 5. Open Telegram and execute:
# /start
# /vibeCheck
# /optimize
# /status

# 6. Show transaction on explorer
# Open: https://opbnb-testnet.bscscan.com/tx/<TX_HASH>

# 7. Show build log
cat BUILD_LOG.md | head -100

# Stop recording
```

## 📋 Pre-Submission Checklist

```bash
# Run all tests
npm test
cd smart_contracts && npx hardhat test && cd ..

# Verify all files present
ls -la

# Check README
cat README.md

# Check BUILD_LOG
cat BUILD_LOG.md

# Verify .env.example (no secrets)
cat .env.example

# Verify .gitignore
cat .gitignore

# Check contracts deployed
echo "Vault: $ZENYTH_VAULT_ADDRESS"
echo "Executor: $ZENYTH_EXECUTOR_ADDRESS"

# Final commit
git add .
git commit -m "Final submission: Zenyth v1.0.0"
git push

# Create submission package
zip -r zenyth-submission.zip . -x "node_modules/*" "*.log" ".env"
```

---

**Quick Reference:**

| Command | Purpose |
|---------|---------|
| `./setup.sh` | Automated setup |
| `npm start` | Start agent |
| `npm run train` | Train ML model |
| `npm test` | Run tests |
| `cd smart_contracts && npm run deploy` | Deploy contracts |

**Support:** See README.md or BUILD_LOG.md for detailed documentation.
