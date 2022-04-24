const { ethers } = require("hardhat");
const hre = require("hardhat");
const { BigNumber } = ethers;
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

async function main() {
    console.log('Deploying InterestRateModel');
    const InterestRateModel = await ethers.getContractFactory('WhitePaperInterestRateModel');
    const interestRateModel = await InterestRateModel.deploy(ethers.utils.parseEther("1"), ethers.utils.parseEther("1"));
    await interestRateModel.deployed();
    console.log(`InterestRateModel deployed: ${interestRateModel.address}`) 
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});