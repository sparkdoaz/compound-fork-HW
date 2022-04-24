pragma solidity ^0.5.16;

import "./PriceOracle.sol";
import "./CErc20.sol";
import "@chainlink/contracts/src/v0.5/interfaces/AggregatorV3Interface.sol";

contract ChainLinkPriceOracleV1 is PriceOracle {
    mapping(address => uint) prices;
    event PricePosted(address asset, uint previousPriceMantissa, uint requestedPriceMantissa, uint newPriceMantissa);

    /// @notice ChainLink token address & datafeed address
    mapping(address => address) public aggregators;

    function _getUnderlyingAddress(CToken cToken) private view returns (address) {
        address asset;
        if (compareStrings(cToken.symbol(), "cETH")) {
            asset = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;
        } else {
            asset = address(CErc20(address(cToken)).underlying());
        }
        return asset;
    }

    function getUnderlyingPrice(CToken cToken) public view returns (uint) {
        address underlyingToken = _getUnderlyingAddress(cToken);
        return _getPriceFromChainlink(aggregators[underlyingToken]);
    }

    function getDataFeedAddr(CToken cToken) public view returns (address) {
        address underlyingToken = _getUnderlyingAddress(cToken);
        return aggregators[underlyingToken];
    }

    /**
     * @notice Get price from ChainLink, quote is ETH
     * @param datafeed The base/quote token that ChainLink aggregator gets the price of
     * @return The price, scaled by 1e18
     */
    function _getPriceFromChainlink(address datafeed) public view returns (uint256) {
        (, int256 price, , , ) = AggregatorV3Interface(0x8A753747A1Fa494EC906cE90E9f37563A8AF630e).latestRoundData();
        require(price > 0, "invalid price");
        return uint256(price) * 10**10;
    }

    function _setEthAndUsdAggregators() external {
        aggregators[0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE] = 0x8A753747A1Fa494EC906cE90E9f37563A8AF630e;
    }

    function setUnderlyingPrice(CToken cToken, uint underlyingPriceMantissa) public {
        address asset = _getUnderlyingAddress(cToken);
        emit PricePosted(asset, prices[asset], underlyingPriceMantissa, underlyingPriceMantissa);
        prices[asset] = underlyingPriceMantissa;
    }

    // // v1 price oracle interface for use as backing of proxy
    function assetPrices(address asset) external view returns (uint) {
        return prices[asset];
    }

    function compareStrings(string memory a, string memory b) internal pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }
}