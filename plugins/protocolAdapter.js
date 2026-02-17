import { ethers } from 'ethers';

class ZenythProtocolPlugin {
  constructor(rpcUrl, protocolConfig) {
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.config = protocolConfig;
  }

  async fetchAPY(protocolName) {
    try {
      switch (protocolName) {
        case 'venus':
          return await this.fetchVenusAPY();
        case 'pancake':
          return await this.fetchPancakeAPY();
        case 'lista':
          return await this.fetchListaAPY();
        case 'kernel':
          return await this.fetchKernelAPY();
        default:
          return 0;
      }
    } catch (error) {
      console.error(`Zenyth: Error fetching ${protocolName} APY:`, error.message);
      return this.getMockAPY(protocolName);
    }
  }

  async fetchVenusAPY() {
    const comptroller = new ethers.Contract(
      this.config.venus.comptroller,
      ['function markets(address) view returns (bool, uint256, bool)'],
      this.provider
    );
    
    const marketData = await comptroller.markets(this.config.venus.vBNB);
    const supplyRate = Number(marketData[1]) / 1e18;
    const blocksPerYear = 10512000;
    return (supplyRate * blocksPerYear * 100).toFixed(2);
  }

  async fetchPancakeAPY() {
    return this.getMockAPY('pancake');
  }

  async fetchListaAPY() {
    return this.getMockAPY('lista');
  }

  async fetchKernelAPY() {
    return this.getMockAPY('kernel');
  }

  getMockAPY(protocol) {
    const mockAPYs = {
      venus: 8.5 + Math.random() * 2,
      pancake: 12.3 + Math.random() * 3,
      lista: 9.8 + Math.random() * 2.5,
      kernel: 11.2 + Math.random() * 2.8
    };
    return mockAPYs[protocol] || 5;
  }

  async getAllAPYs() {
    const protocols = ['venus', 'pancake', 'lista', 'kernel'];
    const apys = {};
    
    for (const protocol of protocols) {
      apys[protocol] = await this.fetchAPY(protocol);
    }
    
    return apys;
  }
}

export default ZenythProtocolPlugin;
