import {useLocation, useParams} from "react-router-dom";

const Transaction = () => {
		const { id, txhash } = useParams();
		const { tx } = useLocation().state;

		return (
			<div>
					<h1 className="title">Block ID: {id}</h1>
					<h2 className="subtitle">Transaction Hash: {txhash}</h2>
					<hr/>
					{tx ? (
						<table>
								<tbody>
								<tr>
										<td>Timestamp</td>
										<td>{new Date(tx.timestamp).toLocaleString()}</td>
								</tr>
								<tr>
										<td>Sender</td>
										<td>{tx.sender}</td>
								</tr>
								<tr>
										<td>Receiver</td>
										<td>{tx.receiver}</td>
								</tr>
								</tbody>
						</table>
					) : (
						<p>No transaction data available.</p>
					)}
					<hr/>
			</div>
		);
}

export default Transaction;