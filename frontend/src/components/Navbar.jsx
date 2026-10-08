import { NavLink } from "react-router-dom";

function Navbar() {

    return (
        <nav className="navbar">

            <div className="navbar-container">

                <NavLink
                    to="/"
                    className="navbar-logo"
                >
                    Hotel Management
                </NavLink>

                <div className="navbar-links">

                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            isActive
                                ? "nav-link active"
                                : "nav-link"
                        }
                    >
                        Hotels
                    </NavLink>

                    <NavLink
                        to="/add"
                        className={({ isActive }) =>
                            isActive
                                ? "nav-link active"
                                : "nav-link"
                        }
                    >
                        Add Hotel
                    </NavLink>

                </div>

            </div>

        </nav>
    );
}

export default Navbar;