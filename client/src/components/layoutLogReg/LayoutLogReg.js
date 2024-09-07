import './LayoutLogReg.css'
import {Link, NavLink, Outlet} from "react-router-dom";

const LayoutLogReg = () => {

		const style = ({isActive}) => ({fontSize: isActive ? '23px' : '20px'});

		return(
				<>
					<div className="layout">
							<div className="layout_wrapper">
									<div>
											<NavLink to="/wallet/login"
											         end
											         className="link subtitle"
											         style={style}>Login with private key</NavLink>
									</div>
									<div>
											<NavLink to="/wallet/register"
											         end
											         className="link subtitle"
											         style={style}>Create new wallet</NavLink>
									</div>
							</div>
					</div>
					<hr/>
					<div className="outlet container">
							<Outlet/>
					</div>
				</>
		);
}

export default LayoutLogReg;