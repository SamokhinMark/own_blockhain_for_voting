import {createLibp2p} from 'libp2p'
import {tcp} from '@libp2p/tcp'
import {webSockets} from '@libp2p/websockets'
import {noise} from '@chainsafe/libp2p-noise'
import {mdns} from "@libp2p/mdns";
import {gossipsub} from '@chainsafe/libp2p-gossipsub'
import {identify} from "@libp2p/identify";
import {yamux} from "@chainsafe/libp2p-yamux";

import {DB} from "../db/db.js";
import {TOPIC} from "../../utils/constants.js";
import {logMessage} from "../../utils/functions.js";
import {SeedRandom} from "../../utils/SeedRandom.js";
import {Block} from "../block/Block.js";
import {Transaction} from "../transaction/Transaction.js";

export async function createNode () {
    return await createLibp2p({
        addresses: {
            listen: [
                '/ip4/0.0.0.0/tcp/0'
            ]
        },
        transports: [
            tcp(),
            webSockets()
        ],
        streamMuxers: [
            yamux()
        ],
        connectionEncryption: [
            noise()
        ],
        connectionManager: {
        },
        peerDiscovery: [
            mdns({
                interval: 2000
            })
        ],
        services: {
            identify: identify(),
            pubsub: gossipsub()
        }
    })
}

