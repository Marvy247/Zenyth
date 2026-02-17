# Zenyth Frontend - Terminal Commands

## 🚀 Quick Start

```bash
# Navigate to frontend directory
cd /home/marvi/Documents/zenyth-agent/frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your contract addresses
nano .env
# Add:
# VITE_ZENYTH_VAULT_ADDRESS=0x...
# VITE_ZENYTH_EXECUTOR_ADDRESS=0x...

# Start development server
npm run dev

# Open browser to http://localhost:5173
```

## 📦 Installation Steps

```bash
# Step 1: Install Node.js dependencies
cd frontend
npm install

# Expected output:
# added 250 packages in 30s

# Step 2: Verify installation
npm list --depth=0

# Should show:
# ├── react@18.2.0
# ├── wagmi@2.5.7
# ├── viem@2.7.13
# ├── recharts@2.12.0
# └── ... (other packages)
```

## 🔧 Development

```bash
# Start dev server (with hot reload)
npm run dev

# Expected output:
# VITE v5.1.0  ready in 500 ms
# ➜  Local:   http://localhost:5173/
# ➜  Network: use --host to expose

# The server will auto-reload on file changes
```

## 🏗️ Build for Production

```bash
# Build optimized production bundle
npm run build

# Expected output:
# vite v5.1.0 building for production...
# ✓ 150 modules transformed.
# dist/index.html                  0.45 kB
# dist/assets/index-abc123.css     5.20 kB
# dist/assets/index-def456.js    150.30 kB
# ✓ built in 3.50s

# Preview production build locally
npm run preview

# Opens on http://localhost:4173
```

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Expected output:
# 🔍  Inspect: https://vercel.com/...
# ✅  Production: https://zenyth-dashboard.vercel.app
```

### Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --dir=dist

# Follow prompts to create new site
```

### Manual Deployment

```bash
# Build first
npm run build

# Upload dist/ folder to:
# - AWS S3 + CloudFront
# - GitHub Pages
# - Any static hosting service

# For GitHub Pages:
# 1. Push dist/ to gh-pages branch
# 2. Enable Pages in repo settings
```

## 🧪 Testing

```bash
# Run type checking
npx tsc --noEmit

# Check for TypeScript errors
# No output = all good!

# Lint code (if ESLint configured)
npm run lint

# Format code (if Prettier configured)
npm run format
```

## 🔍 Debugging

```bash
# Start with verbose logging
DEBUG=* npm run dev

# Check for port conflicts
lsof -i :5173

# Kill process on port 5173
kill -9 $(lsof -t -i:5173)

# Clear Vite cache
rm -rf node_modules/.vite

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 📊 Performance Analysis

```bash
# Build with bundle analysis
npm run build -- --mode analyze

# Check bundle size
du -sh dist/

# Lighthouse audit (requires Chrome)
npx lighthouse http://localhost:5173 --view
```

## 🌐 Network Configuration

### Add opBNB Testnet to MetaMask

```bash
# Network Name: opBNB Testnet
# RPC URL: https://opbnb-testnet-rpc.bnbchain.org
# Chain ID: 5611
# Currency Symbol: BNB
# Block Explorer: https://opbnb-testnet.bscscan.com
```

### Get Testnet BNB

```bash
# Visit faucet
open https://testnet.bnbchain.org/faucet-smart

# Or use curl
curl -X POST https://testnet.bnbchain.org/faucet-smart \
  -H "Content-Type: application/json" \
  -d '{"address":"YOUR_ADDRESS"}'
```

## 🎬 Demo Recording Setup

```bash
# Terminal 1: Start backend agent
cd ../agent_core
npm start

# Terminal 2: Start frontend
cd frontend
npm run dev

# Terminal 3: Watch logs
tail -f ../zenythMemory.json

# Open browser to http://localhost:5173
# Start recording with OBS/Loom
```

## 🔄 Update Dependencies

```bash
# Check for outdated packages
npm outdated

# Update all to latest
npm update

# Update specific package
npm install wagmi@latest

# Update major versions (careful!)
npx npm-check-updates -u
npm install
```

## 🐛 Common Issues & Fixes

### Issue: "Cannot find module 'vite'"

```bash
# Solution: Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Port 5173 already in use"

```bash
# Solution: Use different port
npm run dev -- --port 3000

# Or kill existing process
kill -9 $(lsof -t -i:5173)
```

### Issue: "Module not found: Can't resolve '@/...'"

```bash
# Solution: Check tsconfig.json paths
# Ensure baseUrl and paths are set correctly
# Restart dev server
```

### Issue: Wallet won't connect

```bash
# Solution: Check MetaMask network
# 1. Open MetaMask
# 2. Switch to opBNB Testnet
# 3. Refresh page
# 4. Try connecting again
```

### Issue: Transactions fail

```bash
# Solution: Check gas and balance
# 1. Ensure you have testnet BNB
# 2. Check contract addresses in .env
# 3. Verify contracts are deployed
# 4. Check browser console for errors
```

## 📝 Environment Variables

```bash
# View current env vars
cat .env

# Set env vars for build
VITE_ZENYTH_VAULT_ADDRESS=0x123... npm run build

# Check if env vars are loaded
# In browser console:
console.log(import.meta.env.VITE_ZENYTH_VAULT_ADDRESS)
```

## 🔐 Security

```bash
# Never commit .env file
echo ".env" >> .gitignore

# Check for exposed secrets
git log --all --full-history -- .env

# Remove .env from git history if committed
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all
```

## 📦 Package Management

```bash
# List installed packages
npm list

# Check package info
npm info wagmi

# View package.json scripts
npm run

# Add new dependency
npm install <package-name>

# Add dev dependency
npm install -D <package-name>

# Remove package
npm uninstall <package-name>
```

## 🎨 Styling

```bash
# Rebuild Tailwind CSS
npx tailwindcss -i ./src/index.css -o ./dist/output.css

# Watch for changes
npx tailwindcss -i ./src/index.css -o ./dist/output.css --watch

# Purge unused CSS (automatic in build)
npm run build
```

## 📱 Mobile Testing

```bash
# Expose dev server to network
npm run dev -- --host

# Access from mobile device
# Use your local IP: http://192.168.1.x:5173

# Find your IP
ifconfig | grep "inet " | grep -v 127.0.0.1
```

## 🚀 Production Checklist

```bash
# 1. Update contract addresses
nano .env

# 2. Test build locally
npm run build
npm run preview

# 3. Check bundle size
du -sh dist/

# 4. Test on mobile
npm run dev -- --host

# 5. Deploy
vercel --prod

# 6. Verify deployment
curl https://your-domain.vercel.app

# 7. Test wallet connection on live site
# 8. Test full user flow
# 9. Record demo video
# 10. Submit to hackathon!
```

## 📊 Monitoring

```bash
# Watch build size
npm run build && ls -lh dist/assets/

# Monitor dev server performance
npm run dev -- --debug

# Check for memory leaks
node --inspect node_modules/.bin/vite

# Open chrome://inspect in Chrome
```

---

**Quick Reference:**

| Command | Purpose |
|---------|---------|
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `vercel --prod` | Deploy to Vercel |

**Support:** See frontend/README.md for detailed documentation.
