#!/bin/bash

echo "🚀 Zenyth Setup Script"
echo "======================"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Install root dependencies
echo ""
echo "📦 Installing root dependencies..."
npm install

# Install smart contract dependencies
echo ""
echo "📦 Installing smart contract dependencies..."
cd smart_contracts
npm install
cd ..

# Create .env if not exists
if [ ! -f .env ]; then
    echo ""
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please edit .env with your configuration"
fi

# Train ML model
echo ""
echo "🧠 Training ML model..."
npm run train

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Edit .env with your keys"
echo "2. Get opBNB testnet BNB: https://testnet.bnbchain.org/faucet-smart"
echo "3. Deploy contracts: cd smart_contracts && npm run deploy"
echo "4. Start agent: npm start"
echo ""
echo "📖 See README.md for full documentation"
