import "./Chapter.css"

const Chapter = (props) => {
		const {logo, title, descr, size} = props;
		return (
				<div className="chapter">
						<img className="chapter__logo" src={logo} alt="About"></img>
						<div className="subtitle chapter__title">{title}</div>
						<div className="chapter__descr">{descr}</div>
						<div className="chapter__size">{size}</div>
				</div>
		);
}

export default Chapter;