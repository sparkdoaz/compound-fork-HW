const { ethers } = require("hardhat");
const hre = require("hardhat");
require('dotenv').config();
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

async function main() {
    let comptroller = await ethers.getContractAt("contracts/Comptroller.sol:Comptroller", process.env.Comptroller_Address);
    const unitroller = await ethers.getContractAt("Unitroller", process.env.Unitroller_Address);  
    comptroller = comptroller.attach(unitroller.address)
    console.log(`attach unitroller`)

    console.log(comptroller.address)
    let market = await comptroller.getAllMarkets();
    console.log(`getAllMarkets`, market)
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});