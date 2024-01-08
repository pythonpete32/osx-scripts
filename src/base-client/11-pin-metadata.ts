import { DaoMetadata } from "@aragon/sdk-client";
import { createClient } from "../lib/sdk";

const client = await createClient("goerli");

// The Metadata object containing the details of the DAO.
const metadata: DaoMetadata = {
    name: "My DAO",
    description: "This is a description",
    avatar: "",
    links: [{
      name: "Web site",
      url: "https://...",
    }],
  };
  
  // Pin the metadata in IPFS.
  const metadataUri = await client.methods.pinMetadata(metadata);
  console.log(metadataUri);