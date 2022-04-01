import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

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
        className={`navbar navbar-expand-lg navbar-light bg-light shadow-gray-300 shadow-md`}
      >
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
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
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/">
                  Home
                </Link>
              </li>
            </ul>
            <form className="d-flex">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
            </form>
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
              <div className="grid grid-cols-2 gap-2 mx-2">
                <Link to="/createArticle">
                  <img
                    className="h-9 "
                    src={require("../Image/newArticle.png")}
                  />
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
