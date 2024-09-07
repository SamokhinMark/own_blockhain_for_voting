import './States.css';
import {useEffect, useState} from "react";

import Service from "../../services/Service";

const States = () => {
		const [state, setState] = useState([]);

		useEffect(() => {
				Service.getState()
					.then(res => setState(res))
					.catch(err => console.log(err));
		}, []);

		const renderStates = () => {
				return (
					state.map((state, id) => {
							return (
								<tr key={id} className="block">
										<td>{state.address}</td>
										<td>{state.balance}</td>
								</tr>
							)
					})
				);
		}

		return (
			<div className="state">
					<h2 className="title">Candidates</h2>
					<h3 className="subtitle state__subtitle">
							On this page we can find the addresses of the voting candidates and the number of their votes so far.
							If there are new votes for a candidate in a newly generated block, its vote count increases by 1 with
							each vote. It is not possible to change votes in any other way.
					</h3>
					<hr/>
					<div className="blocks__info">
							<div className="blocks__count subtitle">Current blockchain state: {state.length ? state.length : 0} candidates</div>
							<hr/>
							<table>
									<thead>
									<tr>
											<th>Address</th>
											<th>Votes</th>
									</tr>
									</thead>
									<tbody>
											{state ? renderStates() : <p>Loading...</p>}
									</tbody>
							</table>
					</div>
			</div>
		);
}

export default States;