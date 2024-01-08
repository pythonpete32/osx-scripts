import { AssetBalance } from "@aragon/sdk-client";
import { createClient } from "../lib/sdk";


const client = await createClient("mainnet");

// Address of the DAO whose asset balances you want to retrieve.
const daoAddressOrEns: string = "0x35e2a16224151caad2707619aeecf0d47231a48a";


// Get a DAO's asset balances.
const daoBalances: AssetBalance[] | null = await client.methods.getDaoBalances({
  daoAddressOrEns,
});
console.log(daoBalances);