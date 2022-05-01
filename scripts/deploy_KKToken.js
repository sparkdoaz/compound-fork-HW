const { ethers } = require("hardhat");
const hre = require("hardhat");
require('dotenv').config();
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

// Ctoken CERC20
async function main() {
    console.log('Deploying KKToken');
    const ERC_20SPToken = await ethers.getContractFactory('KKToken');
    const kkToken = await ERC_20SPToken.deploy(ethers.utils.parseEther('10000000000000'));
    await kkToken.deployed();
    console.log('KKToekn deployed: ', kkToken.address);
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});