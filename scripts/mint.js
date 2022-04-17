const { ethers } = require("hardhat");
const hre = require("hardhat");
require('dotenv').config();
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

async function main() {

    console.log('添加 Comptroller');
    const Comptroller = await ethers.getContractFactory('ComptrollerG1');
    const comptroller = await Comptroller.attach('0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512');

    console.log('添加 Interestmodel');
    const WhitePaperInterestRateModel = await ethers.getContractFactory('WhitePaperInterestRateModel');
    const interestRateModel = await WhitePaperInterestRateModel.attach(
      '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0' // deployed address
    );

    console.log('添加 price oracle...');
    const SimplePriceOracle = await ethers.getContractFactory(
      'SimplePriceOracle'
    );
    const oracle = await SimplePriceOracle.attach('0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9');

    console.log('添加 CEther');
    const CEther = await ethers.getContractFactory('CEther');
    const cEther = await CEther.attach('0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9');

    console.log('添加 CSPARK');
    const CSPARK = await ethers.getContractFactory('CErc20');
    const cSpark = await CSPARK.attach('0x5FC8d32690cc91D4c39d9d3abcBD16989F875707');

    console.log('添加 cSPARK delegate');
    const Delegate = await ethers.getContractFactory('CErc20Delegate');
    const delegate = await Delegate.attach('0x0165878A594ca255338adfa4d48449f69242Eb8F');

    console.log('添加 cSPARK delegator');
    const Delegator = await ethers.getContractFactory('CErc20Delegator');
    const delegator = await Delegator.attach('0xa513E6E4b8f2a923D98304ec87F64353C4D5C853');

    console.log('設定 price oracle...');
    await comptroller._setPriceOracle('0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9');
    console.log('設定 close factor...');
    await comptroller._setCloseFactor(5);
    console.log('設定 max assets...');
    await comptroller._setMaxAssets(12);
    console.log('設定 liquidation incentive...');
    await comptroller._setLiquidationIncentive(11);

    console.log('\n');

    const tokensAddresses = {
        cEther: '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
        cSpark: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
    }

    Object.entries(tokensAddresses).forEach(
      async ([cTokenName, cTokenAddress]) => {
        console.log('支援的 cToken: ', cTokenName);
        await comptroller._setCollateralFactor(cTokenAddress, 9);
        await comptroller._supportMarket(cTokenAddress);
      }
    );
    console.log('\n');
    await comptroller.enterMarkets(Object.values(tokensAddresses));

    //第一個帳號
    const account = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266'
    let value = await cEther.balanceOf(account);
    console.log('現在帳號1有多少CEth: ', value);
    console.log('mint cEther給帳號1', account, '...');
    await cEther.mint({ value: 100000 });
    value = await cEther.balanceOf(account);
    console.log('現在帳號1有多少CEth: ', value);
    console.log('結束');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});