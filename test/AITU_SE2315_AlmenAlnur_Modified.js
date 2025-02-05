const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AITU_SE2315_AlmenAlnur_Modified", function () {
    let Token, token, owner, addr1, addr2;

    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();

        // Deploy the contract with `owner` as the contract owner
        Token = await ethers.getContractFactory("AITU_SE2315_AlmenAlnur");
        token = await Token.deploy(owner.address);
        await token.waitForDeployment();
    });

    it("Should set the correct contract owner", async function () {
        expect(await token.contractOwner()).to.equal(owner.address);
    });

    it("Should emit TransactionDetails event on transfer", async function () {
        const transferAmount = ethers.parseUnits("50", 18);

        // Ensure sender has enough balance
        await token.transfer(addr1.address, transferAmount);

        // Perform transfer and capture transaction receipt
        const tx = await token.connect(addr1).transferWithDetails(addr2.address, transferAmount);
        const receipt = await tx.wait();

        // Extract event logs
        const event = receipt.logs.find(log => log.eventName === "TransactionDetails");
        expect(event).to.not.be.undefined; // Ensure event was emitted

        // Extract event args
        const { sender, receiver, amount, timestamp } = event.args;

        // Assert sender, receiver, and amount (ignore exact timestamp)
        expect(sender).to.equal(addr1.address);
        expect(receiver).to.equal(addr2.address);
        expect(amount).to.equal(transferAmount);
        expect(timestamp).to.be.a("bigint"); // Ensure it's a valid timestamp
    });

    it("Should fail to transfer tokens if balance is insufficient", async function () {
        const largeAmount = ethers.parseUnits("5000", 18); // More than initial supply

        // Try transferring more than balance and check for revert
        await expect(token.connect(addr1).transferWithDetails(addr2.address, largeAmount))
            .to.be.reverted; // Allow generic revert handling
    });
});
