const FabricCAServices = require("fabric-ca-client");
const { Wallets } = require('fabric-network');
const path = require("path");
const fs = require("fs");

exports.getWalletPath = () => {
    return path.resolve(__dirname,"../wallet")
}

exports.buildCCPOrg = (orgName) => {
	// load the common connection configuration file
	const ccpPath = path.resolve(__dirname, '../gateway', `connection-${orgName.toLowerCase()}.json`);
	const fileExists = fs.existsSync(ccpPath);
	if (!fileExists) {
		throw new Error(`no such file or directory: ${ccpPath}`);
	}
	const contents = fs.readFileSync(ccpPath, 'utf8');

	// build a JSON object from the file contents
	const ccp = JSON.parse(contents);

	console.log(`Loaded the network configuration located at ${ccpPath}`);
	return ccp;
};

exports.buildCAClient = (orgId) => {
    const ccp = module.exports.buildCCPOrg(orgId)
	const caInfo = ccp.certificateAuthorities[`ca.${orgId.toLowerCase()}.example.com`]; //lookup CA details from config
	const caTLSCACerts = caInfo.tlsCACerts.pem;
	const caClient = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

	console.log(`Built a CA Client named ${caInfo.caName}`);
	return caClient;
};

exports.buildWallet = async () => {
	// Create a new  wallet : Note that wallet is for managing identities.
	let wallet;
    const walletPath = module.exports.getWalletPath();
	if (fs.existsSync(walletPath)) {
		wallet = await Wallets.newFileSystemWallet(walletPath);
		console.log(`Built a file system wallet at ${walletPath}`);
	} else {
		wallet = await Wallets.newInMemoryWallet();
		console.log('Built an in memory wallet');
	}

	return wallet;
};

exports.getMSPId=function(orgId){
    return `${orgId.charAt(0).toUpperCase()}${orgId.slice(1)}MSP`;
}

exports.enrollAdmin = async function (orgId) {
  try {
    // Building a CA Client
    const caClient = module.exports.buildCAClient(orgId);

    // Retirving the wallet object
    const wallet = await module.exports.buildWallet();
    const orgMspId = module.exports.getMSPId(orgId);

    // Check to see if we've already enrolled the admin user.
    const identity = await wallet.get("admin");
    if (identity) {
      console.log(
        "An identity for the admin user already exists in the wallet"
      );
      return;
    }

    // Enroll the admin user, and import the new identity into the wallet.
    const enrollment = await caClient.enroll({
      enrollmentID: "admin",
      enrollmentSecret: "adminpw",
    });
    const x509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId: orgMspId,
      type: "X.509",
    };

    // Stroing the identity in the wallet
    await wallet.put("admin", x509Identity);
    console.log(
      "Successfully enrolled admin user and imported it into the wallet",wallet
    );
  } catch (error) {
    console.error(`Failed to enroll admin user : ${error}`);
  }
};

exports.registerAndEnrollUser = async (orgId, userId, role) => {
	try {
        const caClient = module.exports.buildCAClient(orgId)

		// Retirving the wallet object
        const wallet = await module.exports.buildWallet()
        const orgMspId = module.exports.getMSPId(orgId)
        
		// Check to see if we've already enrolled the user
		const userIdentity = await wallet.get(userId);
		if (userIdentity) {
			console.log(`An identity for the user ${userId} already exists in the wallet`);
			return;
		}

		// Must use an admin to register a new user
		const adminIdentity = await wallet.get("admin");
		if (!adminIdentity) {
			console.log('An identity for the admin user does not exist in the wallet');
			console.log('Enroll the admin user before retrying');
			return;
		}

		// build a user object for authenticating with the CA
		const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
		const adminUser = await provider.getUserContext(adminIdentity, "admin");

		// Register the user, enroll the user, and import the new identity into the wallet.
		// if affiliation is specified by client, the affiliation value must be configured in CA
		const secret = await caClient.register({
			affiliation: `${orgId.toLowerCase()}.department1`,
			enrollmentID: userId,
			role: role
		}, adminUser);

        // Enrolling the identity    
		const enrollment = await caClient.enroll({
			enrollmentID: userId,
			enrollmentSecret: secret
		});

		// Creating a JSON object for the identity
		const x509Identity = {
			credentials: {
				certificate: enrollment.certificate,
				privateKey: enrollment.key.toBytes(),
			},
			mspId: orgMspId,
			type: 'X.509',
		};


		// Stroing the identity in the wallet
		await wallet.put(userId, x509Identity);

		return x509Identity;
	} catch (error) {
		console.error(`Failed to register user : ${error}`);
		return error
	}
};

exports.getIdentity=async function(identityName){
    try{
		const wallet = await module.exports.buildWallet()
		const identity = await wallet.get(identityName)
		return identity
	}catch(err){
		return err
	}
}

// module.exports.enrollAdmin("org1");
// module.exports.registerAndEnrollUser('org1', 'user2', 'client').then(console.log)
module.exports.getIdentity('user2').then(console.log)
