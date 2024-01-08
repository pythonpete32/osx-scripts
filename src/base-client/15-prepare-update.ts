import { PrepareUpdateParams, PrepareUpdateStep } from "@aragon/sdk-client";
import { createClient } from "../lib/sdk";
import { activeContractsList } from "@aragon/osx-ethers";
const client = await createClient("polygon", true);

const prepareUpdateParams: PrepareUpdateParams = {
  daoAddressOrEns: "0x6c30c1a36ac486456932b2f106053c42333514b2", // my-dao.dao.eth
  pluginAddress: "0x0cff359a7455de5bb50aa0567517536d3dfe002d",
  pluginRepo: activeContractsList["polygon"]["multisig-repo"],
  newVersion: {
    build: 2,
    release: 1,
  },
  updateParams: [],
  updateAbi: [],
};

// Estimate how much gas the transaction will cost.
const estimatedGas = await client.estimation.prepareUpdate(prepareUpdateParams);
console.log({ avg: estimatedGas.average, max: estimatedGas.max });

// Deposit the ERC20 tokens.
const steps = client.methods.prepareUpdate(prepareUpdateParams);
for await (const step of steps) {
  try {
    switch (step.key) {
      case PrepareUpdateStep.PREPARING:
        console.log({ txHash: step.txHash });
        break;
      case PrepareUpdateStep.DONE:
        console.log({
          permissions: step.permissions,
          pluginAddress: step.pluginAddress,
          pluginRepo: step.pluginRepo,
          versionTag: step.versionTag,
          initData: step.initData,
          helpers: step.helpers,
        });
        break;
    }
  } catch (err) {
    console.error(err);
  }
}
