// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console2} from "forge-std/Script.sol";
import "../src/NFT.sol";

contract NFTScript is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("TEST_PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        NFT nft = new NFT();
        nft;
        vm.stopBroadcast();
    }
}
