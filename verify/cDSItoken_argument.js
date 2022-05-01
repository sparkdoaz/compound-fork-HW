const { ethers } = require("hardhat");

module.exports = [
    '0xc648Cf0209EC1Eb580F0fc3224106d715dDfAa54', //    DSIToken.address
    '0x6f4A7706dCe4498325268dF5D17dCB33D8c8521B', //    comptrollerAddress
    '0xf2d268b3b5568183409d364df0018202ff03b4a1', //    interestRateModelAddress,
    ethers.utils.parseUnits("1", 18),
    "Compound DSIToken",
    "CDSI",
    18,                                            //    decimal
    '0x0ad8Dd1F4d25Fe01e908000e925A300771790293', //    admin
    '0x04703fFBde1C590B6461BB3799d592AEBB7dF876', //    delegate.address,
    0x00
];