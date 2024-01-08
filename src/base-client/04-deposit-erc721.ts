import { DaoDepositSteps, DepositParams } from "@aragon/sdk-client";

import { GasFeeEstimation, TokenType } from "@aragon/sdk-client-common";
import { createClient } from "../lib/sdk";

const client = await createClient("goerli");

const depositParams: DepositParams = {
  daoAddressOrEns: "budget-testr.dao.eth",
  tokenAddress: "0x9409bA37477d06152D271F071544654834d3FD84", // token contract adddress
  type: TokenType.ERC721, // "erc721" for ERC721 token
  tokenId: BigInt(1), // token ID of the ERC-721 token
};

// Estimate how much gas the transaction will cost.
// const estimatedGas: GasFeeEstimation = await client.estimation.deposit(
//   depositParams,
// );
// console.log({ avg: estimatedGas.average, max: estimatedGas.max });

// Deposit the ERC721 tokens.
const steps = client.methods.deposit(depositParams);

for await (const step of steps) {
  try {
    switch (step.key) {
      case DaoDepositSteps.DEPOSITING:
        console.log({ depositingTxHash: step.txHash });
        break;
      case DaoDepositSteps.DONE:
        console.log({ tokenId: step.tokenId });
        break;
    }
  } catch (err) {
    console.error(err);
  }
}