import CryptoJS from "crypto-js";
import {TxInterface} from "../../utils/interfaces.js";


export class Block {
    readonly index: number
    readonly timestamp: number
    readonly prevBlockHash: string
    readonly merkleRoot: string
    readonly currBlockHash: string
    readonly generator: string

    readonly txCount: number
    readonly txs: TxInterface[]

    constructor(index: number, timestamp: number, prevBlockHash: string, generator: string, txs: TxInterface[] | []) {
        this.index = index;
        this.timestamp = timestamp;
        this.prevBlockHash = prevBlockHash;
        this.generator = generator;
        this.txs = txs;

        this.txCount = txs.length;
        this.merkleRoot = this.calculateMerkleRoot();
        this.currBlockHash = this.calculateCurrBlockHash();
    }

    public static createGenesis(txs: TxInterface[]): Block {
        const generator = "0000000000000000000000000000000000000000";
        const prevBlockHash = "0000000000000000000000000000000000000000";
        return new Block(0, Date.now(), prevBlockHash, generator, txs);
    }

    public calculateCurrBlockHash(): string {
        const currBlockString: string = this.prevBlockHash.toString()
            + this.timestamp.toString()
            + JSON.stringify(this.txs)
            + this.merkleRoot.toString();
        return CryptoJS.SHA256(currBlockString).toString(CryptoJS.enc.Hex);
    }

    public static fromData(index: number, timestamp: number, prevBlockHash: string, generator: string, txs: TxInterface[]): Block {
        return new Block(index, timestamp, prevBlockHash, generator, txs);
    }

    private calculateMerkleRoot(): string {
        if (this.txs.length <= 0) {
            return '';
        }
        const leafHashes: Array<string> = this.txs.map(
            transaction => CryptoJS.SHA256(JSON.stringify(transaction)).toString(CryptoJS.enc.Hex)
        );
        return this.buildMerkleTree(leafHashes)[0];
    }

    private buildMerkleTree(hashes: Array<string>): Array<string> {
        if (hashes.length === 1) {
            return hashes;
        }

        const nextLevel: Array<string> = [];
        for (let i = 0; i < hashes.length; i += 2) {
            const left = hashes[i];
            const right = (i + 1 < hashes.length) ? hashes[i+1] : left;
            const concatenatedHash = left + right;
            const parentHash = CryptoJS.SHA256(concatenatedHash).toString(CryptoJS.enc.Hex);
            nextLevel.push(parentHash);
        }
        return this.buildMerkleTree(nextLevel);
    }

    public getMerkleProof(): string[] {
        const proof: string[] = [];
        const leafHashes: string[] = this.txs.map(
            transaction => CryptoJS.SHA256(JSON.stringify(transaction)).toString(CryptoJS.enc.Hex)
        );
        const rootHash: string = this.merkleRoot;

        let currentHashes: Array<string> = leafHashes;
        while (currentHashes.length > 1) {
            const nextLevel: Array<string> = [];
            for (let i = 0; i < currentHashes.length; i += 2) {
                const left = currentHashes[i];
                const right = (i + 1 < currentHashes.length) ? currentHashes[i + 1] : left;
                const concatenatedHash = left + right;
                const parentHash = CryptoJS.SHA256(concatenatedHash).toString(CryptoJS.enc.Hex);
                nextLevel.push(parentHash);
            }
            proof.push(...currentHashes.filter(hash => !nextLevel.includes(hash)));
            currentHashes = nextLevel;
        }
        proof.push(rootHash);
        return proof;
    }
}