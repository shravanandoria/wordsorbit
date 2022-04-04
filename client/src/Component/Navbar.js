import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import logo from "./wordsorbit_logo.png";
const Navbar = (props) => {
  const [token, setToken] = useState();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
    setToken(null);
  };

  useEffect(async () => {
    const token = localStorage.getItem("token");
    if (token) {
      setToken(token);
    }
  }, []);

  return (
    <>
      <nav
        className={`navbar navbar-expand-lg navbar-dark bg-dark shadow-gray-700 shadow-md`}
      >
        <div className="container-fluid">
          <Link className="navbar-brand flex items-center" to="/">
            <img src={logo} alt="logo" className="h-12 mx-3" />
            Wordsorbit
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {/* <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/">
                  Home
                </Link>
              </li> */}
            </ul>
            {!token ? (
              <div>
                <a href={"/login"}>
                  <button className="btn btn-primary">LogIn</button>
                </a>
                <a href="/signup">
                  <button className="btn btn-primary mx-2">Signup</button>
                </a>
              </div>
            ) : (
              <a href="/">
                <button
                  onClick={() => {
                    logout();
                  }}
                  className="btn btn-primary mx-2"
                >
                  Logout
                </button>
              </a>
            )}
            {token && (
              <div className="grid grid-cols-2 gap-2 mx-2 items-center">
                <Link to="/createArticle">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-8 w-8"
                    viewBox="0 0 20 20"
                    fill="white"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </Link>
                <Link to={`/profile`}>
                  <img
                    src={require("../Image/profile.png")}
                    alt="No-Image"
                    className="h-9"
                  />
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
      <hr className="text-gray-300" />
    </>
  );
};

export default Navbar;
