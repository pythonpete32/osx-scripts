import { CreateDaoParams, DaoCreationSteps, DaoMetadata } from "@aragon/sdk-client";
import { PluginInstallItem, GasFeeEstimation } from "@aragon/sdk-client-common";
import { createClient } from "../lib/sdk";
import { defaultAbiCoder } from "ethers/lib/utils";
import { hexToBytes } from "../lib/helpers";

// Instantiate the general purpose client from the Aragon OSx SDK context.
const NETWORK = "goerli";
const client = await createClient(NETWORK);

const metadata: DaoMetadata = {
  name: "My DAO",
  description: "This is a description",
  avatar: "image-url",
  links: [
    {
      name: "Web site",
      url: "https://...",
    },
  ],
};

const metadataUri = await client.methods.pinMetadata(metadata);

// first thing we need to do is encode the parameters the setup contract expects,
// we are using the admin plugin as an example as it only has one parameter, ie the admin address
const hexBytes = defaultAbiCoder.encode(
  ["address"], // the types of the parameters the setup contract expects
  ["0x47d80912400ef8f8224531EBEB1ce8f2ACf4b75a"] // the values of the parameters the setup contract expects
);

const myCustomPlugin: PluginInstallItem = {
  id: "0xF66348E9865bb0f29B889E7c0FE1BCf4acAb5f54", // the address of the admin repo on goerli
  data: hexToBytes(hexBytes), // the encoded parameters
};

const createDaoParams: CreateDaoParams = {
  metadataUri,
  ensSubdomain: "my-org-42069187", // my-org.dao.eth
  plugins: [myCustomPlugin],
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
