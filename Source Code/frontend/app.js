const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");

const tokenABI = [ /* Write here your TokenABI */ ];
const tokenAddress = ""; // Write here tokenAdress
const tokenContract = new web3.eth.Contract(tokenABI, tokenAddress);

const marketplaceABI = [ /* Write here your MarketplaceABI */ ];
const marketplaceAddress = ""; // Wrire here martkeplaceAdress
const marketplaceContract = new web3.eth.Contract(marketplaceABI, marketplaceAddress);

let userAccount;

// Connect MetaMask
async function connectMetaMask() {
    if (window.ethereum) {
        try {
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            userAccount = accounts[0];
            console.log("Connected Account:", userAccount);
            document.getElementById("userWallet").innerText = `Connected: ${userAccount}`;
            await displayTokenBalance();
        } catch (error) {
            console.error("User rejected request", error);
        }
    } else {
        alert("Please install MetaMask.");
    }

    console.log("Token Contract Address:", tokenContract.options.address);
console.log("Marketplace Contract Address:", marketplaceContract.options.address);

     

}
document.getElementById("connectWalletButton").onclick = connectMetaMask;

// Display Token Balance
async function displayTokenBalance() {
    if (!userAccount) return;
    const balance = await tokenContract.methods.balanceOf(userAccount).call();
    document.getElementById("tokenBalance").innerText = `Your Token Balance: ${web3.utils.fromWei(balance, 'ether')} AI-Tokens`;
    
}
document.getElementById("refreshBalanceButton").onclick = displayTokenBalance;

// List a Model
document.getElementById("listForm").onsubmit = async (event) => {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const description = document.getElementById("description").value;
    const price = web3.utils.toWei(document.getElementById("price").value, 'ether');
    
    await marketplaceContract.methods.listModel(name, description, price).send({ from: userAccount });
    alert('Model listed successfully!');
    loadModels(); // Refresh the available models list
};


async function loadModels() {
    const modelCount = await marketplaceContract.methods.modelCount().call();
    const modelList = document.getElementById("modelList");
    modelList.innerHTML = ""; // Clear previous entries

    for (let i = 1; i <= modelCount; i++) {
        const model = await marketplaceContract.methods.models(i).call();
        
        if (!model.sold) {  // Display only unsold models
            const listItem = document.createElement("li");
            listItem.innerHTML = `
    <strong>${model.name}</strong> - ${model.description} <br>
    Price: ${web3.utils.fromWei(model.price, 'ether')} AI-Tokens <br>
    <button onclick="purchaseModel(${model.id}, '${model.price}')">Buy</button>
`;
            modelList.appendChild(listItem);
        }
    }
}

// Load models when the page loads
window.onload = loadModels;


async function checkBalanceBeforePurchase(price) {
    const accounts = await web3.eth.getAccounts();
    const balance = await tokenContract.methods.balanceOf(accounts[0]).call();
    console.log("Balance:", balance);

}



async function purchaseModel(modelId, price) {
    try {
        if (!window.ethereum) {
            alert("MetaMask is not installed. Please install it to proceed.");
            return;
        }

        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        if (accounts.length === 0) {
            alert("No accounts found. Please connect your wallet.");
            return;
        }
        

        const buyer = accounts[0];
        console.log("Purchasing model with ID:", modelId, "Price:", price, "Buyer:", buyer);

        const priceInWei = price.toString();
        console.log("Price in Wei:", priceInWei);

        // ✅ Check buyer's token balance
        const buyerBalance = await tokenContract.methods.balanceOf(buyer).call();
        console.log("Buyer Token Balance (Wei):", buyerBalance);

        if (web3.utils.toBN(buyerBalance).lt(web3.utils.toBN(priceInWei))) {
            alert("Insufficient token balance! You need more tokens to purchase this model.");
            return;
        }

        

        // ✅ Check token allowance (Ensure it's reasonable)
        let allowance = await tokenContract.methods.allowance(buyer, marketplaceAddress).call();
        console.log("Allowance in Wei:", allowance);

        if (web3.utils.toBN(allowance).lt(web3.utils.toBN(priceInWei))) {
            console.log("Insufficient allowance. Approving marketplace...");

            await tokenContract.methods.approve(marketplaceAddress, priceInWei).send({
                from: buyer,
                gas: 500000 // Manually set gas limit
            });

            console.log("Approval successful!");

            // ✅ Fetch updated allowance
            allowance = await tokenContract.methods.allowance(buyer, marketplaceAddress).call();
            console.log("Updated Allowance in Wei:", allowance);
        } else {
            console.log("Sufficient allowance available. No need to approve.");
        }

        // ✅ Purchase the model (Increase gas limit)
        console.log("Sending transaction to purchase model...");

        await marketplaceContract.methods.purchaseModel(modelId).send({
            from: buyer,
            gas: 500000 // Manually setting gas
        });

        console.log("Purchase successful!");
        alert("Purchase successful!");
        location.reload();
    } catch (error) {
        console.error("Error purchasing model:", error);

        // ✅ Extract useful error messages
        if (error?.data?.message) {
            alert("Purchase failed: " + error.data.message);
        } else if (error?.message) {
            alert("Purchase failed: " + error.message);
        } else {
            alert("Purchase failed: Check console for details.");
        }
    }
}





// Display Token Balance
async function displayTokenBalance() {
    if (!userAccount) {
        console.error("User account not set.");
        return;
    }
    try {
        const balance = await tokenContract.methods.balanceOf(userAccount).call();
        console.log("Raw Token Balance:", balance);
        const formattedBalance = web3.utils.fromWei(balance, 'ether');
        console.log("Formatted Token Balance:", formattedBalance);
        document.getElementById("tokenBalance").innerText = `Your Token Balance: ${formattedBalance} AI-Tokens`;
    } catch (error) {
        console.error("Error fetching token balance:", error);
    }

    const accounts = await web3.eth.getAccounts();
const balance = await tokenContract.methods.balanceOf(accounts[0]).call();
console.log("Balance:", balance);


const marketplaceAddress = "0xda4464d9f7b9e82fa31bd70c9e9eec8e81f7a1e2";  
const allowance = await tokenContract.methods.allowance(accounts[0], marketplaceAddress).call();
console.log("Allowance:", allowance);

await tokenContract.methods.approve(marketplaceAddress, "2000000000000000000000").send({ from: accounts[0] });


}




