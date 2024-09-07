import {BlockInterface} from "./interfaces.js";

export function logMessage(id: string, message: string) {
    console.log(`${id} - ${message}`);
}

export function blocksEqual(block1: BlockInterface, block2: BlockInterface): boolean {
    return block1.index === block2.index &&
        block1.timestamp === block2.timestamp &&
        block1.prevBlockHash === block2.prevBlockHash &&
        block1.currBlockHash === block2.currBlockHash &&
        block1.generator === block2.generator &&
        block1.txCount === block2.txCount &&
        JSON.stringify(block1.txs) === JSON.stringify(block2.txs)
}
