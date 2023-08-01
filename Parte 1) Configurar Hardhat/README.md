# Como Configurar Hardhat

Ahora aprenderemos a crear contratos inteligentes, probarlos y desplegarlos en hardhat. Primero debemos familiarizarnos con el lenguaje de programacion de los contratos inteligentes Solidity.

## Requisitos previos

Necesitaras haber seguido la parte de configuracion de este proyecto que puedes encontrar [aqui](https://github.com/apholdings/Curso_Criptomonedas_Ethereum)

# Que necesitaras

Primero debemos obtener la clave privada de la cuenta de metamask que deseamos usar para desplegar nuestros contratos. Este sera el owner inicial de los contratos y podra interactuar con ellos con todos los permisos.

* ### Paso 1. Obtener Private Key de la cuenta de metamask
* ### Paso 2. Escribir Private Key en archivo .env

```javascript
// .env
PRIVATE_KEY="123abc"
```

* ### Paso 3. Obtener Ethereum RPC usando Alchemy.

Ahora debemos acceder a [Alchemy](https://alchemy.com) y conseguir nuestro Ethereum RPC. Esta es la clave que permite ejecutar comandos y comunicarnos con el EVM. Alchemy es nuestro puente.

```javascript
// .env
PRIVATE_KEY="123abc"
ETHEREUM_TESTNET_RPC="x123qwer"
```

* ### Paso 4. Obtener clave API de Etherscan

Accede a tu cuenta de [Etherscan](https://etherscan.io/login) y visita el area de API Keys. Crea una clave api y agregala al archivo .env

```javascript
// .env
PRIVATE_KEY="123abc"
ETHEREUM_TESTNET_RPC="x123qwer"
ETHERSCAN_API_KEY="HX6BZQ7PBA674ZF4I234MMIDMCCNRW4CW5"
```

* ### Paso 5. Conectar archivo .env con hardhat.config.js

```javascript
require("nomicfoundation/hardat-toolbox");
require("dotenv").config()

module.exports = {
    solidity: "0.8.9",

    networks: {
        goerli: {
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
```

* ### Paso 6. Conseguir GoerliETH

Ahora debemos entrar a este [faucet](https://goerli-faucet.pk910.de/) de goerliEth y minar la criptomoneda por un rato. Para obtener la recompensa debemos poner la direccion de cuenta que usaremos.

Tambien podemos usar el [Sepolia faucet](https://sepoliafaucet.com) de alchemy si es que deseamos usar ese network en lugar de goerli.