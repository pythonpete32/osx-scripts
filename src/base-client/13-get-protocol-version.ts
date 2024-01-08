import { createClient } from "../lib/sdk";

const client = await createClient("mainnet");

const protocolVersion = await client.methods.getProtocolVersion("0x5afeb7f3259a25eb21287e3a917bee3d4de58daf");
console.log(protocolVersion);
