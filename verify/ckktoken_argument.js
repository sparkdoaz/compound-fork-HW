const { ethers } = require("hardhat");

module.exports = [
    '0xB322FDa44Ca06695d1DDbBdeb3e3a97ce0b455Be', //    kkToken.address
    '0xa7632adA59375EffE7191f91f90e89113Ae80240', //    comptrollerAddress
    '0xf2d268b3b5568183409d364df0018202ff03b4a1', //    interestRateModelAddress,
    ethers.utils.parseUnits("1", 18),
    "Compound KKToken",
    "CKKT",
    8,                                            //    decimal
    '0x0ad8Dd1F4d25Fe01e908000e925A300771790293', //    admin
    '0x04703fFBde1C590B6461BB3799d592AEBB7dF876', //    delegate.address,
    0x00
];