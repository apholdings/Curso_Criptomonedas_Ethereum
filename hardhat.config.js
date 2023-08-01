require("nomicfoundation/hardat-toolbox");
require("dotenv").config()

module.exports = {
    solidity: "0.8.9",

    networks: {
        sepolia: {
            url: process.env.ETHEREUM_TESTNET_RPC,
            accounts: [process.env.PRIVATE_KEY]
        }
    },

    etherscan: {
        apiKey: process.env.POLYGONSCAN_API_KEY,
    },

    paths: {
        artifacts: './artifacts',
        cache: './cache',
        sources: './contracts',
        tests: './test',
    }
}