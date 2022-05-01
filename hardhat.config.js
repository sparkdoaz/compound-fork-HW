/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require('dotenv').config();

const Rinkeby_PRIVATE_KEY = "要填寫";
const EtherScan_PRIVATE_KEY = "要填寫";
const INFURA_API_KEY = "要填寫"

module.exports = {

  solidity: {
    version: "0.5.16",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  defaultNetwork: 'localhost',
  networks: {
    hardhat: {
      forking: {
        url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
        blockNumber: 14646872
      },
      allowUnlimitedContractSize: true
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [`${Rinkeby_PRIVATE_KEY}`],
      allowUnlimitedContractSize: true
    },
    localhost: {
      url: 'http://localhost:8545',
      allowUnlimitedContractSize: true
    },
  },
  etherscan: {
    apiKey: process.env.EtherScan_PRIVATE_KEY
  }
};
