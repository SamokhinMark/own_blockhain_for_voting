import "./SendTransaction.css";
import {useState} from "react";

import Service from "../../services/Service";

const SendTransaction = ({modalToogler}) => {
		const [receiverAddress, setReceiverAddress] = useState('');
		const [amountValue, setAmountValue] = useState(0);
		const [feesValue, setFeesValue] = useState(1);

		const onChange = (event) => {
				if (event.target.name === 'modal_receiver') {
						setReceiverAddress(event.target.value.replace(/\s/g, ''));
				} else if (event.target.name === 'modal_amount') {
						setAmountValue(filterNumber(event.target.value));
				} else if (event.target.name === 'modal_fees') {
						setFeesValue(filterNumber(event.target.value));
				}
		}

		const filterNumber = (value) => {
				return value.replace(/[^\d.]/g, ''); // Заменяем все символы, кроме цифр и точки, на пустую строку
		};
		const onSubmit = () => {
				const data = {
						timestamp: Date.now(),
						sender: sessionStorage.getItem('address'),
						receiver: receiverAddress,
						amount: +amountValue,
						fees: +feesValue
				}
				Service.sendTransaction(JSON.stringify(data))
					.then(() => console.log("Sent"))
					.catch(err => console.log(err));
		}

		return(
				<>
					<div className="bg" onClick={modalToogler}></div>
					<div className="modal modal_transaction">
							<div className="modal_title">Send transaction</div>
							<div className="close"
							     onClick={modalToogler}>
							</div>
							<form method="post" className="modal_form">
									<label htmlFor="modal_receiver" className="modal_label">Receiver</label>
									<textarea id="modal_receiver" name="modal_receiver" className="modal_input"
									          cols="30" rows="10"
									          value={receiverAddress}
									          onChange={onChange}> </textarea>
									<label htmlFor="modal_amount" className="modal_label">Amount (NUR)</label>
									<input
										type="number"
										id="modal_amount"
										name="modal_amount"
										className="modal_input"
										value={amountValue}
										onChange={onChange} />
									<label htmlFor="modal_fees" className="modal_label">Fees (NUR)</label>
									<input
										type="number"
										id="modal_fees"
										name="modal_fees"
										className="modal_input"
										value={feesValue}
										onChange={onChange}/>
							</form>
							<input type="submit" className="btn" style={{display: "inline-block"}}
							       value="Send transaction" onClick={onSubmit}/>
					</div>
				</>
		);
}

export default SendTransaction;