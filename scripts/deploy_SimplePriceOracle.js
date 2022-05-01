const { ethers } = require("hardhat");
const hre = require("hardhat");
require('dotenv').config();
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

async function main() {
    console.log("Deploying SimplePriceOracle");

    // Deploy price oracle
    const SimplePriceOracle = await ethers.getContractFactory("SimplePriceOracle");
    const simplePriceOracle = await SimplePriceOracle.deploy();
    await simplePriceOracle.deployed();

    console.log(`price oracle deployed: ${simplePriceOracle.address}`)

    // Set price oracle in comptroller
    let comptroller = await ethers.getContractAt("contracts/Comptroller.sol:Comptroller", process.env.Comptroller_Address);
    const unitroller = await ethers.getContractAt("Unitroller", process.env.Unitroller_Address);
    comptroller = comptroller.attach(unitroller.address)
    tx = await comptroller._setPriceOracle(simplePriceOracle.address)
    await tx.wait()

    console.log(`set price oracle`)

    let oracle = await comptroller.oracle();
    console.log(`oracle`, oracle)
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});