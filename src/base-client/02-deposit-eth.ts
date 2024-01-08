import { DaoDepositSteps, DepositParams } from "@aragon/sdk-client";

import { GasFeeEstimation, TokenType } from "@aragon/sdk-client-common";
import { createClient } from "../lib/sdk";

const client = await createClient("goerli");

const depositParams: DepositParams = {
  daoAddressOrEns: "budget-testr.dao.eth",
  amount: BigInt(10), // amount in wei
  type: TokenType.NATIVE, // "native" for ETH, otherwise "erc20" for ERC20 tokens
};

// Estimate how much gas the transaction will cost.
const estimatedGas: GasFeeEstimation = await client.estimation.deposit(depositParams);
console.log({ avg: estimatedGas.average, max: estimatedGas.max });

// Deposit ETH to the DAO.
const steps = client.methods.deposit(depositParams);
for await (const step of steps) {
  try {
    switch (step.key) {
      case DaoDepositSteps.DEPOSITING:
        console.log({ txHash: step.txHash });
        break;
      case DaoDepositSteps.DONE:
        console.log({ amount: step.amount });
        break;
    }
  } catch (err) {
    console.error(err);
  }
}
