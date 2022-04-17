const { ethers } = require("hardhat");
const hre = require("hardhat");
require('dotenv').config();
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

async function main() {
    // Get contract owner address
    admin = (await ethers.getSigners())[0]
    console.log(`admin: ${admin.address}`)

    console.log('Deploying Unitroller');
    const Unitroller = await ethers.getContractFactory('Unitroller');
    const unitroller = await Unitroller.deploy();
    await unitroller.deployed();
    console.log(`Unitroller deployed: ${unitroller.address}`) 

    console.log('Deploying Comptroller');
    const Comptroller = await ethers.getContractFactory('ComptrollerG1');
    const comptroller = await Comptroller.deploy();
    await comptroller.deployed();
    console.log(`Comptroller deployed: ${comptroller.address}`) 

    // 利率模型
    console.log('Deploying InterestRateModel');
    const InterestRateModel = await ethers.getContractFactory('WhitePaperInterestRateModel');
    const interestRateModel = await InterestRateModel.deploy(1, 1);
    await interestRateModel.deployed();
    console.log(`InterestRateModel deployed: ${interestRateModel.address}`) 

    console.log('Deploying Oracle');
    const Oracle = await ethers.getContractFactory('SimplePriceOracle');
    const oracle = await Oracle.deploy();
    await oracle.deployed();
    console.log('Oracle deployed: ', oracle.address);

    // Ctoken CEther
    console.log('Deploying Ctoken ETH');
    const CToken_Eth = await ethers.getContractFactory('CEther');
    const cToken_Eth = await CToken_Eth.deploy(
        comptroller.address,
        interestRateModel.address, 
        '1',
        'CEther',
        'cETH',
        20,
        '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266' // account[0]
    );
    await cToken_Eth.deployed()
    console.log('Ctoken Eth deployed: ', cToken_Eth.address);

    // Ctoken CERC20
    console.log('Deploying CERC20_Spark');
    const ERC_20 = await ethers.getContractFactory('CErc20');
    const sparkToken = await ERC_20.deploy();
    await sparkToken.deployed();
    console.log('Spark Toekn deployed: ', sparkToken.address);

    console.log('Deploying ERC20Delegate & ERCDelegator');
    const ERCDelegate = await ethers.getContractFactory('CErc20Delegate');
    const ERCDelegator = await ethers.getContractFactory('CErc20Delegator');
    const delegate = await ERCDelegate.deploy();
    const delegator = await ERCDelegator.deploy(
        sparkToken.address,
        comptroller.address,
        interestRateModel.address,
        5,
        'CSPARK',
        'cSpark',
        8,
        '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', // account[0]
        delegate.address,
        '0x00'
    );
    
    console.log('Delegate deployed: ', delegate.address);
    console.log('Delegator deployed: ', delegator.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});