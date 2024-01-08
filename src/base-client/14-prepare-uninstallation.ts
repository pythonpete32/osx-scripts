import { createClient } from "../lib/sdk";
import { PrepareUninstallationParams, GasFeeEstimation } from "@aragon/sdk-client-common";
const client = await createClient("goerli")



const prepareUninstallationParams: PrepareUninstallationParams = {
  daoAddressOrEns: "budget-testr.dao.eth", 
  pluginAddress: "0x17e36c2df61ee17e59070773228caf35938f8acd",
  uninstallationParams: [],
  uninstallationAbi: [],
};

const estimatedGas: GasFeeEstimation = await client.estimation
  .prepareUninstallation(
    prepareUninstallationParams,
  );
console.log({ avg: estimatedGas.average, max: estimatedGas.max });
