const fabricConfig = require('./config');
const { Wallets } = require('fabric-network');
const path = require("path");
const fs = require("fs");
let gateway; 

const getWalletPath = () => {
    return path.resolve(__dirname,"../wallet")
}

const buildWallet = async () => {
	// Create a new  wallet : Note that wallet is for managing identities.
	let wallet;
    const walletPath = getWalletPath();
	if (fs.existsSync(walletPath)) {
		wallet = await Wallets.newFileSystemWallet(walletPath);
		console.log(`Built a file system wallet at ${walletPath}`);
	} else {
		wallet = await Wallets.newInMemoryWallet();
		console.log('Built an in memory wallet');
	}

	return wallet;
};

async function init() {
    let contract;
    
    try {
        const { Wallets } = require('fabric-network');
        const { Gateway } = require('fabric-network');
        const path = require('path');
        const fs = require('fs');
    
        const walletPath = path.join(process.cwd(), fabricConfig.walletFolder);

        const wallet = await buildWallet();
        gateway = new Gateway();

        const connectionProfilePath = path.resolve(__dirname, fabricConfig.connProfileFolder, fabricConfig.connProfile);

        const connectionProfile = JSON.parse(fs.readFileSync(connectionProfilePath, 'utf8'));

        console.log("identity", fabricConfig.walletFile);
        const connectionOptions = {
            wallet, identity: "admin", discovery:
                { enabled: false, asLocalhost: false }
        };
        console.log("connection option",connectionOptions);

        await gateway.connect(connectionProfile, connectionOptions);        

        const network = await gateway.getNetwork(fabricConfig.channelName);
        
        // Get the contract from the network.
        contract = network.getContract(fabricConfig.contractName);

        console.log('---------------------------- RESULT from backend server --------')

        return contract;
    } catch (error) {
        console.error('Failed to initialize transaction:', error);
        process.exit(1);
    }
}

async function getAllGiftCards() {
    const contract = await init();
    console.log("contract",contract);
    let result;
    try {
        result = await contract.submitTransaction('getAllGiftCards');
    } catch (error) {
        console.error('Failed to submit transaction in getAllGiftCards:', error);
        return '{"error": "' + error.message + '"}';
    } finally {
        await disconnectGateway();
    }
    console.log('result from chaincode = ' + result.toString());
    return JSON.parse(result.toString());
}

async function createGiftCard(issuer,name,balance) {
    const contract = await init();
    let result;
    try {
        result = await contract.submitTransaction('createGiftCard',issuer,name,balance);
    } catch (error) {
        console.error('Failed to submit transaction in createGiftCard:', error);
        return '{"error": "' + error.message + '"}';
    } finally {
        await disconnectGateway();
    }
    console.log('result from chaincode = ' + result.toString());
    return JSON.parse(result.toString());
}

async function transferGiftCard(newOwner) {
    const contract = await init();
    let result;
    try {
        result = await contract.submitTransaction('transferGiftCard','1',newOwner);
        //Change id
    } catch (error) {
        console.error('Failed to submit transaction in transferGiftCard:', error);
        return '{"error": "' + error.message + '"}';
    } finally {
        await disconnectGateway();
    }
    console.log('result from chaincode = ' + result.toString());
    return JSON.parse(result.toString());
}

async function redeemGiftCard(id) {
    const contract = await init();
    let result;
    try {
        result = await contract.submitTransaction('redeemGiftCard',id);
    } catch (error) {
        console.error('Failed to submit transaction in redeemGiftCard:', error);
        return '{"error": "' + error.message + '"}';
    } finally {
        await disconnectGateway();
    }
    console.log('result from chaincode = ' + result.toString());
    return JSON.parse(result.toString());
}

async function disconnectGateway() {
    gateway.disconnect();
}

module.exports = {
    getAllGiftCards: getAllGiftCards,
    createGiftCard: createGiftCard,
    transferGiftCard: transferGiftCard,
    redeemGiftCard: redeemGiftCard,
}