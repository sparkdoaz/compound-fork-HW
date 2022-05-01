const { ethers } = require("hardhat");
const hre = require("hardhat");
require('dotenv').config();
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

// Ctoken CERC20
async function main() {
    console.log('Deploying DSI');
    const ERC_20DSIToken = await ethers.getContractFactory('DSIToken');
    const dsi = await ERC_20DSIToken.deploy(ethers.utils.parseEther('50000000000000'));
    await dsi.deployed();
    console.log('dsi deployed: ', dsi.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});