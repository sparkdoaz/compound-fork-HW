const { ethers } = require("hardhat");
const hre = require("hardhat");
require('dotenv').config();
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

async function main() {
    // Get contract owner address
    admin = (await ethers.getSigners())[0]

    const cKKToken = await ethers.getContractAt("CErc20Delegator", process.env.cKKToken_Address);
    const KKToken = await ethers.getContractAt("KKToken", process.env.KKToken_Address);

    let admin_balance = await KKToken.balanceOf(admin.address)
    console.log(`KKToken balance before redeem: ${admin_balance}`);

    // Redeem cKKToken
    tx = await cKKToken.redeemUnderlying(ethers.utils.parseEther('0.1'))
    await tx.wait()
    console.log(`redeem 0.1 KKToken`)

    admin_balance = await KKToken.balanceOf(admin.address)
    console.log(`KKToken balance after redeem: ${admin_balance}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});