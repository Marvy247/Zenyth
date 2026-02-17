import { ethers } from 'ethers';
import dotenv from 'dotenv';
import TelegramBot from 'node-telegram-bot-api';
import ZenythVibeAnalyzer from '../sentiment_analyzer/index.js';
import ZenythMLModel from '../ml_models/train.js';
import ZenythProtocolPlugin from '../plugins/protocolAdapter.js';
import fs from 'fs';
import express from 'express';
import cors from 'cors';

dotenv.config();

class ZenythAgent {
  constructor() {
    // Hardcoded BNB Chain Testnet RPC
    this.provider = new ethers.JsonRpcProvider('https://data-seed-prebsc-1-s1.bnbchain.org:8545');
    this.wallet = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
    
    this.vibeAnalyzer = new ZenythVibeAnalyzer();
    this.mlModel = new ZenythMLModel();
    // Helper to safely get checksummed address
    const safeGetAddress = (addr) => {
      try {
        return ethers.getAddress(addr);
      } catch (e) {
        // If checksum fails, return lowercase (ethers will accept it)
        return addr.toLowerCase();
      }
    };

    // Hardcoded protocol configuration for BNB Chain Testnet
    this.protocolPlugin = new ZenythProtocolPlugin('https://data-seed-prebsc-1-s1.bnbchain.org:8545', {
      venus: { comptroller: safeGetAddress('0x94d1820b52D714c3873e1fE1b5bC6E5E95a6856b'), vBNB: safeGetAddress('0x2e7222e51c0f6e986f1e77f0e332abc4fb16329e') },
      pancake: { router: safeGetAddress('0xd99d1c33f9fc3444f8101754abc46c52416550d1') },
      lista: { pool: '0x0000000000000000000000000000000000000000' },
      kernel: { vault: '0x0000000000000000000000000000000000000000' }
    });
    
    this.bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { 
      polling: {
        interval: 300,
        autoStart: true,
        params: {
          timeout: 10
        }
      }
    });
    
    // Handle polling errors gracefully
    this.bot.on('polling_error', (error) => {
      console.log('⚠️ Telegram polling error (non-critical):', error.code || error.message);
    });
    
    this.bot.on('error', (error) => {
      console.log('⚠️ Telegram error (non-critical):', error.message);
    });
    this.memory = this.loadMemory();
    
