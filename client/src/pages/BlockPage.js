import {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";

import Service from "../services/Service";

const BlockPage = () => {
		const params = useParams();
		const [block, setBlock] = useState({});

		useEffect(() => {
				Service.getBlock(params.id)
					.then(res => {
							setBlock(res);
					})
					.catch(e => console.log(e));
		}, []);

		const convertTxs = (txs) => {
				if (!txs || txs === '[]') return 'No transactions';
				try {
						const txsJSON = JSON.parse(txs);
						return txsJSON.map((tx, id) => {
								return <li key={id}>
										<Link className='link'
											to={`/block/${block.block_index}/${tx.txhash}`}
									    state={{tx}}
										>
												{tx.txhash}
										</Link>
								</li>
						})
				} catch (e) {
						console.log(e);
				}
		}

		return (
			<div className='block'>
					<h1 className="title">Block #{block.block_index}</h1>
					<hr/>
					<div className="block_detail">
							<table className="table">
									<tbody>
									<tr>
											<td>Block index</td>
											<td>{block.block_index}</td>
										</tr>
										<tr>
												<td>Timestamp</td>
												<td>{new Date(block.timestamp).toLocaleString()}</td>
										</tr>
										<tr>
												<td>Generator</td>
												<td>{block.generator}</td>
										</tr>
										<tr>
												<td>Hash</td>
												<td>{block.currBlockHash}</td>
										</tr>
										<tr>
												<td>Parent hash</td>
												<td>{block.prevBlockHash}</td>
										</tr>
										<tr>
												<td>Merkle root</td>
												<td>{block.merkleRoot ? block.merkleRoot : 'No transactions'}</td>
										</tr>
										<hr/>
										<tr>
												<td>Votes count</td>
												<td>{block.txCount}</td>
										</tr>
										<hr/>
										<tr>
												<td style={{float: 'left'}}>Votes hashes</td>
												<td>
														<ul style={{listStyleType: "none", padding: 0, margin: 0}}>
																{convertTxs(block.txs)}
														</ul>
												</td>
										</tr>
										</tbody>
								</table>
						</div>
				</div>
		);
}

export default BlockPage;