import './WalletRegister.css'
import {useEffect, useState} from "react";
import Service from "../../services/Service";
import {useNavigate} from "react-router-dom";

const WalletRegister = () => {
		const navigate = useNavigate();

		const onClick = () => {
				Service.createWallet()
					.then(({privateKey, publicKey, address}) => {
							sessionStorage.clear();
							sessionStorage.setItem("privateKey", privateKey);
							sessionStorage.setItem("publicKey", publicKey);
							sessionStorage.setItem("address", address);
							navigate('/vote');
					})
		}

		return (
				<div>
						<h2 className="title">Voting rules</h2>
						<ul>
								<li className="subtitle state__subtitle">Once voting has started, you will not be able to return to this page.</li>
								<li className="subtitle state__subtitle">You will only have one vote to select a candidate.</li>
								<li className="subtitle state__subtitle">Once you have selected a candidate, you must click the "Vote" button to confirm your vote.</li>
								<li className="subtitle state__subtitle">The vote cannot be changed once you have clicked on "Vote".</li>
								<li className="subtitle state__subtitle">	If you are ready, click on "Start voting".</li>
						</ul>
						<button className="btn btn_center"
						        onClick={onClick}>Start voting</button>
				</div>
		);
}

export default WalletRegister;