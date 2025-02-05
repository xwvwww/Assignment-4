const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AITU_SE2315_AlmenAlnur", function () {
    let Token, token, owner, addr1, addr2;

    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();

        // Deploy the contract with the required constructor parameter
        Token = await ethers.getContractFactory("AITU_SE2315_AlmenAlnur");
        token = await Token.deploy(owner.address); // Pass owner's address
        await token.waitForDeployment(); // Corrected for Ethers v6
    });

    it("Should have correct initial supply", async function () {
        const totalSupply = await token.totalSupply();
        expect(totalSupply).to.equal(ethers.parseUnits("2000", 18));
    });

    it("Should transfer tokens successfully", async function () {
        await token.transfer(addr1.address, ethers.parseUnits("100", 18));
        const balance = await token.balanceOf(addr1.address);
        expect(balance).to.equal(ethers.parseUnits("100", 18));
    });

    it("Should return correct block timestamp", async function () {
        const blockTimestamp = await token.getBlockTimestamp();
        expect(blockTimestamp).to.be.a("bigint"); // Block timestamp should be a valid number
    });

    it("Should retrieve sender and receiver addresses", async function () {
        const [sender, receiver] = await token.getSenderAndReceiver(addr1.address);
        expect(sender).to.equal(owner.address);
        expect(receiver).to.equal(addr1.address);
    });
});
