import "./App.css";
import {BrowserRouter as Router, Navigate, Route, Routes} from "react-router-dom";
import {useEffect, useState} from "react";

import Service from "../../services/Service";
import Header from "../header/Header";
import MainPage from "../../pages/MainPage";
import BlocksPage from "../../pages/BlocksPage";
import TransactionsPage from "../../pages/TransactionsPage";
import StatePage from "../../pages/StatePage";
import VotedAddrsPage from "../../pages/VotedAddrsPage";
import AboutPage from "../../pages/AboutPage";
import BlockPage from "../../pages/BlockPage";
import TransactionPage from "../../pages/TransactionPage";
import WalletRegister from "../walletRegister/WalletRegister";
import WalletDashboard from "../walletDashboard/WalletDashboard";
import VoteSuccessPage from "../../pages/VoteSuccessPage";


function App() {
		const [counts, setCounts] = useState({});

		useEffect(() => {
				Service.getCountsOfChapters()
					.then(res => setCounts(res))
					.catch(err => console.log(err));
		}, []);

		return (
			<Router>
					<div className="App">
							<Header/>
							<div className="container">
									<Routes>
											<Route path='/' element={<MainPage counts={counts}/>}/>
											<Route path='/blocks' element={<BlocksPage/>}/>
											<Route path='/votes' element={<TransactionsPage/>}/>
											<Route path='/candidates' element={<StatePage/>}/>
											<Route path='/voted_addrs' element={<VotedAddrsPage/>}/>
											<Route path='/about' element={<AboutPage/>}/>
											<Route path='/block/:id' element={<BlockPage/>}/>
											<Route path='/block/:id/:txhash' element={<TransactionPage/>}/>
											<Route path='/vote' element={<WalletDashboard/>}/>
											<Route path='/vote/register' element={<WalletRegister/>}/>
											<Route path='/vote/success' element={<VoteSuccessPage/>}/>
									</Routes>
							</div>
					</div>
			</Router>
		);
}

export default App;
