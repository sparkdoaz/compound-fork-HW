const { ethers } = require("hardhat");
const hre = require("hardhat");
const { BigNumber } = ethers;
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

async function main() {
    // Get contract owner address
    admin = (await ethers.getSigners())[0];
    console.log(`admin: ${admin.address}`);

    // 設定 Comptroller
    console.log('Deploying Unitroller');
    const Unitroller = await ethers.getContractFactory('Unitroller');
    const unitroller = await Unitroller.deploy();
    await unitroller.deployed();
    console.log(`Unitroller deployed: ${unitroller.address}`) 

    console.log('Deploying Comptroller');
    // 基本的
    const Comptroller = await ethers.getContractFactory('contracts/Comptroller.sol:Comptroller');
    // const Comptroller = await ethers.getContractFactory('ComptrollerG1');
    let comptroller = await Comptroller.deploy();
    await comptroller.deployed();
    console.log(`Comptroller deployed: ${comptroller.address}`) 

    // // Unitroller Proxy 設定
    tx = await unitroller._setPendingImplementation(comptroller.address)
    await tx.wait()
    console.log(`set comptroller`)
    tx = await comptroller._become(unitroller.address)
    await tx.wait()
    console.log(`set unitroller`)
    comptroller = comptroller.attach(unitroller.address)
    console.log(`attach unitroller`)

    // Deploy interest rate model
    /**
     * @notice Construct an interest rate model
     * @param baseRatePerYear The approximate target base APR, as a mantissa (scaled by 1e18)                                       ->  0
     * @param multiplierPerYear The rate of increase in interest rate wrt utilization (scaled by 1e18)                              ->  2102400 
     * @param jumpMultiplierPerYear The multiplierPerBlock after hitting a specified utilization point                              ->  0.2
     * @param kink_ The utilization point at which the jump multiplier is applied                                                   ->  0.8
     * @param owner_ The address of the owner, i.e. the Timelock contract (which has the ability to update parameters directly)     ->  admin.address
     */
     const InterestModel = await hre.ethers.getContractFactory("JumpRateModelV2");
    const interestModel = await InterestModel.deploy(0, 2102400, ethers.utils.parseEther("0.2"), ethers.utils.parseEther("0.8"), admin.address);
    await interestModel.deployed();
    console.log(`interestModel address: ${interestModel.address}`);

    // Deploy CETH
    /**
     * @notice Construct a new CEther money market                                                  
     * @param comptroller_ The address of the Comptroller                                           -> unitroller.address
     * @param interestRateModel_ The address of the interest rate model                             -> interestModel.address
     * @param initialExchangeRateMantissa_ The initial exchange rate, scaled by 1e18                -> ethers.utils.parseEther("1") 代表 1 ether 兌換 1cEth
     * @param name_ ERC-20 name of this token                                                       -> Compound ETH
     * @param symbol_ ERC-20 symbol of this token                                                   -> cETH
     * @param decimals_ ERC-20 decimal precision of this token                                      -> 8
     * @param admin_ Address of the administrator of this token                                     -> admin.address
     */
    const CETH = await hre.ethers.getContractFactory("CEther");
    const cEth = await CETH.deploy(unitroller.address, interestModel.address, ethers.utils.parseEther("1"), "Compound ETH", "cETH", 8, admin.address);
    await cEth.deployed();
    console.log('cETH address', cEth.address);
    
    // 設定 oracle
    // Deploy Chainlink Oracle Datafeed Client
    const ChainLinkPriceOracle = await hre.ethers.getContractFactory("ChainLinkPriceOracleV1");
    const chainLinkPriceOracle = await ChainLinkPriceOracle.deploy();
    await chainLinkPriceOracle.deployed();
    console.log(`price oracle deployed: ${chainLinkPriceOracle.address}`);
    await comptroller._setPriceOracle(chainLinkPriceOracle.address);
    console.log(`set price oracle`);

    // 設定 Chainlink 的位置 
    //  rinkeby ETH/USD  data feed 合約地址 0x8A753747A1Fa494EC906cE90E9f37563A8AF630e
    // await chainLinkPriceOracle._setEthAndUsdAggregators();

    let ethPrice = await chainLinkPriceOracle.getUnderlyingPrice(cEth.address);
    console.log(`ETH/USD Price: ${ethPrice}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});