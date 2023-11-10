import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import Logo from "../img/Logo2.png";

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);

  return (
    <div className="navbar">
      <div className="container">
        <div className="logo">
          <Link to="/">
          <img src={Logo} alt="" />
          </Link>
        </div>
        <div className="links">
          <Link className="link" to="/?cat=pets">
            <h6>PETS</h6>
          </Link>
          <Link className="link" to="/?cat=events">
            <h6>EVENTS</h6>
          </Link>
          <Link className="link" to="/?cat=workshops">
            <h6>WORKSHOPS</h6>
          </Link>
          <Link className="link" to="/?cat=shop">
            <h6>SHOP</h6>
          </Link>
          <Link className="link" to="/?cat=shelter">
            <h6>SHELTER</h6>
          </Link>
          <span>{currentUser?.username}</span>
          {currentUser ? (
            <span onClick={logout}>Logout</span>
          ) : (
            <Link className="link" to="/login">
              Login
            </Link>
          )}
          <span className="viewCart">
            <Link className="link" to="/write">
              View Cart
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
