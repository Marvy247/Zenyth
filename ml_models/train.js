import * as tf from '@tensorflow/tfjs-node';
import fs from 'fs';
import path from 'path';

class ZenythMLModel {
  constructor() {
    this.model = null;
    this.modelPath = process.env.ML_MODEL_PATH || './ml_models/saved_model';
  }

  async train() {
    console.log('🧠 Zenyth: Training ML model...');
    
    const trainingData = this.generateTrainingData();
    
    this.model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [5], units: 16, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 8, activation: 'relu' }),
        tf.layers.dense({ units: 4, activation: 'softmax' })
      ]
    });

    this.model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    });

    const xs = tf.tensor2d(trainingData.inputs);
    const ys = tf.tensor2d(trainingData.outputs);

    await this.model.fit(xs, ys, {
      epochs: parseInt(process.env.TRAINING_EPOCHS) || 50,
      batchSize: parseInt(process.env.BATCH_SIZE) || 32,
      validationSplit: 0.2,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          if (epoch % 10 === 0) {
            console.log(`Epoch ${epoch}: loss = ${logs.loss.toFixed(4)}, acc = ${logs.acc.toFixed(4)}`);
          }
        }
      }
    });

    await this.saveModel();
    console.log('✅ Zenyth: Model trained and saved');
  }

  generateTrainingData() {
    const inputs = [];
    const outputs = [];
    
    for (let i = 0; i < 1000; i++) {
      const venusAPY = 5 + Math.random() * 10;
      const pancakeAPY = 8 + Math.random() * 15;
      const listaAPY = 6 + Math.random() * 12;
      const kernelAPY = 7 + Math.random() * 14;
      const vibeScore = Math.random();
      
      inputs.push([venusAPY, pancakeAPY, listaAPY, kernelAPY, vibeScore]);
      
      const apys = [venusAPY, pancakeAPY, listaAPY, kernelAPY];
      const adjustedAPYs = apys.map((apy, idx) => {
        const risk = [0.3, 0.6, 0.4, 0.5][idx];
        return apy * (1 + vibeScore * risk);
      });
      
      const bestIdx = adjustedAPYs.indexOf(Math.max(...adjustedAPYs));
      const output = [0, 0, 0, 0];
      output[bestIdx] = 1;
      outputs.push(output);
    }
    
    return { inputs, outputs };
  }

  async predict(apyData, vibeScore) {
    if (!this.model) {
      await this.loadModel();
    }
    
    const input = tf.tensor2d([[
      apyData.venus || 0,
      apyData.pancake || 0,
      apyData.lista || 0,
      apyData.kernel || 0,
      vibeScore
    ]]);
    
    const prediction = this.model.predict(input);
    const probabilities = await prediction.data();
    
    const protocols = ['venus', 'pancake', 'lista', 'kernel'];
    const bestIdx = probabilities.indexOf(Math.max(...probabilities));
    
    return {
      protocol: protocols[bestIdx],
      confidence: probabilities[bestIdx],
      probabilities: Object.fromEntries(protocols.map((p, i) => [p, probabilities[i]]))
    };
  }

  async saveModel() {
    if (!fs.existsSync(this.modelPath)) {
      fs.mkdirSync(this.modelPath, { recursive: true });
    }
    await this.model.save(`file://${this.modelPath}`);
  }

  async loadModel() {
    try {
      this.model = await tf.loadLayersModel(`file://${this.modelPath}/model.json`);
      console.log('✅ Zenyth: ML model loaded');
    } catch (error) {
      console.warn('⚠️ Zenyth: Model not found, training new model...');
      await this.train();
    }
  }
}

export default ZenythMLModel;
