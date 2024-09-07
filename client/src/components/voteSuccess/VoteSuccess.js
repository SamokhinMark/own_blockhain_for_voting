import './VoteSuccess.css'
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";

const VoteSuccess = () => {
		const [counter, setCounter] = useState(5);
		const navigate = useNavigate();

		useEffect(() => {
				if (counter === 0) {
						navigate('/vote/register');
				}

				const timer = setInterval(() => {
						setCounter((prevCounter) => prevCounter - 1);
				}, 1000);

				return () => clearInterval(timer);
		}, [counter, navigate]);

		return (
			<div className="modal-overlay">
					<div className="modal-content">
							Your vote has been sent successfully! <br/>
							You will be automatically redirected after {counter} seconds.
					</div>
			</div>
		);
}

export default VoteSuccess;