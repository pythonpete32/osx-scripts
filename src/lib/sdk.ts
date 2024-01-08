import { Wallet } from "@ethersproject/wallet";
import {
  ContextParams,
  Client,
  Context,
  MultisigClient,
  TokenVotingClient,
  AddresslistVotingClient,
} from "@aragon/sdk-client";
import { AllowedNetwork, networkIDs, networkRPC } from "./constants";
import { activeContractsList } from "@aragon/osx-ethers";
import { ethers } from "ethers";

const getContectParams = async (network: AllowedNetwork, useFrame: boolean): Promise<ContextParams> => {
  let signer: ethers.providers.JsonRpcSigner | Wallet
  const IPFS_API_KEY = process.env.IPFS_API_KEY;
  const RPC_URL: string = networkRPC[network];
  if (!RPC_URL) throw new Error(`RPC_URL not found for network: ${network}`);
  if (!IPFS_API_KEY) throw new Error("IPFS_API_KEY not provided");

  if (useFrame) {
    const provider = new ethers.providers.JsonRpcProvider({
      url: "http://127.0.0.1:1248", // Frame
      headers: {
        Origin: "http://AragonSDK.app", // <- Your app name
      },
      allowInsecureAuthentication: true,
    });
    await provider.send("wallet_switchEthereumChain", [{ chainId: networkIDs[network] }]);
    signer = provider.getSigner();
  } else {
    const PRIVATE_KEY = process.env.PRIVATE_KEY;
    if (!PRIVATE_KEY) throw new Error("PRIVATE_KEY not provided");

    signer = new Wallet(PRIVATE_KEY)
  }

  return {
    network: network === "polygon" ? "matic" : network === "mumbai" ? "maticmum" : network,
    signer,
    daoFactoryAddress: activeContractsList[network]?.DAOFactory || "",
    web3Providers: [RPC_URL],
    ipfsNodes: [
      {
        url: "https://test.ipfs.aragon.network/api/v0",
        headers: { "X-API-KEY": IPFS_API_KEY || "" },
      },
    ],
  };
};

export const createContext = async (network: AllowedNetwork, useFrame = false) => new Context(await getContectParams(network, useFrame));
export const createClient = async (network: AllowedNetwork, useFrame = false) => new Client(await createContext(network, useFrame));
export const createMultisigClient = async (network: AllowedNetwork, useFrame = false) => new MultisigClient(await createContext(network, useFrame));
export const createTokenVotingClient = async (network: AllowedNetwork, useFrame = false) => new TokenVotingClient(await createContext(network, useFrame));
export const createAddressListVotingClient = async (network: AllowedNetwork, useFrame = false) =>
  new AddresslistVotingClient(await createContext(network, useFrame));
