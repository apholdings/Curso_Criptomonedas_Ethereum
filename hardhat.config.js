require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ethers");
require("@nomicfoundation/hardhat-chai-matchers");
require("dotenv").config()

module.exports = {
    solidity: "0.8.9",

    networks: {
        sepolia: {
            url: process.env.ETHEREUM_SEPOLIA_TESTNET_RPC,
            accounts: [process.env.PRIVATE_KEY]
        }
    },

    etherscan: {
        apiKey: {
            sepolia: process.env.ETHERSCAN_API_KEY
        }
    },

    paths: {
        artifacts: './artifacts',
        cache: './cache',
        sources: './contracts',
        tests: './test',
    }
}