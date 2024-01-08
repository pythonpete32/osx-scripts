import { SetAllowanceParams, SetAllowanceSteps } from "@aragon/sdk-client";

import { createClient } from "../lib/sdk";

const client = await createClient("goerli");

const setAllowanceParams: SetAllowanceParams = {
  spender: "budget-testr.dao.eth",
  amount: BigInt(10), // amount
  tokenAddress: "0x8bDcdBF7ca9157cdB81dB1E0f28E2Ff8dEC8D224", // token contract adddress
};

const steps = client.methods.setAllowance(setAllowanceParams);

for await (const step of steps) {
  try {
    switch (step.key) {
      case SetAllowanceSteps.SETTING_ALLOWANCE:
        console.log({ updateAllowanceTxHash: step.txHash });
        break;
      case SetAllowanceSteps.ALLOWANCE_SET:
        console.log({ updatedAllowance: step.allowance });
        break;
    }
  } catch (err) {
    console.error(err);
  }
}
