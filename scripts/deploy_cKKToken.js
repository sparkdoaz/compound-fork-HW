const { ethers } = require("hardhat");
const hre = require("hardhat");
require('dotenv').config();
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

// Ctoken CERC20
async function main() {
    console.log("Deploying cKKToken");
    const ERCDelegator = await ethers.getContractFactory("CErc20Delegator");

    const delegator = await ERCDelegator.deploy(
        '0xB322FDa44Ca06695d1DDbBdeb3e3a97ce0b455Be', //    kkToken.address
        process.env.Comptroller_Address, //    comptrollerAddress
        '0xf2d268b3b5568183409d364df0018202ff03b4a1', //    interestRateModelAddress,
        ethers.utils.parseUnits("1", 18),
        "Compound KKToken",
        "CKKT",
        8,                                            //    decimal
        '0x0ad8Dd1F4d25Fe01e908000e925A300771790293', //    admin
        '0x04703fFBde1C590B6461BB3799d592AEBB7dF876', //    delegate.address,
        0x00
    );

    await delegator.deployed();

    console.log("cKKToken deployed: ", delegator.address);
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});