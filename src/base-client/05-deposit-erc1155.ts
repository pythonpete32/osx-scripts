import { DaoDepositSteps, DepositParams } from "@aragon/sdk-client";

import { GasFeeEstimation, TokenType } from "@aragon/sdk-client-common";
import { createClient } from "../lib/sdk";

const client = await createClient("goerli");

const depositParams: DepositParams = {
  daoAddressOrEns: "budget-testr.dao.eth",
  tokenAddress: "0x5Cb1FD4e3fa1037F5d40e0A5Afbf4374B3fdE7FF", 
  type: TokenType.ERC1155, // "erc1155" for ERC1155 token
  tokenIds: [BigInt(2)], // token ID of the ERC-1155 token
  amounts: [BigInt(1)], // amount of the ERC-1155 token to deposit
};

// Estimate how much gas the transaction will cost.
const estimatedGas: GasFeeEstimation = await client.estimation.deposit(
  depositParams,
);
console.log({ avg: estimatedGas.average, max: estimatedGas.max });

// Deposit the ERC1155 tokens.
const steps = client.methods.deposit(depositParams);
for await (const step of steps) {
  try {
    switch (step.key) {
      case DaoDepositSteps.DEPOSITING:
        console.log({ depositingTxHash: step.txHash });
        break;
      case DaoDepositSteps.DONE:
        console.log({ tokenId: step.tokenIds, amount: step.amounts });
        break;
    }
  } catch (err) {
    console.error(err);
  }
}