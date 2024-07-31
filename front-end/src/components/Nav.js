import React, { useEffect, useState, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaCaretDown, FaShoppingCart, FaBars } from "react-icons/fa";
import "./Cart-Icon.css"; // Optional: for custom styling

const Nav = () => {
  const [dropdown, setDropdown] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false); // State for hamburger menu
  const menuRef = useRef(null); // Reference for the menu
  const dropdownRef = useRef(null); // Reference for the dropdown
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleDropdown = (item) => {
    setDropdown((prev) => (prev === item ? null : item));
  };

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen); // Toggle menu visibility
  };

  // Close menu and dropdown when clicking outside of them
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
        setDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const logedin_user = localStorage.getItem("user");
  let role;

  if (logedin_user) {
    try {
      const parsedUser = JSON.parse(logedin_user);
      role = parsedUser.role;
    } catch (error) {
      console.error("Error parsing JSON from localStorage:", error);
    }
  }

  return (
    <div className="navbar">
      <img
        alt="logo"
        className="logo"
        src="https://tse2.mm.bing.net/th?id=OIP.iFtHSdNsibQ2hqvyr2ZsgwHaEa&pid=Api&P=0&h=220"
      />
      <div className="hamburger" onClick={handleMenuToggle}>
        <FaBars />
      </div>
      <div ref={menuRef} className="" style={{ display: "flex", float: "left", right: "200px", position: "absolute" }}>
        <ul className={`nav-ul ${menuOpen ? "active" : ""}`}>
          {logedin_user ? (
            <>
              <li className="nav-item">
                <div
                  ref={dropdownRef}
                  className={`dropdown-trigger ${dropdown === "products" ? "active" : ""}`}
                  onClick={() => handleDropdown("products")}
                >
                  Products
                  <FaCaretDown />
                </div>
                {dropdown === "products" && (
                  <ul className="dropdown-menu">
                    <li>
                      <NavLink
                        to="/productlist"
                        className={({ isActive }) => (isActive ? "active" : "")}
                      >
                        Products
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/"
                        className={({ isActive }) => (isActive ? "active" : "")}
                      >
                        Products List
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/add"
                        className={({ isActive }) => (isActive ? "active" : "")}
                      >
                        Add Product
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/update"
                        className={({ isActive }) => (isActive ? "active" : "")}
                      >
                        Update Product
                      </NavLink>
                    </li>
                  </ul>
                )}
              </li>
              <li>
                <NavLink
                  to="/profile"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Profile
                </NavLink>
              </li>
              <li>
                <Link to="/cart">
                  <div className="cart-icon" style={{ marginBottom: "7px" }}>
                    <p>Cart</p>
                    <FaShoppingCart style={{ fontSize: 24 }} />
                    {/* <span className="cart-count">3</span> */}
                  </div>
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink
                  to="/signup"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  SignUp
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/login"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Login
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
      {logedin_user && (
        <div className="logout">
          <NavLink
            onClick={logout}
            to="/login"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Logout
            {logedin_user && (
              <img
                className="profile-image"
                src={`http://localhost:5000/uploads/profiles/${JSON.parse(logedin_user).image}`}
                alt="Profile"
              />
            )}
          </NavLink>
        </div>
      )}
    </div>
  );
};

export default Nav;
