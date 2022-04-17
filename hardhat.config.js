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
  solidity: "0.5.16",
  settings: {
    optimizer: {
      enabled: true,
      runs: 2000
    }
  },
  defaultNetwork: 'localhost',
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [`${Rinkeby_PRIVATE_KEY}`]
    },
    localhost: {
      url: 'http://localhost:8545',
      allowUnlimitedContractSize: true
    },
    
  },
  etherscan: {
    apiKey: EtherScan_PRIVATE_KEY
  }
};
