import React, { useEffect, useState } from "react";
import HomePage from "./Component/HomePage";
import Navbar from "./Component/Navbar";
import ArticlePage from "./Component/ArticlePage";
import UserProfile from "./Component/UserProfile";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreateArticle from "./Component/CreateArticle";
import Login from "./Component/Login";
import Signup from "./Component/Signup";
import MyProfile from "./Component/MyProfile";
import UpdateArticle from "./Component/UpdateArticle";
const App = () => {
  const [authenticationPage, setAuthenticationPage] = useState(false);
  useEffect(() => {
    document.body.classList = "bg-slate-300";
    const path = window.location.pathname;
    console.log(path);
    if (path === "/login" || path === "/signup") {
      setAuthenticationPage(true);
    }
  }, []);
  return (
    <>
      <Router>
        {/* <Routes> */}
        {!authenticationPage && (
          // <Route exact path={"/" | "/article/:id"} element={<Navbar />} />
          <Navbar authenticationPage={setAuthenticationPage} />
        )}
        {/* </Routes> */}
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route exact path="/createArticle" element={<CreateArticle />} />
          <Route exact path="/article/:id" element={<ArticlePage />} />
          <Route exact path="/profile/:id" element={<UserProfile />} />
          <Route exact path="/update/:id" element={<UpdateArticle />} />
          <Route exact path="/profile" element={<MyProfile />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/signup" element={<Signup />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
