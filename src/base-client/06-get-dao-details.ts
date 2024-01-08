import { DaoDetails } from "@aragon/sdk-client";

import { createClient } from "../lib/sdk";

const client = await createClient("polygon");
console.log(client)
// Address or ENS of the DAO whose metadata you want to retrieve.
const daoAddressOrEns: string = "0x6c30c1a36ac486456932b2f106053c42333514b2";

// Get a DAO's details.
const dao: DaoDetails | null = await client.methods.getDao(daoAddressOrEns);
console.log(dao);
