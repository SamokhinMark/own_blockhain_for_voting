import "./Header.css"
import {Link, NavLink} from "react-router-dom";


const Header = () => {
		const style = ({isActive}) => ({fontSize: isActive ? '23px' : '20px'});
		return (
			<header>
					<div className="logo"></div>
					<div className="header__wrapper">
							<div className="header__block">
									<NavLink to='/'
									         end
									         className='link'
									         style={style}>
											Home</NavLink>
							</div>

							<div className="header__block">
									<NavLink to='/blocks'
									         end
									         className='link'
									         style={style}>
											Blocks</NavLink>
							</div>

							<div className="header__block">
									<NavLink to='/votes'
									         end
									         className='link'
									         style={style}>
											Votes</NavLink>
							</div>

							<div className="header__block">
									<NavLink to='/candidates'
									         end
									         className='link'
									         style={style}>
											Candidates</NavLink>
							</div>

							<div className="header__block">
									<NavLink to='/voted_addrs'
									         end
									         className='link'
									         style={style}>
											Voted Addresses</NavLink>
							</div>

							<div className="header__block">
									<NavLink to='/vote/register'
									         end
									         className='link'
									         style={style}>
											Vote</NavLink>
							</div>

							<div className="header__block">
									<NavLink to='/about'
									         end
									         className='link'
									         style={style}>
											About</NavLink>
							</div>

					</div>
			</header>
		)
}

export default Header;