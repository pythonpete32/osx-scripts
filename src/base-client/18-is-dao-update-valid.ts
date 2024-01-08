import { createClient } from "../lib/sdk";
import { PrepareUninstallationParams, GasFeeEstimation } from "@aragon/sdk-client-common";
const client = await createClient("polygon")



// The Id of the proposal
const proposalId: string = "0x0cff359a7455de5bb50aa0567517536d3dfe002d_0x11"


// check if a plugin update proposal is valid
const isValid = client.methods.isDaoUpdateProposalValid(proposalId);
console.log(await isValid)