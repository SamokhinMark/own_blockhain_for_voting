import CryptoJS from "crypto-js";

export type address = string;
export class Transaction {
    public txhash: string;
    public timestamp: number;
    public sender: address;
    public receiver: address;
    constructor(timestamp: number, sender: address, receiver: address) {
        this.timestamp = timestamp;
        this.sender = sender;
        this.receiver = receiver;
        this.txhash = this.calculateTxHash();
    }

    private calculateTxHash(): string {
        const data = JSON.stringify(this.timestamp) +
            JSON.stringify(this.sender) +
            JSON.stringify(this.receiver);
        return CryptoJS.SHA256(data).toString(CryptoJS.enc.Hex);
    }
}