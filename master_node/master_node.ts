import { createLibp2p } from "libp2p";
import { tcp } from "@libp2p/tcp";
import { webSockets } from "@libp2p/websockets";
import { yamux } from "@chainsafe/libp2p-yamux";
import { noise } from "@chainsafe/libp2p-noise";
import { mdns } from "@libp2p/mdns";
import { identify } from "@libp2p/identify";
import { gossipsub } from "@chainsafe/libp2p-gossipsub";

import {logMessage} from "../utils/functions.js";
import {TOPIC} from "../utils/constants.js";

export async function createServerNode() {
    const serverNode = await createLibp2p({
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
    });

    const id = serverNode.peerId.toString();

    serverNode.addEventListener('peer:discovery', async (e) => {
        logMessage(id, `peer found: ${e.detail.id.toString()}`);
    });

    serverNode.addEventListener('peer:connect', async (e) => {
        logMessage(id, `connected to: ${e.detail.toString()}`);
    });

    setInterval(async () => {
        if (serverNode.services.pubsub.getSubscribers(TOPIC).length > 0) {
			const message = {
				type: "start-election",
				data: {
					pingNode: id
				}
			}
			const messageUint8Array: Uint8Array = new TextEncoder().encode(JSON.stringify(message));
		
			await serverNode.services.pubsub.publish(TOPIC, messageUint8Array);
			logMessage(id, `election started`);
		}
    }, 5 * 60000); // change this value if you want to reduce the generation time of the next block
				   // now 5 * 60000ms (or 60sec) = 5 mins

    logMessage(id, `node instance has started`);
    serverNode.services.pubsub.subscribe(TOPIC);
    logMessage(id, `node is subscribed to ${serverNode.services.pubsub.getTopics()}`);
    return serverNode;
}

createServerNode().catch(e => console.log(e));
