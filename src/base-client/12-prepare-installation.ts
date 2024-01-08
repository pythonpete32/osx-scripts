import { PrepareInstallationParams, PrepareInstallationStep } from "@aragon/sdk-client";
import { createClient } from "../lib/sdk";
import { activeContractsList } from "@aragon/osx-ethers";

const client = await createClient("goerli");

const installationAbi = [
  {
    name: "admin",
    type: "address",
    internalType: "address",
    description: "The admin address",
  },
];

const prepareInstallationParams: PrepareInstallationParams = {
  daoAddressOrEns: "budget-testr.dao.eth",
  pluginRepo: activeContractsList["goerli"]["admin-repo"],
  installationParams: ["0x47d80912400ef8f8224531EBEB1ce8f2ACf4b75a"],
  installationAbi,
};

const steps = client.methods.prepareInstallation(prepareInstallationParams);
for await (const step of steps) {
  try {
    switch (step.key) {
      case PrepareInstallationStep.PREPARING:
        console.log({ txHash: step.txHash });
        break;
      case PrepareInstallationStep.DONE:
        console.log({ step });
        break;
    }
  } catch (err) {
    console.error(err);
  }
}
