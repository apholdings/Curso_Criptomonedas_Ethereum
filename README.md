# Curso de Solidity para Crear Criptomonedas y NFTs

Este curso te guiará en el proceso de creación de criptomonedas y NFTs utilizando Solidity, el lenguaje de programación para la red Ethereum.

## Requisitos previos

Necesitarás tener Node.js y yarn instalados en tu equipo. Si aún no los tienes, puedes descargar Node.js desde [aquí](https://nodejs.org/en/download/) e instalar yarn con el siguiente comando:

```bash
npm install --global yarn
```

## Configuración del entorno

Para empezar, necesitamos configurar nuestro entorno de desarrollo. Vamos a utilizar [Hardhat](https://hardhat.org/), una herramienta de desarrollo de Ethereum muy popular.

## Instalación de Hardhat y otras dependencias

Primero, debes inicializar un nuevo proyecto de yarn con el siguiente comando:

```bash
yarn init
```

```bash
yarn add -D hardhat dotenv
```

También necesitamos algunas herramientas adicionales que facilitarán nuestro desarrollo. Las instalaremos con los siguientes comandos:

```bash
yarn add -D @nomicfoundation/hardhat-toolbox
```

## Creación del archivo hardhat.config.js

Una vez que tengamos todas nuestras dependencias instaladas, necesitamos crear un archivo de configuración para Hardhat. Crea un archivo llamado hardhat.config.js en la raíz de tu proyecto con el siguiente contenido:

```javascript
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

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
};
```

Y con eso, ¡tu entorno de desarrollo está listo! Ahora puedes empezar a escribir tus contratos inteligentes en Solidity.