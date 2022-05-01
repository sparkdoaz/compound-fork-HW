const { ethers } = require("hardhat");
const hre = require("hardhat");
const { BigNumber } = ethers;
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

async function main() {
    console.log('Deploying CErc20Delegate');
    const ERCDelegate = await ethers.getContractFactory('CErc20Delegate');
    const delegate = await ERCDelegate.deploy();
    await delegate.deployed();
    console.log(`ERCDelegate deployed: ${delegate.address}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});