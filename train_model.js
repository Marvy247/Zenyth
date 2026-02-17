import ZenythMLModel from './ml_models/train.js';

async function main() {
  console.log('🚀 Starting Zenyth ML Model Training...\n');
  
  const model = new ZenythMLModel();
  
  try {
    await model.train();
    console.log('\n✅ Training completed successfully!');
    console.log('📁 Model saved to: ./ml_models/saved_model/');
    
    // Test prediction
    console.log('\n🧪 Testing prediction...');
    const testAPYs = {
      venus: 8.5,
      pancake: 12.3,
      lista: 9.8,
      kernel: 11.2
    };
    const testVibeScore = 0.75;
    
    const prediction = await model.predict(testAPYs, testVibeScore);
    console.log('\n📊 Test Prediction Results:');
    console.log(`   Protocol: ${prediction.protocol.toUpperCase()}`);
    console.log(`   Confidence: ${(prediction.confidence * 100).toFixed(2)}%`);
    console.log('   Probabilities:');
    Object.entries(prediction.probabilities).forEach(([protocol, prob]) => {
      console.log(`     - ${protocol}: ${(prob * 100).toFixed(2)}%`);
    });
    
  } catch (error) {
    console.error('\n❌ Training failed:', error.message);
    process.exit(1);
  }
}

main();
