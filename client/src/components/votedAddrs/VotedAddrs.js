import './VotedAddrs.css';
import {useEffect, useState} from "react";

import Service from "../../services/Service";

const VotedAddrs = () => {
		const [votedAddrs, setVotedAddrs] = useState([]);

		useEffect(() => {
				Service.getVotedAddrs()
					.then(res => setVotedAddrs(res))
					.catch(err => console.log(err));
		}, []);

		const renderVotedAddrs = () => {
				return (
					votedAddrs.map((state, id) => {
							return (
								<tr key={id} className="block">
										<td>{state.address}</td>
								</tr>
							)
					})
				);
		}

		return (
			<div className="state">
					<h2 className="title">Voted addresses</h2>
					<h3 className="subtitle state__subtitle">
							On this page you can find a list of all voted addresses. Each address has the right to vote only once.
					</h3>
					<hr/>
					<div className="blocks__info">
							<div className="blocks__count subtitle">Current voted addresses count: {votedAddrs.length ? votedAddrs.length : 0}</div>
							<hr/>
							<table>
									<thead>
									<tr>
											<th>Address</th>
									</tr>
									</thead>
									<tbody>
									{votedAddrs ? renderVotedAddrs() : <p>Loading...</p>}
									</tbody>
							</table>
					</div>
			</div>
		);
}

export default VotedAddrs