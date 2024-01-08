export const networkRPC = {
    mainnet: 'https://rpc.ankr.com/eth',
    goerli: 'https://rpc.ankr.com/eth_goerli',
    polygon: 'https://rpc.ankr.com/polygon',
    mumbai: 'https://rpc.ankr.com/polygon_mumbai',
    base: 'https://rpc.ankr.com/base',
    baseGoerli: 'https://rpc.ankr.com/base_goerli',
    local: 'http://localhost:8545',
}

export type AllowedNetwork = keyof typeof networkRPC;

export const networkIDs = {
    mainnet: 1,      
    goerli: 5,       
    polygon: 137,   
    mumbai: 80001,  
    base: 8453,
    baseGoerli: 84531,  
    local: 1337     
}
export type AllowedNetworkIds = keyof typeof networkIDs