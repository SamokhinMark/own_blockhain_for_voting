import {open} from "sqlite";
import sqlite3 from "sqlite3";
import {BlockInterface, ChainStateInterface, TxInterface, VotedAddressesIntreface} from "../../utils/interfaces.js";
import {blocksEqual} from "../../utils/functions.js";
import {Block} from "../block/Block.js";

export class DB {
    constructor(private db) {
        this.db = db;
    }

    static async setupDatabase() {
        function openDb() {
            return open({
                filename: 'node/database.db',
                driver: sqlite3.Database
            });
        }

        const db = await openDb();

        await db.exec(`
        CREATE TABLE IF NOT EXISTS transactions (
            txhash		TEXT PRIMARY KEY NOT NULL,
            timestamp	INTEGER NOT NULL,
            sender		TEXT NOT NULL,
            receiver	TEXT NOT NULL
        )
    `);

        await db.exec(`
        CREATE TABLE IF NOT EXISTS chain (
            block_index		INTEGER PRIMARY KEY,
            timestamp		INTEGER NOT NULL,
            prevBlockHash	TEXT NOT NULL,
            merkleRoot		TEXT,
            currBlockHash	TEXT NOT NULL,
            generator		TEXT NOT NULL,
            txCount 		INTEGER,
            txs 			TEXT
        )
    `);

        await db.exec(`
        CREATE TABLE IF NOT EXISTS state (
			name	TEXT NOT NULL UNIQUE,
            address TEXT PRIMARY KEY NOT NULL,
            balance INTEGER
        )
    `);

        await db.exec(`
        CREATE TABLE IF NOT EXISTS votedAddresses (
            address	TEXT PRIMARY KEY NOT NULL
        )
    `);
        return new DB(db);
    }

    public async listTables() {
        const tables = await this.db.all("SELECT name FROM sqlite_master WHERE type='table'");
        console.log('Tables in the database:');
        tables.forEach(table => console.log(table.name));
    }

    public async getAllFrom(table: string) {
        let res;
        try {
            res = await this.db.all(`SELECT * FROM ${table}`);
        } catch (e) {
            throw e;
        }
        return res;
    }

    public async sync(chain: BlockInterface[], txs: TxInterface[], state: ChainStateInterface[],
               votedAddrs: VotedAddressesIntreface[]) {
        this.syncChainBD(chain).catch(err => console.log(err));
        this.syncTxsBD(txs).catch(err => console.log(err));
        this.replaceState(state).catch(err => console.log(err));
        this.replaceVotedAddrs(votedAddrs).catch(err => console.log(err));
    }

    public async addNewCandidate(candidate: ChainStateInterface) {
        this.addChainState(candidate).catch(e => console.log(e));
    }

    public async addNewVotedAddress(address: VotedAddressesIntreface) {
        this.addVotedAddr(address).catch(e => console.log(e));
    }

    public async addNewBlock(block: BlockInterface) {
        this.addBlock(block).catch(e => console.log(e));
    }

    public async addNewTx(tx: TxInterface) {
        this.addTransaction(tx).catch(e => console.log(e));
        const votedAddr: VotedAddressesIntreface = {
            address: tx.sender
        }
        this.addVotedAddr(votedAddr).catch(e => console.log(e));
    }

    public async isTxValid(tx: TxInterface) {
        return await this.isTxHasHashAndNotInVotedAddrs(tx);
    }

    public async getLastBlock() {
        try {
            const block = await this.db.get(`
                SELECT * FROM chain ORDER BY block_index DESC LIMIT 1
            `);
            if (!block) {
                return undefined;
            }
            const txs = JSON.parse(block.txs);
            return Block.fromData(block.block_index, block.timestamp, block.prevBlockHash, block.generator, txs)
        } catch (e) {
            throw e;
        }
    }

    public async generateBlock(generator: string): Promise<Block> {
        try {
            const lastBlock = await this.getLastBlock();
            if (!lastBlock) {
                const txsForGenesisBlock = await this.getAllFrom('transactions');
                const genesisBlock = Block.createGenesis(txsForGenesisBlock);
                await this.addBlock(genesisBlock);
                return genesisBlock;
            } else {
                const txsForNewBlock: TxInterface[] = await this.getAllFrom('transactions');
                const newBlock = new Block(
                    lastBlock.index + 1,
                    Date.now(),
                    lastBlock.currBlockHash,
                    generator,
                    txsForNewBlock
                )
                await this.addBlock(newBlock);
                return newBlock;
            }
        } catch (e) {
            throw e;
        }
    }

    public async getBlockById(id: number) {
        try {
            return this.db.get(`
            SELECT * FROM chain WHERE block_index = ?
        `, [id]);
        } catch (e) {
            throw e;
        }
    }

    private async syncChainBD(chain: BlockInterface[]) {
        const currChainBD = await this.getAllFrom('chain');
        if (chain.length <= currChainBD.length) {
            return;
        }
        let allMatch = true;
        for (let i = 0; i < currChainBD.length; i++) {
            if (!blocksEqual(chain[i], currChainBD[i])) {
                allMatch = false;
                break;
            }
        }

        if (allMatch) {
            const newBlocks = chain.slice(currChainBD.length);
            for (const block of newBlocks) {
                this.addBlockForSync(block).catch(err => console.log(err));
            }
        }
    }

