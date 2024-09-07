import "./Blocks.css";
import {useEffect, useState} from "react";

import Service from "../../services/Service";
import {Link} from "react-router-dom";

const Blocks = () => {
		const [chain, setChain] = useState([]);

		useEffect(() => {
				Service.getChain()
					.then((res) => {
							setChain(res);
					})
					.catch(err => console.log(err));
		}, []);

		const renderChain = () => {
				return (
						chain.map((block, id) => {
								return (
									<tr key={id} className="block">
													<td><Link to={`/block/${block.block_index}`}
																		className="link">{block.block_index}</Link></td>
													<td>{new Date(block.timestamp).toLocaleString()}</td>
													<td>{block.txCount}</td>
													<td>{block.generator}</td>
									</tr>
						)
						})
				);
		}

		return (
			<div className="blocks">
					<h2 className="title">Blocks</h2>
					<h3 className="subtitle state__subtitle">
							This page holds groups of confirmed user votes. Each group is called a block. Blocks are stored
							in descending order of the id field. By clicking on the id you can see detailed information about the
							block.
					</h3>
					<hr/>
					<div className="blocks__info">
							<div className="blocks__count subtitle">Total of {chain.length ? chain.length : 0} blocks</div>
							<hr/>
							<table>
									<thead>
											<tr>
													<th>Id</th>
													<th>Timestamp</th>
													<th>Txs</th>
													<th>Generator</th>
											</tr>
									</thead>
									<tbody>
											{chain ? renderChain() : <p>Loading...</p>}
									</tbody>
							</table>
					</div>
			</div>
		);
}

export default Blocks;