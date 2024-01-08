import { Transfer, TransferQueryParams, TransferSortBy, TransferType } from "@aragon/sdk-client";
import { SortDirection } from "@aragon/sdk-client-common";
import { createClient } from "../lib/sdk";

const client = await createClient("goerli");

const params: TransferQueryParams = {
  daoAddressOrEns: "budget-testr.dao.eth", // optional
  sortBy: TransferSortBy.CREATED_AT, // optional
  limit: 10, // optional
  skip: 0, // optional
  direction: SortDirection.ASC, // optional, options: DESC or ASC
  type: TransferType.DEPOSIT, // optional, options: DEPOSIT or WITHDRAW
};

// Get a list of DAO transfers based on params set.
const daoTransfers: Transfer[] | null = await client.methods.getDaoTransfers(params);
console.log(daoTransfers);
