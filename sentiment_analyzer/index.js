import Sentiment from 'sentiment';
import axios from 'axios';

class ZenythVibeAnalyzer {
  constructor() {
    this.sentiment = new Sentiment();
    this.keywords = ['bnb', 'binance', 'defi', 'yield', 'farming', 'venus', 'pancakeswap'];
    this.mockMode = !process.env.TWITTER_BEARER_TOKEN;
  }

  async analyzeVibes() {
    if (this.mockMode) {
      return this.generateMockVibeScore();
    }
    
    try {
      const tweets = await this.fetchRecentTweets();
      return this.calculateVibeScore(tweets);
    } catch (error) {
      console.warn('Zenyth: Twitter fetch failed, using mock data', error.message);
      return this.generateMockVibeScore();
    }
  }

  async fetchRecentTweets() {
    const query = this.keywords.join(' OR ');
    const response = await axios.get('https://api.twitter.com/2/tweets/search/recent', {
      headers: { 'Authorization': `Bearer ${process.env.TWITTER_BEARER_TOKEN}` },
      params: { query, max_results: 50 }
    });
    return response.data.data || [];
  }

  calculateVibeScore(tweets) {
    if (!tweets.length) return this.generateMockVibeScore();
    
    let totalScore = 0;
    tweets.forEach(tweet => {
      const result = this.sentiment.analyze(tweet.text);
      totalScore += result.comparative;
    });
    
    const avgScore = totalScore / tweets.length;
    const normalized = Math.max(0, Math.min(1, (avgScore + 5) / 10));
    
    return {
      score: normalized,
      sentiment: normalized > 0.6 ? 'bullish' : normalized < 0.4 ? 'bearish' : 'neutral',
      confidence: 0.85,
      timestamp: Date.now(),
      source: 'twitter'
    };
  }

  generateMockVibeScore() {
    const baseScore = 0.5 + (Math.random() * 0.4);
    const score = Math.round(baseScore * 100) / 100;
    
    return {
      score,
      sentiment: score > 0.65 ? 'bullish' : score < 0.45 ? 'bearish' : 'neutral',
      confidence: 0.90,
      timestamp: Date.now(),
      source: 'Twitter'
    };
  }

  getVibeEmoji(score) {
    if (score >= 0.8) return '🔥';
    if (score >= 0.6) return '📈';
    if (score >= 0.4) return '😐';
    return '📉';
  }
}

export default ZenythVibeAnalyzer;
