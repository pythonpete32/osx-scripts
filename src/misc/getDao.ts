import { createClient } from "../lib/sdk";

// Instantiate the general purpose client from the Aragon OSx SDK context.
const NETWORK = "goerli";
const client = await createClient(NETWORK)

const dao = await client.methods.getDao("0x970fed12e8816aa4e5d57b9ccf66263de8732a0d".toLowerCase());
console.log(dao);
// console.log(await client.methods.getDaos({}));
