import "./Transactions.css";
import {useEffect, useState} from "react";

import Service from "../../services/Service";


const Transactions = () => {
		const [txs, setTxs] = useState([]);

		useEffect(() => {
				Service.getTxs()
					.then((res) => setTxs(res))
					.catch(err => console.log(err));
		}, []);

		const renderTx = () => {
				return (
					txs.map((tx, id) => {
							return (
								<tr key={id} className="block">
										<td>{tx.txhash.slice(0, 14) + '...'}</td>
										<td>{new Date(tx.timestamp).toLocaleString()}</td>
										<td>{tx.sender.slice(0, 14) + '...'}</td>
										<td>{tx.receiver.slice(0, 14) + '...'}</td>
								</tr>
							)
					})
				);
		}

		return (
			<div className="txs">
					<h2 className="title">Votes</h2>
					<h3 className="subtitle state__subtitle">
							This page stores all unconfirmed votes on the blockchain.
							Each vote in this list will be included in the next generated block.
							If there are no unconfirmed votes, the block will be generated without them.
					</h3>
					<hr/>
					<div className="blocks__info">
							<div className="blocks__count subtitle">Total of {txs.length ? txs.length : 0} transactions</div>
							<hr/>
							<table>
									<thead>
											<tr>
													<th>Vote hash</th>
													<th>Timestamp</th>
													<th>A vote from</th>
													<th>A vote for</th>
											</tr>
									</thead>
									<tbody>
										{txs ? renderTx() : <p>Loading...</p>}
									</tbody>
							</table>
					</div>
			</div>
		);
}

export default Transactions;