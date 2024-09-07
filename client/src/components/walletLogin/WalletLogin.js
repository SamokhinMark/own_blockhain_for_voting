import "./WalletLogin.css"
import {useState} from "react";
import Service from "../utils/Service";
import {useNavigate} from "react-router-dom";

const WalletLogin = () => {
		const [privateKey, setPrivateKey] = useState('');
		const navigate = useNavigate();

		const onChange = (event) => {
				setPrivateKey(event.target.value);
		}

		const onClick = () => {
				sessionStorage.clear();
				const body = {'privateKey': privateKey};
				Service.login(JSON.stringify(body))
					.then((res) => {
							sessionStorage.setItem('privateKey', res.privateKey);
							sessionStorage.setItem('publicKey', res.publicKey);
							sessionStorage.setItem('address', res.address);
							sessionStorage.setItem('balance', res.balance);
							sessionStorage.setItem('isLoggedIn', 'true');

							navigate('/wallet/dashboard');
					})
					.catch(err => console.log(err));
		}

		return(
			<div className="login">
					<form className="login_form" method="post" name="login_form">
							<label className="login_label" htmlFor="login_input">Please enter your private key</label>
							<textarea name="login_input" id="login_input" cols="20" rows="20"
							          value={privateKey} onChange={onChange}>
							</textarea>
					</form>
					<button onClick={onClick} className="login_btn">Login</button>
			</div>
		);
}

export default WalletLogin;