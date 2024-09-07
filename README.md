# Electronic Voting System Using Blockchain Technology
This project is my diploma work on the topic *"Electronic Voting System Using Blockchain Technology"*.
Since I wrote it 5 days before the presentation, it’s not perfect, but anyway, the main concept is implemented (almost).

In general, this project includes a custom blockchain built in TypeScript, as well as a special website for exploring the system and electronic voting.

Before you start, you should already have Node.js and TypeScript installed (Google, YouTube, or ChatGPT can help with that). For the project to work, you'll need at least two nodes. Oh, and by the way, the blockchain is local. You can change the settings to a global network, but what's the point? It will just complicate testing.

---
## Installation

Since we need two nodes, we will clone this project twice.
<pre><code>git clone https://github.com/SamokhinMark/own_blockhain_for_voting.git node_1</code></pre>

<pre><code>git clone https://github.com/SamokhinMark/own_blockhain_for_voting.git node_2</code></pre>

After that, we build the projects.
<pre><code>cd node_1 && npm run build-project && cd ..</code></pre>
<pre><code>cd node_2 && npm run build-project && cd ..</code></pre>

## How to use
Now we can start testing.
Open 4 terminals. In the first three terminals, navigate to node_1
<pre><code># terminals 1, 2, 3 
cd node_1</code></pre>

1. The first terminal will run the master node. This node is responsible for starting the generation of the next block. Without the master node, the nodes in the network will not begin selecting a candidate to generate the next block. This could lead to a situation where a new block is never created, so it’s a critical element of the network.
<pre><code># terminal 1 
npm run start-master-node</code></pre>

2. The second terminal will run the server node. It is responsible for the operation of the blockchain: validating transactions, updating the state, interacting with the client, and other functions.
<pre><code># terminal 2 
npm run start-server-node</code></pre>

3. The third terminal will be responsible for the client server. Each node has its own client server, which gathers information through the API, validates it, and broadcasts it to the network.
<pre><code># terminal 3
npm run start-client</code></pre>

4. And finally, the fourth terminal will run the second node to ensure the blockchain works (there’s a bug here — blocks are not created if only one server node is running). After starting the second node, it will synchronize with the database of the already existing nodes. Following this principle, you can run up to 1000 local nodes, but don't forget to clone the project for each node, as each copy has its own local database.
<pre><code># terminal 4 
cd node_2 && npm run start-server-node</code></pre>

---
## Pre-configuration and candidates
In the database, I created a small template with candidates that can be voted for. If you accidentally deleted the database, I will now explain how to create new candidates.

To create new candidates, at least one server node must be running.

1. First, we send a GET-request to the endpoint: `http://localhost:8000/create-wallet` and copy the `address` from the response we received.
   
   ![image](https://github.com/user-attachments/assets/f129fe9c-390f-4687-987a-c7cfd0cbdb3b)

2. After that, create a new POST-request to the endpoint: `http://localhost:8000/add-candidate`. In the body of the request, we specify the following JSON:
<pre><code># POST-request to http://localhost:8000/add-candidate
{
    "name": "Your data",
    "address": "Insert the address obtained from the previous request"
}</code></pre>

   ![image](https://github.com/user-attachments/assets/c3de69d9-8514-4869-89c6-e23b6258ff88)

The first candidate is ready repeat these two steps as many times as you need.

---
## Testing
Now everything is ready for testing. We navigate to our client website (which we started in terminal 3) at http://localhost:3000/ and go to the Vote page. There, we begin the voting process. A special wallet is created for the voter, they select a candidate, and cast their vote. After that, the transaction will be added to the list of unconfirmed transactions. It will remain there until a new block is created (by default, this takes 5 minutes, but the value can be changed in the master_node/master_node.js file at the end of the file, where there's a comment).

### Also, keep in mind that a block won't be generated if the master node is not running! (we started it in terminal 1). 🚨🚨🚨

![Untitled Project-min](https://github.com/user-attachments/assets/c4c40836-a4fa-4cf0-ad71-88bb4f0a372c)

## Things that should be changed by you

The About page, the blockchain name, and the main logo of the site.

## How it can be improved

Add transaction signing. Integrate a pseudo-database containing voters' names and surnames, so that after a voter creates a wallet and casts their vote, they won’t be able to create a new one for repeat voting. Rewrite the node synchronization mechanism, as I was in a hurry and it was implemented strictly: the node with the larger database is the one the newly connected node will synchronize with.
