import "./Main.css"
import {Link} from "react-router-dom";

const Main = () => {
		return (
			<>
					<div className="main__background"></div>
					<section className="main">
							<h1 className="title main__title">Nurechain</h1>
							<h2 className="subtitle main__subtitle">Diploma work.<br/>Blockchain prototype.</h2>
							<Link to="/vote/register" className="link">
									<div className="btn main__btn">Vote</div>
							</Link>
					</section>
			</>
		)
}

export default Main;