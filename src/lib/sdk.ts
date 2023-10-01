import { Wallet } from "@ethersproject/wallet";
import { AddresslistVotingClient, Client, Context, ContextParams, MultisigClient, TokenVotingClient } from "@aragon/sdk-client";
import { AllowedNetwork, networkRPC } from "./constants";
import { activeContractsList } from "@aragon/osx-ethers";


const getContectParams = (network: AllowedNetwork): ContextParams => {
    const IPFS_API_KEY = process.env.IPFS_API_KEY
    const PRIVATE_KEY = process.env.PRIVATE_KEY

    if (!PRIVATE_KEY) throw new Error("PRIVATE_KEY not provided");
    if (!IPFS_API_KEY) throw new Error("IPFS_API_KEY not provided");


    const RPC_URL: string = networkRPC[network];
    if (!RPC_URL) throw new Error(`RPC_URL not found for network: ${network}`);


    return {
        network,
        signer: new Wallet(PRIVATE_KEY),
        daoFactoryAddress: activeContractsList[network]?.["DAOFactory"] || "",
        web3Providers: [RPC_URL],
        ipfsNodes: [
            {
                url: "https://test.ipfs.aragon.network/api/v0",
                headers: { "X-API-KEY": IPFS_API_KEY || "" },
            },
        ],
        // Optional. By default it will use Aragon's provided endpoints.
        // They will switch depending on the network (production, development)
        graphqlNodes: [
            {
                url: "https://subgraph.satsuma-prod.com/qHR2wGfc5RLi6/aragon/osx-goerli/api",
            },
        ],
    }
}

export const context = (network: AllowedNetwork) => new Context(getContectParams(network));
export const client = (network: AllowedNetwork) => new Client(context(network));
export const multisigClient = (network: AllowedNetwork) => new MultisigClient(context(network));
export const tokenVotingClient = (network: AllowedNetwork) => new TokenVotingClient(context(network));
export const addressListVotingClient = (network: AllowedNetwork) => new AddresslistVotingClient(context(network));
