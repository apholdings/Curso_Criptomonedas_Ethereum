const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Uridium Token Tests", function () {
    let Token, uridiumToken, owner, addr1, addr2, pauser, minter;
    let maxSupply = ethers.parseEther("1005577");

    beforeEach(async function () {

        Token = await ethers.getContractFactory("UridiumToken");
        uridiumToken = await Token.deploy(maxSupply, "Uridium", "URI");
        
        [owner, addr1, addr2, pauser, minter] = await ethers.getSigners();
        
        await uridiumToken.grantRole(await uridiumToken.PAUSER_ROLE(), owner.address);
        await uridiumToken.grantRole(await uridiumToken.MINTER_ROLE(), owner.address);
    
        // Mint 100 tokens to owner
        const tokens = ethers.parseEther("100")
        await uridiumToken.connect(owner).mint(owner.address, tokens);
    });

    describe("Deployment", function () {
        it("should return the correct name", async function () {
          expect(await uridiumToken.name()).to.equal("Uridium");
        });
      
        it("should return the correct symbol", async function () {
          expect(await uridiumToken.symbol()).to.equal("URI");
        });
    });

    describe("Ownership", function () {
        it("Should set the right owner", async function () {
            expect(await uridiumToken.hasRole(await uridiumToken.DEFAULT_ADMIN_ROLE(), owner.address)).to.equal(true);
        });

        it("Should grant the pauser role to the pauser", async function () {
            expect(await uridiumToken.hasRole(await uridiumToken.PAUSER_ROLE(), owner.address)).to.equal(true);
        });

        it("Should grant the minter role to the minter", async function () {
            expect(await uridiumToken.hasRole(await uridiumToken.MINTER_ROLE(), owner.address)).to.equal(true);
        });
    });

    describe("AccessControl", function () { 
        it("Should allow the owner to grant roles", async function () {
            await uridiumToken.connect(owner).grantRole(await uridiumToken.PAUSER_ROLE(), pauser.address);
            expect(await uridiumToken.hasRole(await uridiumToken.PAUSER_ROLE(), pauser.address)).to.equal(true);
        });

        it("Should allow the owner to revoke roles", async function () {
            await uridiumToken.connect(owner).grantRole(await uridiumToken.PAUSER_ROLE(), pauser.address);
            await uridiumToken.connect(owner).revokeRole(await uridiumToken.PAUSER_ROLE(), pauser.address);
            expect(await uridiumToken.hasRole(await uridiumToken.PAUSER_ROLE(), pauser.address)).to.equal(false);

        });

        it("Should not allow the non owner to grant roles", async function () {
            await expect(
                uridiumToken.connect(addr1).grantRole(
                await uridiumToken.PAUSER_ROLE(), 
                addr2.address
                )
            ).to.be.revertedWith(
                /^AccessControl: account (0x[0-9a-f]{40}) is missing role (0x[0-9a-f]{64})$/
            );
            
            expect(await uridiumToken.hasRole(await uridiumToken.PAUSER_ROLE(), addr2.address)).to.equal(false);
        });

        it("Should not allow non-owners to revoke roles", async function () {
            await uridiumToken.connect(owner).grantRole(await uridiumToken.PAUSER_ROLE(), pauser.address);
            await expect(
                uridiumToken.connect(addr2).revokeRole(
                await uridiumToken.PAUSER_ROLE(),
                pauser.address
                )
            ).to.be.revertedWith(
                /^AccessControl: account (0x[0-9a-f]{40}) is missing role (0x[0-9a-f]{64})$/
            );
            expect(await uridiumToken.hasRole(await uridiumToken.PAUSER_ROLE(), pauser.address)).to.equal(true);
        });

    })

    describe("Max Supply", function () { 
        it(`should have a max supply of ${ethers.formatEther(maxSupply)} tokens`, async function () {
            const supply = await uridiumToken.maxSupply();
            const supplyInEther = ethers.formatEther(supply);
            
            expect(supplyInEther).to.equal(ethers.formatEther(maxSupply));
        });
        
        it("Should fail if minting more than max supply", async function () {
            let contractMaxSupply = await uridiumToken.maxSupply();
            contractMaxSupply = ethers.formatEther(contractMaxSupply);

            let ownerBalance = await uridiumToken.balanceOf(owner.address);
            ownerBalance = ethers.formatEther(ownerBalance);

            const totalToMint = contractMaxSupply - ownerBalance;

            // console.log(`
            // Contract Max Supply: ${contractMaxSupply},
            // Owner Balance: ${ownerBalance},
            // Total to Mint: ${totalToMint}
            // `);

            // Mint up to the max supply
            await uridiumToken.connect(owner).mint(owner.address, ethers.parseEther(totalToMint.toString()));

            // Try to mint more tokens than the max supply
            await expect(uridiumToken.connect(owner).mint(owner.address, 1))
            .to.be.revertedWith("Exceeds token max supply");
        });

        it("Should prevent transferring tokens to the zero address after max supply is reached", async function () {            
            // Try to transfer 1 token to the zero address
            await expect(
                uridiumToken.transfer("0x0000000000000000000000000000000000000000", 1)
            ).to.be.revertedWith("ERC20: transfer to the zero address");
        });
    });

    describe("Transactions", function () {
        it("Should transfer tokens between accounts", async function () {
            // Transfer 50 tokens from owner to addr1
            await uridiumToken.transfer(addr1.address, 50)

            // Verify transfer
            const addr1Balance = await uridiumToken.balanceOf(addr1.address);
            expect(addr1Balance).to.equal(50);
        });

        it("Should push tokens to another account", async function () {
            // Approve the contract to move owner's tokens
            await uridiumToken.connect(owner).approve(owner.address, ethers.parseEther("50"));

            // Push 50 tokens from owner to addr1
            await uridiumToken.connect(owner).push(addr1.address, ethers.parseEther("50"));

            // Verify transfer
            const addr1Balance = await uridiumToken.balanceOf(addr1.address);
            expect(addr1Balance.toString()).to.equal(ethers.parseEther("50").toString());
        });

        it("Should pull tokens from another account", async function () {
            
            // Approve the contract to move owner's tokens
            await uridiumToken.connect(owner).approve(owner.address, ethers.parseEther("50"));
            
            // Push 50 tokens from owner to addr1
            await uridiumToken.connect(owner).push(addr1.address, ethers.parseEther("50"));
            
            let addr1Balance = await uridiumToken.balanceOf(addr1.address);
            expect(addr1Balance.toString()).to.equal(ethers.parseEther("50").toString());
            
            // Approve the contract to move addr1's tokens
            await uridiumToken.connect(addr1).approve(owner.address, ethers.parseEther("50"));

            // Pull 50 tokens from addr1 to owner
            await uridiumToken.connect(owner).pull(addr1.address, ethers.parseEther("50"));

            // Verify transfer
            addr1Balance = await uridiumToken.balanceOf(addr1.address);
            expect(addr1Balance.toString()).to.equal("0");
        });

        it("Should move tokens between accounts", async function () {
            // Mint 50 tokens to addr1
            await uridiumToken.connect(owner).mint(addr1.address, ethers.parseEther("50"));

            // Approve the contract to move addr1's tokens
            await uridiumToken.connect(addr1).approve(owner.address, ethers.parseEther("50"));

            // Move 50 tokens from addr1 to addr2
            await uridiumToken.connect(owner).move(addr1.address, addr2.address, ethers.parseEther("50"));

            // Verify transfer
            const addr2Balance = await uridiumToken.balanceOf(addr2.address);
            expect(addr2Balance.toString()).to.equal(ethers.parseEther("50").toString());
        });

        it("Should fail if sender doesn't have enough tokens", async function () {
            const initialOwnerBalance = await uridiumToken.balanceOf(owner.address);
            // Try to send 1 token from addr1 (0 tokens) to owner (100 tokens).
            // 'require' will evaluate false and revert the transaction.
            await expect(
                uridiumToken.connect(addr1).transfer(owner.address, 1)
            ).to.be.revertedWith("ERC20: transfer amount exceeds balance");

            // Owner balance should not change.
            expect(await uridiumToken.balanceOf(owner.address)).to.equal(initialOwnerBalance);
        });

        it("Should update balances after transfers", async function () {
            // Mint 50 tokens to owner
            await uridiumToken.connect(owner).mint(owner.address, ethers.parseEther("50"));

            const initialOwnerBalance = await uridiumToken.balanceOf(owner.address);

            const tokensForAddr1 = ethers.parseEther("100");
            const tokensForAddr2 = ethers.parseEther("50");

            // console.log(`
            //     Initial Owner balance: ${initialOwnerBalance},
            //     Tokens for Address 1: ${tokensForAddr1},
            //     Tokens for Address 2: ${tokensForAddr2}
            // `);

            // Transfer tokens from owner to addr1 and addr2
            await uridiumToken.transfer(addr1.address, tokensForAddr1);
            await uridiumToken.transfer(addr2.address, tokensForAddr2);

            // Check balances
            const finalOwnerBalance = await uridiumToken.balanceOf(owner.address);
            expect(finalOwnerBalance).to.equal("0");
            
            const address1Balance = await uridiumToken.balanceOf(addr1.address);
            expect(address1Balance).to.equal(tokensForAddr1);

            const address2Balance = await uridiumToken.balanceOf(addr2.address);
            expect(address2Balance).to.equal(tokensForAddr2);
        });
    })

    // describe("Token", function() {
    //     it("Should prevent perform reentrancy attack", async function() {
    //         // Deploy malicious contract
    //         const MaliciousContract = await ethers.getContractFactory("MaliciousContract");
    //         const malicious = await MaliciousContract.deploy(owner.address);

    //         // Mint some tokens to the malicious contract
    //         await uridiumToken.connect(owner).mint(owner.address, ethers.parseEther('100'));

    //         // Try to perform reentrancy attack
    //         await expect(malicious.attack(owner.address, ethers.parseEther('10')))
    //             .to.be.revertedWith('ReentrancyGuard: reentrant call');
            
    //     });
    // });

});