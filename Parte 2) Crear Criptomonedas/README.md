# Como Crear una Criptomoneda

Es momento de programar nuestra primera criptomoneda. Para esto, vamos a utilizar la librería [OpenZeppelin](https://www.openzeppelin.com/), un recurso muy conocido y confiable en la comunidad de desarrollo de Ethereum. OpenZeppelin proporciona contratos inteligentes reutilizables y seguros que son ampliamente probados y auditados.

## Prerrequisitos

Antes de continuar, asegúrate de haber seguido la parte de configuración del proyecto, que puedes encontrar [aquí](https://github.com/apholdings/Curso_Criptomonedas_Ethereum/tree/main/Parte%201%29%20Configurar%20Hardhat).

## Instalación

Primero, debes instalar la librería OpenZeppelin en tu proyecto. Ejecuta el siguiente comando en tu terminal:

```bash
yarn add @openzeppelin/contracts
```

## Creando una Criptomoneda

Empezemos a codificar nuestra primera criptomoneda usando Solidity y OpenZeppelin.

* Paso 1. Crea un nuevo archivo en el directorio contracts llamado MyToken.sol.

```bash
touch contracts/MyToken.sol
```

* Paso 2. Abre el archivo MyToken.sol y escribe tu contrato inteligente con ayuda del [Wizard de OpenZeppellin](https://wizard.openzeppelin.com/).