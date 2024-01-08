import {
  CreateDaoParams,
  DaoCreationSteps,
  DaoMetadata,
  TokenVotingClient,
  TokenVotingPluginInstall,
  VotingMode,
} from "@aragon/sdk-client";

import { GasFeeEstimation } from "@aragon/sdk-client-common";
import { createClient } from "../lib/sdk";

const client = await createClient("goerli");

const metadata: DaoMetadata = {
  name: "My DAO",
  description: "This is a description",
  avatar: "https://bit.ly/3tktKzd",
  links: [
    {
      name: "Web site",
      url: "https://...",
    },
  ],
};

// Through pinning the metadata in IPFS, we can get the IPFS URI. You can read more about it here: https://docs.ipfs.tech/how-to/pin-files/
const metadataUri = await client.methods.pinMetadata(metadata);

// You need at least one plugin in order to create a DAO. In this example, we'll use the TokenVoting plugin, but feel free to install whichever one best suites your needs. You can find resources on how to do this in the plugin sections.
// These would be the plugin params if you need to mint a new token for the DAO to enable TokenVoting.
const tokenVotingPluginInstallParams: TokenVotingPluginInstall = {
  votingSettings: {
    minDuration: 60 * 60 * 24 * 2, // seconds
    minParticipation: 0.25, // 25%
    supportThreshold: 0.5, // 50%
    minProposerVotingPower: BigInt("5000"), // default 0
    votingMode: VotingMode.EARLY_EXECUTION, // default is STANDARD. other options: EARLY_EXECUTION, VOTE_REPLACEMENT
  },
  newToken: {
    name: "Token", // the name of your token
    symbol: "TOK", // the symbol for your token. shouldn't be more than 5 letters
    decimals: 18, // the number of decimals your token uses
    minter: "0x...", // optional. if you don't define any, we'll use the standard OZ ERC20 contract. Otherwise, you can define your own token minter contract address.
    balances: [
      {
        // Defines the initial balances of the new token
        address: "0xABCD12343ABCD12343ABCD12343ABCD12343ABCD", // address of the account to receive the newly minted tokens
        balance: BigInt(10), // amount of tokens that address should receive
      },
    ],
  },
};

// Creates a TokenVoting plugin client with the parameteres defined above (with an existing token).
const tokenVotingInstallItem = TokenVotingClient.encoding.getPluginInstallItem(
  tokenVotingPluginInstallParams,
  "goerli"
);

const createDaoParams: CreateDaoParams = {
  metadataUri,
  ensSubdomain: `my-org-${new Date()}`, // my-org.dao.eth subdomains must be unique
  plugins: [tokenVotingInstallItem], // plugin array cannot be empty or the transaction will fail. you need at least one governance mechanism to create your DAO.
};

// Estimate how much gas the transaction will cost.
const estimatedGas: GasFeeEstimation = await client.estimation.createDao(createDaoParams);
console.log({ avg: estimatedGas.average, maximum: estimatedGas.max });

// Create the DAO.
const steps = client.methods.createDao(createDaoParams);

for await (const step of steps) {
  try {
    switch (step.key) {
      case DaoCreationSteps.CREATING:
        console.log({ txHash: step.txHash });
        break;
      case DaoCreationSteps.DONE:
        console.log({
          daoAddress: step.address,
          pluginAddresses: step.pluginAddresses,
        });
        break;
    }
  } catch (err) {
    console.error(err);
  }
}




