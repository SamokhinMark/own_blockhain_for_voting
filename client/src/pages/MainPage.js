import Chapters from "../components/chapters/Chapters";
import Main from "../components/main/Main";

const MainPage = ({counts}) => {
		return (
				<div className="container">
						<Main/>
						<Chapters counts={counts}/>
				</div>
		);
}

export default MainPage;