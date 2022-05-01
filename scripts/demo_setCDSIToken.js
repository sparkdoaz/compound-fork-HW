const { ethers } = require("hardhat");
const hre = require("hardhat");
require('dotenv').config();
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

async function main() {
  console.log("將 cDSI 設定價格");
  const DSI = await ethers.getContractAt("DSIToken", process.env.DSIToken_Address);
  const cDSI = await ethers.getContractAt("CErc20Delegator", process.env.cDSIToken_Address);

  let comptroller = await ethers.getContractAt("contracts/Comptroller.sol:Comptroller", process.env.Comptroller_Address);
  const unitroller = await ethers.getContractAt("Unitroller", process.env.Unitroller_Address);  
  comptroller = comptroller.attach(unitroller.address)
  console.log(`attach unitroller`, comptroller.address)

  // 進入市場 
  await comptroller.enterMarkets([cDSI.address]);

  tx = await comptroller._setCollateralFactor(cDSI.address, ethers.utils.parseEther("0.8"));
  await tx.wait();
  console.log(`Set Collateral Factor: cDSI`)

  tx = await comptroller._setCloseFactor(ethers.utils.parseEther("0.5"));
  await tx.wait();
  console.log(`Set Close Factor`)

  tx = await cDSI._setReserveFactor(ethers.utils.parseEther('0.07'));
  await tx.wait();
  console.log(`Set Reserve Factor: cDSI `)
  
  let simplePriceOracle = await ethers.getContractAt("SimplePriceOracle", process.env.SimplePriceOracle_Address);
  tx = await simplePriceOracle.setUnderlyingPrice(cDSI.address, ethers.utils.parseEther("1")); // 1cDSI = 1 USD
  await tx.wait();

  let cDSIPrice = await simplePriceOracle.getUnderlyingPrice(cDSI.address);
  console.log(`cDSI/USD Price: ${cDSIPrice/(10**18)}`); //1

  tx = await comptroller._supportMarket(cDSI.address)
  await tx.wait()
  console.log(`support cDSI`)
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});
