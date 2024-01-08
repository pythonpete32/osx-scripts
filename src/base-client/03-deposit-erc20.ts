import { DaoDepositSteps, DepositParams, SetAllowanceSteps } from "@aragon/sdk-client";

import { TokenType } from "@aragon/sdk-client-common";
import { createClient } from "../lib/sdk";

const client = await createClient("goerli");

const depositParams: DepositParams = {
  daoAddressOrEns: "budget-testr.dao.eth",
  amount: BigInt(1), // amount in wei
  tokenAddress: "0x8bDcdBF7ca9157cdB81dB1E0f28E2Ff8dEC8D224", // token contract adddress
  type: TokenType.ERC20, // "erc20" for ERC20 token, otherwise "native" for ETH
};

// Estimate how much gas the transaction will cost.
const estimatedGas = await client.estimation.deposit(
  depositParams,
);
console.log({ avg: estimatedGas.average, max: estimatedGas.max });

// Deposit the ERC20 tokens.
const steps = client.methods.deposit(depositParams);
for await (const step of steps) {
  console.log({step})
  try {
    switch (step.key) {
      case DaoDepositSteps.CHECKED_ALLOWANCE:
        console.log({ checkedAllowance: step.allowance });
        break;
      case SetAllowanceSteps.SETTING_ALLOWANCE:
        console.log({ updateAllowanceTxHash: step.txHash });
        break;
      case SetAllowanceSteps.ALLOWANCE_SET:
        console.log({ updatedAllowance: step.allowance });
        break;
      case DaoDepositSteps.DEPOSITING:
        console.log({ depositingTxHash: step.txHash });
        break;
      case DaoDepositSteps.DONE:
        console.log({ amount: step.amount });
        break;
    }
  } catch (err) {
    console.error(err)
  }
}