require("nomicfoundation/hardat-toolbox");
require("dotenv").config()

module.exports = {
    solidity: "0.8.9",

    networks: {

    },

    etherscan: {

    },

    paths: {
        artifacts: './artifacts',
        cache: './cache',
        sources: './contracts',
        tests: './test',
    }
}