    private async syncTxsBD(txs: TxInterface[]) {
        await this.db.exec('BEGIN TRANSACTION');
        try {
            await this.db.exec(`DELETE FROM transactions`);
            for (const tx of txs) {
                await this.addTransaction(tx);
            }
            await this.db.exec('COMMIT');
        } catch (e) {
            await this.db.exec('ROLLBACK');
            throw e;
        }
    }

    private async addBlockForSync(block: BlockInterface) {
        const { index,
            timestamp,
            prevBlockHash,
            merkleRoot,
            currBlockHash,
            generator,
            txCount,
            txs} = block;
        const txsForDB: string = JSON.stringify(txs);

        try {
            await this.db.run(`
                INSERT INTO chain (block_index, timestamp, prevBlockHash, merkleRoot, currBlockHash,
                                            generator, txCount, txs)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `, [index, timestamp, prevBlockHash, merkleRoot, currBlockHash, generator, txCount, txsForDB]);
        } catch (e) {
            throw e
        }
    }

    private async addTransaction(tx: TxInterface) {
        const { txhash, timestamp, sender, receiver } = tx;
        try {
            await this.db.run(`
                INSERT INTO transactions (txhash, timestamp, sender, receiver)
                VALUES (?, ?, ?, ?)
            `, [txhash, timestamp, sender, receiver]);
        } catch (e) {
            throw e;
        }
    }

    private async replaceState(newState: ChainStateInterface[]) {
        try {
            await this.db.exec(`DELETE FROM state`);
            for (const state of newState) {
                await this.addChainState(state);
            }
        } catch (e) {
            throw e;
        }
    }

    private async replaceVotedAddrs(votedAddrs: VotedAddressesIntreface[]) {
        try {
            await this.db.exec(`DELETE FROM votedAddresses`);
            for (const address of votedAddrs) {
                await this.addVotedAddr(address);
            }
        } catch (e) {
            throw e;
        }
    }

    private async addChainState(newState: ChainStateInterface) {
        const { name, address, balance } = newState;
        try {
            await this.db.run(`
            INSERT INTO state (name, address, balance)
            VALUES (?, ?, ?)
        `, [name, address, balance]);
        } catch (e) {
            throw e;
        }
    }

    private async addVotedAddr(data: VotedAddressesIntreface) {
        const { address } = data;
        try {
            await this.db.run(`
            INSERT INTO votedAddresses (address)
            VALUES (?)
        `, [address]);
        } catch (e) {
            throw e;
        }
    }

    private async addBlock(block: BlockInterface) {
        const {txs} = block;
        await this.insertBlockIntoDb(block);
        await this.updateState(txs);
        await this.deleteConfirmedTxs(txs);
    }

    private async insertBlockIntoDb(block: BlockInterface) {
        const { index,
            timestamp,
            prevBlockHash,
            merkleRoot,
            currBlockHash,
            generator,
            txCount,
            txs} = block;
        const txsForDB = JSON.stringify(txs);
        try {
            await this.db.run(`
                INSERT INTO chain (block_index, timestamp, prevBlockHash, merkleRoot, currBlockHash,
                                            generator, txCount, txs)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `, [index, timestamp, prevBlockHash, merkleRoot, currBlockHash, generator, txCount, txsForDB]);
        } catch (e) {
            throw e;
        }
    }

    private async updateState(txs: TxInterface[]) {
        try {
            await this.db.run("BEGIN TRANSACTION");

            const updateReceiverBalanceStmt = `UPDATE state SET balance = balance + 1 WHERE address = ?`;
            const checkReceiverStmt = `SELECT * FROM state WHERE address = ?`;

            for (const tx of txs) {
                const candidate = await this.db.get(checkReceiverStmt, [tx.receiver]);
                if (candidate) {
                    await this.db.run(updateReceiverBalanceStmt, [tx.receiver]);
                }
            }
            await this.db.run("COMMIT");
        } catch (e) {
            await this.db.run("ROLLBACK");
            throw e;
        }
    }

    private async deleteConfirmedTxs(txs: TxInterface[]) {
        const txHashesSeparatedByComma: string = txs.map(tx => `'${tx.txhash}'`).join(',');
        try {
            await this.db.run(`
                DELETE FROM transactions WHERE txhash IN (${txHashesSeparatedByComma})
            `);
        } catch (e) {
            throw e;
        }
    }

    private async isTxHasHashAndNotInVotedAddrs(tx: TxInterface): Promise<boolean> {
        const {txhash, sender} = tx;
        if (!txhash) {
            return false;
        } else if (await this.isSenderAlreadyVoted(sender)) {
            return false;
        }
        return true;
    }

    private async isSenderAlreadyVoted(sender: string): Promise<boolean> {
        try {
            const address = await this.db.get(`
                SELECT * FROM votedAddresses WHERE address = ?
            `, [sender]);
            return !!address;

        } catch (e) {
            throw e;
        }
    }
	
}
