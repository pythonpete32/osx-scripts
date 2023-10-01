import {
    PluginSetupProcessor,
    PluginSetupProcessor__factory,
    activeContractsList,
} from '@aragon/osx-ethers';
import { ethers } from 'ethers';
import { ApplyInstallationParams, DaoAction } from '@aragon/sdk-client-common';
import { ProposalCreationSteps, VoteValues } from '@aragon/sdk-client';
import { client, tokenVotingClient } from './lib/sdk';
import { getWallet, hexToBytes, getLogFromReceipt } from './lib/helpers';
import { AllowedNetwork } from './lib/constants';
const log = console.log;

// ======================= *** CONFIG *** ===================== 

// ***NOTE***: The configured Private Key must be Able to create proposals on the DAO
const DAO_ADDRESS_OR_ENS = 'testinstall.dao.eth'
const NETWORK: AllowedNetwork = 'goerli';

// ============================================================
// 0. Setup: Get all the addresses and contracts
// ============================================================
// ***0a. Setup Aragon stuff***
const deployer = getWallet();
const aragonClient = client(NETWORK);
const votingClient = tokenVotingClient(NETWORK);

// This is the contract that prepares and actually installs the plugin. You can think of this as 
// homebrew, pacman, or apt-get. It's the thing that actually installs the plugin.
const PluginSetupProcessor = activeContractsList[NETWORK]["PluginSetupProcessor"];

// We are going to use the admin repo because its super simple and deploying our own repo can already be done with the cli
const adminRepoAddress = activeContractsList[NETWORK]["admin-repo"]

// ***Contract instances***
const setupProcessor = PluginSetupProcessor__factory.connect(PluginSetupProcessor, deployer);
const pspInterface = PluginSetupProcessor__factory.createInterface();

// ***0b. Setup your DAO stuff***

// get the dao details
const daoDetails = await aragonClient.methods.getDao(DAO_ADDRESS_OR_ENS)
if (!daoDetails) throw new Error('DAO not found');

const DAO_ADDRESS = daoDetails.address;
const VOTING_APP_ADDRESS = daoDetails.plugins[0].instanceAddress

log("DAO Contract: ", DAO_ADDRESS)
log("Voting Plugin: ", VOTING_APP_ADDRESS)


// ==============================================================
// 1. PrepareInstallation: Using the PluginSetupProcessor, prepare the installation
// https://github.com/aragon/osx/blob/a52bbae69f78e74d6a17647370ccfa2f2ea9bbf0/packages/contracts/src/framework/plugin/setup/PluginSetupProcessor.sol#L287-L288
// ==============================================================


// 1a. ***Encode the installation data***
// Here we are encoding the data that is needed to initialize the plugin. Its the the same thing that is decoded here in the setup contract
// https://github.com/aragon/osx/blob/1c7b8ecbac9df80879c9c23d3409d50a1960e403/packages/contracts/src/plugins/governance/admin/AdminSetup.sol#L38-L39
const prepareInstallationData = ethers.utils.defaultAbiCoder.encode(
    ['address'],
    [deployer.address]
);


// 1b. ***Prepare the installation***
// the pluginSetupRef is the reference to the plugin setup to be used for the installation. Remember PluginRepos are just contracts that version control plugins
// so the pluginSetupRef is the reference to the plugin setup to be used for the installation.
const pluginSetupRef = {
    versionTag: { release: 1, build: 1 },
    pluginSetupRepo: adminRepoAddress,
}


// 1c. ***Prepare the installation***
// putting it all together we can now prepare the installation
const prepareInstallationParams = {
    pluginSetupRef,
    data: hexToBytes(prepareInstallationData),
}

// 1d. ***Call the prepareInstallation() on the PSP **
const prepareInstallationTx = await setupProcessor.prepareInstallation(DAO_ADDRESS, prepareInstallationParams);
const prepareInstallationReceipt = await prepareInstallationTx.wait();
const prepInstallLog = await getLogFromReceipt(prepareInstallationReceipt, pspInterface, 'InstallationPrepared');

// here we are getting the params from the log. we care about the plugin address and the permissions
const { plugin: pluginAddress, preparedSetupData: { permissions } } = prepInstallLog;


// ==============================================================
// 3. Create Proposal to Apply install: Using the PluginSetupProcessor, use the SDK to get the set of actions and create a proposal
// https://github.com/aragon/osx/blob/a52bbae69f78e74d6a17647370ccfa2f2ea9bbf0/packages/contracts/src/framework/plugin/setup/PluginSetupProcessor.sol#L287-L288
// ==============================================================

// 3a. ***Get the ApplyInstallationParams***
const applyInstallationParams: ApplyInstallationParams = {
    helpers: [],
    permissions,
    pluginAddress,
    pluginRepo: adminRepoAddress,
    versionTag: { release: 1, build: 1 },
}


// 3b. ***Encode the actions***
// Here we use the client to create the encoded actions. This creates 3 actions, 
// [0] Grants the PSP permission to install, 
// [1] Installs the plugin, 
// [2] Removes the PSP permission to install
const daoActions: DaoAction[] = aragonClient.encoding.applyInstallationAction(DAO_ADDRESS, applyInstallationParams);

// 3c. ***Pin the metadata***
const metadataUri: string = await votingClient.methods.pinMetadata({
    title: "Test metadata",
    summary: "This is a test proposal",
    description: "This is the description of a long test proposal",
    resources: [
        {
            url: "https://thforumurl.com",
            name: "Forum",
        },
    ],
    media: {
        header: "https://fileserver.com/header.png",
        logo: "https://fileserver.com/logo.png",
    },
});

// 3d. ***Create the proposal***
// this returns an export generator that will create the proposal
const steps = votingClient.methods.createProposal({
    metadataUri,
    pluginAddress: VOTING_APP_ADDRESS,
    actions: daoActions,
    creatorVote: VoteValues.YES, // creator votes yes
    executeOnPass: true, // execute on pass
    startDate: new Date(0), // Start immediately
    endDate: new Date(0), // uses minimum voting duration
})

// 3e. ***Iterate through the steps***
for await (const step of steps) {
    try {
        switch (step.key) {
            case ProposalCreationSteps.CREATING:
                log("Transaction Hash: ", step.txHash);
                break;
            case ProposalCreationSteps.DONE:
                log("Proposal ID", step.proposalId);
                break;
        }
    } catch (err) {
        console.error(err);
    }
    log("🎉🎉🎉🎉🎉🎉🎉🎉🎉");
}