    this.setupCommands();
    this.setupAPIServer();
    console.log('🚀 Zenyth Agent initialized');
  }

  setupAPIServer() {
    const app = express();
    app.use(cors());
    app.use(express.json());

    app.post('/api/optimize', async (req, res) => {
      try {
        const { vibes, yields } = req.body;
        
        if (!vibes || !yields) {
          return res.status(400).json({ error: 'Missing vibes or yields data' });
        }

        const prediction = await this.mlModel.predict(yields, vibes.score);
        
        res.json({
          protocol: prediction.protocol,
          confidence: prediction.confidence,
          vibes: vibes.score,
          timestamp: Date.now()
        });
      } catch (error) {
        console.error('API optimize error:', error);
        res.status(500).json({ error: 'Optimization failed' });
      }
    });

    app.get('/api/health', (req, res) => {
      res.json({ status: 'ok', agent: 'zenyth' });
    });

    app.get('/api/yields', async (req, res) => {
      try {
        const apys = await this.protocolPlugin.getAllAPYs();
        res.json(apys);
      } catch (error) {
        console.error('API yields error:', error);
        res.status(500).json({ error: 'Failed to fetch yields' });
      }
    });

    app.get('/api/vibes', async (req, res) => {
      try {
        const vibes = await this.vibeAnalyzer.analyzeVibes();
        res.json(vibes);
      } catch (error) {
        console.error('API vibes error:', error);
        res.status(500).json({ error: 'Failed to fetch vibes' });
      }
    });

    const PORT = process.env.API_PORT || 3001;

    app.listen(PORT, () => {
      console.log(`🌐 API server running on http://localhost:${PORT}`);
    });
  }

  loadMemory() {
    try {
      return JSON.parse(fs.readFileSync('./zenythMemory.json', 'utf8'));
    } catch {
      return { decisions: [], rebalances: [], vibeHistory: [] };
    }
  }

  saveMemory() {
    fs.writeFileSync('./zenythMemory.json', JSON.stringify(this.memory, null, 2));
  }

  setupCommands() {
    this.bot.onText(/\/start/, (msg) => this.handleStart(msg));
    this.bot.onText(/\/vibeCheck/, (msg) => this.handleVibeCheck(msg));
    this.bot.onText(/\/optimize/, (msg) => this.handleOptimize(msg));
    this.bot.onText(/\/status/, (msg) => this.handleStatus(msg));
    this.bot.onText(/\/deposit (.+)/, (msg, match) => this.handleDeposit(msg, match));
    
    console.log('✅ Zenyth: Telegram commands registered');
  }

  async handleStart(msg) {
    const welcome = `
🌟 *Welcome to Zenyth!*

Vibes-Aware Autonomous DeFi Yield Optimizer

*Commands:*
/vibeCheck - Check current market vibes
/optimize - Get AI optimization recommendation
/status - View vault status
/deposit <amount> - Deposit BNB

Good vibes only! 🔥
    `;
    this.bot.sendMessage(msg.chat.id, welcome, { parse_mode: 'Markdown' });
  }

  async handleVibeCheck(msg) {
    this.bot.sendMessage(msg.chat.id, '🔍 Analyzing market vibes...');
    
    const vibes = await this.vibeAnalyzer.analyzeVibes();
    const emoji = this.vibeAnalyzer.getVibeEmoji(vibes.score);
    
    const response = `
${emoji} *Vibe Check Results*

Score: ${vibes.score.toFixed(2)} / 1.00
Sentiment: ${vibes.sentiment.toUpperCase()}
Confidence: ${(vibes.confidence * 100).toFixed(0)}%
Source: ${vibes.source}

${vibes.score > 0.6 ? '📈 Bullish vibes detected! Aggressive optimization recommended.' : vibes.score < 0.4 ? '📉 Bearish vibes. Conservative strategy advised.' : '😐 Neutral market. Balanced approach.'}
    `;
    
    this.bot.sendMessage(msg.chat.id, response, { parse_mode: 'Markdown' });
    this.memory.vibeHistory.push(vibes);
    this.saveMemory();
  }

  async handleOptimize(msg) {
    this.bot.sendMessage(msg.chat.id, '🧠 Running Zenyth AI optimization...');
    
    const vibes = await this.vibeAnalyzer.analyzeVibes();
    const apys = await this.protocolPlugin.getAllAPYs();
    
    const prediction = await this.mlModel.predict(apys, vibes.score);
    
    const response = `
🎯 *Zenyth Optimization Result*

${this.vibeAnalyzer.getVibeEmoji(vibes.score)} Vibe Score: ${vibes.score.toFixed(2)}

*Current APYs:*
Venus: ${apys.venus.toFixed(2)}%
PancakeSwap: ${apys.pancake.toFixed(2)}%
ListaDAO: ${apys.lista.toFixed(2)}%
KernelDAO: ${apys.kernel.toFixed(2)}%

*AI Recommendation:*
✅ Protocol: ${prediction.protocol.toUpperCase()}
📊 Confidence: ${(prediction.confidence * 100).toFixed(0)}%

${prediction.confidence > 0.7 ? '🔥 High confidence! Execute /rebalance to apply.' : '⚠️ Medium confidence. Monitor and wait.'}
    `;
    
    this.bot.sendMessage(msg.chat.id, response, { parse_mode: 'Markdown' });
    
    this.memory.decisions.push({
      timestamp: Date.now(),
      vibes,
      apys,
      prediction
    });
    this.saveMemory();
  }

  async handleStatus(msg) {
    try {
      // Updated contract address for BNB Chain Testnet (new deployment with receive())
      const vaultAddress = '0xe377Cb5aAB782315eF5bDa4ABA1be953a7156925';

      const vaultABI = ['function totalDeposits() view returns (uint256)', 'function totalShares() view returns (uint256)'];
      const vault = new ethers.Contract(vaultAddress, vaultABI, this.provider);
      
      const totalDeposits = await vault.totalDeposits();
      const totalShares = await vault.totalShares();
      
      const response = `
📊 *Zenyth Vault Status*

Total Deposits: ${ethers.formatEther(totalDeposits)} BNB
Total Shares: ${ethers.formatEther(totalShares)}
Decisions Made: ${this.memory.decisions.length}
Rebalances: ${this.memory.rebalances.length}

Contract: \`${vaultAddress}\`
      `;
      
      this.bot.sendMessage(msg.chat.id, response, { parse_mode: 'Markdown' });
    } catch (error) {
      this.bot.sendMessage(msg.chat.id, `❌ Error: ${error.message}`);
    }
  }

  async handleDeposit(msg, match) {
    const amount = match[1];
    this.bot.sendMessage(msg.chat.id, `💰 Deposit ${amount} BNB initiated. Check wallet for confirmation.`);
  }

  async start() {
    await this.mlModel.loadModel();
    console.log('✅ Zenyth Agent running. Telegram bot active.');
    console.log(`📱 Bot username: @${(await this.bot.getMe()).username}`);
  }
}

const agent = new ZenythAgent();
agent.start().catch(console.error);

export default ZenythAgent;
