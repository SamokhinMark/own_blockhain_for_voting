import './WalletDashboard.css'
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";

import SendTransaction from "../sendTransaction/SendTransaction";
import Service from "../../services/Service";

const WalletDashboard = () => {
		const [candidates, setCandidates] = useState([]);
		const [selectedCandidate, setSelectedCandidate] = useState('');
		const [modal, setModal] = useState(false);
		const navigate = useNavigate();

		useEffect(() => {
			Service.getState()
				.then((res) => {
					setCandidates(res);
				})
		}, []);

		const logout = () => {
			sessionStorage.clear();
			navigate('/vote/register');
		}

		const handleSubmit = (event) => {
			event.preventDefault();
			const message = {
				timestamp: Date.now(),
				sender: sessionStorage.getItem('address'),
				receiver: selectedCandidate.address
			}
			Service.sendTransaction(JSON.stringify(message))
				.then(() => {
						setModal(true);
						setTimeout(() => {
								setModal(false);
								sessionStorage.clear();
								navigate('/vote/register');
						}, 5000);
				})
				.catch(err => console.log(err));
		};

		return(
			<div className="dashboard">
				{modal && navigate('/vote/success')}
				<h1 className="title">Bulletin</h1>
				<button className="btn" style={{float: 'right'}} onClick={logout}>Logout</button>
				<hr/>
				<table>
					<tbody>
						<tr>
							<td>Address:</td>
							<td>{sessionStorage.getItem('address')}</td>
						</tr>
						<tr>
							<td>Public Key:</td>
							<td>{sessionStorage.getItem('publicKey')}</td>
						</tr>
						<tr>
							<td>Private Key:</td>
							<td>{sessionStorage.getItem('privateKey')}</td>
						</tr>
					</tbody>
				</table>
				<hr/>
				<form onSubmit={handleSubmit}>
					<h2 className='subtitle'>Select a Candidate</h2>
					<div className="vote_wrapper">
						{candidates.map((candidate, index) => (
							<div className="vote_candidates" key={index}>
								<div className="vote_candidates__wrapper">
									<input
										type="radio"
										name="selectedCandidate"
										value={candidate}
										id={`candidate_${index}`}
										onChange={() => setSelectedCandidate(candidate)}
									/>
									<label className="vote_candidates__name" htmlFor={`candidate_${index}`}>
										{candidate.name}
									</label>
									<div className="vote_candidates__address">
										{`(Address: ${candidate.address})`}
									</div>
								</div>
								<input
									type="hidden"
									name={`candidateId_${index}`}
									value={candidate}
								/>
							</div>
						))}
					</div>
					<button className="btn btn_center btn_vote" type="submit">Vote</button>
				</form>
			</div>
		);
}

export default WalletDashboard