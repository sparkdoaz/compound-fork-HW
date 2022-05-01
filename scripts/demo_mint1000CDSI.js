const { ethers } = require("hardhat");
const hre = require("hardhat");
require('dotenv').config();
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

async function main() {
    const [addr1, addr4] = await ethers.getSigners();

    const cDSI = await ethers.getContractAt("CErc20Delegator", process.env.cDSIToken_Address);
    const DSI = await ethers.getContractAt("DSIToken", process.env.DSIToken_Address);


    // addr4 mint 1000 cDSI
    let admin_balance = await DSI.balanceOf(addr4.address)
    let admin_balance_c = await cDSI.balanceOf(addr4.address)
    console.log(`DSI balance before mint: ${admin_balance} at ${addr4.address}`);
    console.log(`cDSI balance before mint: ${admin_balance_c} at ${addr4.address}`);

    // approve
    tx = await DSI.connect(addr4).approve(cDSI.address, ethers.utils.parseEther('10000000'));
    await tx.wait()
    console.log(`Approve cDSI delegator to transfer from account`)

    // Mint cKKToken
    tx = await cDSI.connect(addr4).mint(ethers.utils.parseEther("1000"))
    await tx.wait()
    console.log(`mint 1000 cKKToken at ${addr4.address}`)

    admin_balance = await DSI.balanceOf(addr4.address)
    admin_balance_c = await cDSI.balanceOf(addr4.address)
    console.log(`DSI balance after mint: ${admin_balance} at ${addr4.address}`);
    console.log(`cDSI balance after mint: ${admin_balance_c} at ${addr4.address}`);

    // addr1 mint 1000 cDSI
    let add1_balance = await DSI.balanceOf(addr1.address)
    let add1_balance_c = await cDSI.balanceOf(addr1.address)
    console.log(`DSI balance before mint: ${add1_balance} at ${addr1.address}`);
    console.log(`cDSI balance before mint: ${add1_balance_c} at ${addr1.address}`);

    // approve
    tx = await DSI.connect(addr1).approve(cDSI.address, ethers.utils.parseEther('10000000'));
    await tx.wait()
    console.log(`Approve cDSI delegator to transfer from account`)

    // Mint cKKToken
    tx = await cDSI.connect(addr1).mint(ethers.utils.parseEther("1000"))
    await tx.wait()
    console.log(`mint 1000 cKKToken at ${addr1.address}`)

    add1_balance = await DSI.balanceOf(addr1.address)
    add1_balance_c = await cDSI.balanceOf(addr1.address)
    console.log(`DSI balance after mint: ${add1_balance} at ${addr1.address}`);
    console.log(`cDSI balance after mint: ${add1_balance_c} at ${addr1.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});