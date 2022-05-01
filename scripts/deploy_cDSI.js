const { ethers } = require("hardhat");
const hre = require("hardhat");
require('dotenv').config();
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

// Ctoken CERC20
async function main() {
    console.log("Deploying cDSI");
    const ERCDelegator = await ethers.getContractFactory("CErc20Delegator");

    const delegator = await ERCDelegator.deploy(
        process.env.DSIToken_Address,                   //    DSIToken.address
        process.env.Unitroller_Address,                 //    comptrollerAddress
        process.env.WhitePaperInterestRateModel_Address,   //    interestRateModelAddress,
        ethers.utils.parseUnits("1", 18),               // 兌換率
        "Compound DSIToken",
        "CDSI",
        18,                                             //    decimal
        process.env.admin_account,                      //    admin
        process.env.CErc20Delegate_Address,             //    delegate.address,
        0x00
    );

    await delegator.deployed();

    console.log("cDSI deployed: ", delegator.address);
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});