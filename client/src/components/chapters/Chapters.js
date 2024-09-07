import "./Chapters.css"
import {Link} from "react-router-dom";


import Chapter from "../chapter/Chapter";
import aboutImg from '../../assets/imgs/about.png';
import blockImg from '../../assets/imgs/block.png';
import txImg from '../../assets/imgs/tx.png';
import stateImg from '../../assets/imgs/state.png';

const   Chapters = ({counts}) => {
		return (
				<section className="chapters">
						<div className="chapters__wrapper">
								<Link to='/blocks' className="link">
										<Chapter logo={blockImg} title={'Blocks'}
										         descr={'Section with all validated blocks in the blockchain.'}
										         size={`Total blocks count: ${counts.countBlocks}`}/>
								</Link>

								<Link to='/votes' className="link">
										<Chapter logo={txImg} title={'Votes'}
										         descr={'Section with all unconfirmed votes in blockchain.'}
										         size={`Total pending votes: ${counts.countTxs}`}/>
								</Link>
								<Link to="/candidates" className="link">
										<Chapter logo={stateImg} title={'Candidates'}
										         descr={'A section with the current state of the blockchain.'}
										         size={`Total registered candidates: ${counts.countState}`}/>
								</Link>
								<Link to="/voted_addrs" className="link">
										<Chapter logo={aboutImg} title={'Voted addresses'}
										         descr={'A section with all voted addresses.'}
										         size={`Total voted addresses: ${counts.countVotedAddrs}`}/>
								</Link>
						</div>
				</section>
		);
}

export default Chapters;