export async function startNode() {
    const node = await createNode();
    const id = node.peerId.toString();
    let isSynced = false;

    const db = await DB.setupDatabase();

    node.addEventListener('peer:discovery', async (e) => {
        logMessage(id, `peer found: ${e.detail.id.toString()}`);
    });

    node.addEventListener('peer:connect', async (e) => {
        if (e.detail.toString() > id) {
            logMessage(id, `connected to: ${e.detail.toString()}`);
            const blockchainDB = await db.getAllFrom('chain');
            const transactionsDB = await db.getAllFrom('transactions');
            const stateDB = await db.getAllFrom('state');
            const votedAddrsDB = await db.getAllFrom('votedAddresses');

            const data = {
                type: "req-sync",
                peerId: e.detail.toString(),
                data: {
                    blockchain: blockchainDB,
                    transactions: transactionsDB,
                    state: stateDB,
                    votedAddresses: votedAddrsDB
                }
            };
            const dataEncoded: Uint8Array = new TextEncoder().encode(JSON.stringify(data));

            setTimeout(() => {
                node.services.pubsub.publish(TOPIC, dataEncoded);
            }, 400);
        }
    });

    node.services.pubsub.addEventListener('message', async (message) => {
        const messageJSON = JSON.parse(new TextDecoder().decode(message.detail.data));
        switch (messageJSON.type) {
            case 'req-sync':
                if (messageJSON.peerId !== id) {
                    return;
                }
                if (isSynced) {
                    return;
                }
                const { blockchain, transactions, state, votedAddresses } = messageJSON.data;
                db.sync(blockchain, transactions, state, votedAddresses)
                    .then(async () => {
                        logMessage(id, `successfully synced`);
                        isSynced = true;
                    })
                    .catch(e => console.log("Error while sync: ", e));
                break;

            case 'start-election':
                const lastBlock = await db.getLastBlock();
                if (!lastBlock) {
                    const genesisBlock = await createGenesisBlockIfLastBlockNotExists();
                    await db.addNewBlock(genesisBlock);
                    logMessage(id, `created genesis block: ${genesisBlock.currBlockHash}`);
                } else {
                    const { pingNode } = messageJSON.data;
                    const generatorForBlock = selectGeneratorBasedOnSeed(lastBlock.currBlockHash, pingNode);
                    const messageSelectedGenerator = JSON.stringify({
                        type: 'generator',
                        data: {
                            generator: generatorForBlock
                        }
                    })
                    const messageSelectedGeneratorEncoded: Uint8Array = new TextEncoder().encode(messageSelectedGenerator);
                    await node.services.pubsub.publish(TOPIC, messageSelectedGeneratorEncoded);
                    logMessage(id, `generator of next block: ${generatorForBlock}`);
                }
                break;
            case 'generator':
                if (messageJSON.data.generator !== id) {
                    return;
                }
                const newBlock = await db.generateBlock(messageJSON.data.generator);
                const messageNewBlock = JSON.stringify({
                    type: 'new-block',
                    data: {
                        block: newBlock
                    }
                })
                const messageNewBlockEncoded: Uint8Array = new TextEncoder().encode(messageNewBlock);
                await node.services.pubsub.publish(TOPIC, messageNewBlockEncoded);
                logMessage(id, `a new block: ${newBlock.currBlockHash}
                            \ngenerated by ${newBlock.generator}`);
                break;
            case 'new-block':
                await db.addNewBlock(messageJSON.data.block);
                logMessage(id, `a new block: ${messageJSON.data.block.currBlockHash} 
                            \ngenerated by ${messageJSON.data.block.generator}`);
                break;

            case 'new-local-tx':
                const { timestamp, sender, receiver } = messageJSON.data;
                const newTx: Transaction = new Transaction(timestamp, sender, receiver);
                if (!await db.isTxValid(newTx)) {
                    return;
                }
                await db.addNewTx(newTx);
                logMessage(id, `new tx ${newTx.txhash}`);
                const messageTx = JSON.stringify({
                    type: "new-tx",
                    data: {
                        tx: newTx
                    }
                })
                const messageTxEncoded: Uint8Array = new TextEncoder().encode(messageTx);
                if (node.services.pubsub.getSubscribers(TOPIC).length > 0) {
					await node.services.pubsub.publish(TOPIC, messageTxEncoded);
				}
                break;
            case 'new-tx':
                const tx: Transaction = new Transaction(messageJSON.data.tx.timestamp, messageJSON.data.tx.sender,
                                                        messageJSON.data.tx.receiver);
                if (!await db.isTxValid(tx)) {
                    return;
                }
                await db.addNewTx(tx);
                logMessage(id, `new tx ${tx.txhash}`);
                break;
            case 'new-local-candidate':
                await db.addNewCandidate(messageJSON.data)
                logMessage(id, `new candidate ${messageJSON.data.address} - ${messageJSON.data.balance}`);
                const messageCandidate = JSON.stringify({
                    type: "new-candidate",
                    data: messageJSON.data
                })
                const messageCandidateEncode: Uint8Array = new TextEncoder().encode(messageCandidate);
				if (node.services.pubsub.getSubscribers(TOPIC).length > 0) {
					await node.services.pubsub.publish(TOPIC, messageCandidateEncode);
				}
                break;
            case 'new-candidate':
                await db.addNewCandidate(messageJSON.data);
                logMessage(id, `new candidate ${messageJSON.data.address} - ${messageJSON.data.balance}`);
                break;
        }

    });

    logMessage(id, `node instance has started`);
    node.services.pubsub.subscribe(TOPIC);
    logMessage(id, `node is subscribed to ${node.services.pubsub.getTopics()}`);

    function selectGeneratorBasedOnSeed(seed: string, pingNode) {
        const allPeersInPubSub = node.services.pubsub.getSubscribers(TOPIC);
        const sortedPeers = sortedPeersInPubSub(allPeersInPubSub, pingNode);
        function sortedPeersInPubSub(peers, pingNodeId) {
            const peersToArrayOfString: string[] = peers.map((peer) => {
                return peer.toString();
            });
            peersToArrayOfString.push(id);
            const filteredPeers = peersToArrayOfString.filter(id => id !== pingNodeId);
            return filteredPeers.sort();
        }
        const rng = new SeedRandom(seed);
        function chooseRandomNode(peers: string[]) {
            const randomIndex = Math.floor(rng.random() * peers.length);
            return peers[randomIndex];
        }
        return chooseRandomNode(sortedPeers);
    }

    async function createGenesisBlockIfLastBlockNotExists() {
        const txsForGenesis = await db.getAllFrom('transactions');
        return Block.createGenesis(txsForGenesis);
    }

    return {node, db};
}