export interface BlockInterface {
    index: number,
    timestamp: number,
    prevBlockHash: string,
    merkleRoot: string,
    currBlockHash: string,
    generator: string,
    txCount: number,
    txs: TxInterface[]
}

export interface TxInterface {
    txhash: string
    timestamp: number,
    sender: string,
    receiver: string,
}

export interface ChainStateInterface {
	name: string,
    address: string,
    balance: number
}
export interface VotedAddressesIntreface {
    address: string
}

export interface message {
    type: string,
    data: object
}