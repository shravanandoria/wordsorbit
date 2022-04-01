import React, { useEffect, useState } from "react";
import Article from "./Article";
import Footer from "./Footer";
import Profile_HomePage from "./Profile_HomePage";
import Spinner from "./Spinner";
import Axios from "axios";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [articles, setArticles] = useState("");
  const [userSuggestions, setUserSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchArticles = async () => {
    setLoading(true);
    const articles = await Axios.get("/articles");
    setArticles(articles.data.article);
  };

  const fetchUsers = async () => {
    const users = await Axios.get("/auth/allusers");
    setUserSuggestions(users.data.users);
    setLoading(false);
  };

  useEffect(() => {
    fetchArticles();
    fetchUsers();
  }, []);
  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <div className="container laptop:grid laptop:grid-cols-3 laptop:gap-2 my-4">
          {/* Left Container */}
          <div
            className="left laptop:border-r-2 w-full col-span-2 overflow-y-auto "
            style={{ height: "100vh" }}
          >
            <h1 className=" font-medium text-center mb-3">
              RECOMMENDED FOR YOU
            </h1>
            <hr />
            {articles &&
              articles.map((e) => {
                return (
                  <Article
                    key={e._id}
                    id={e._id}
                    title={e.title}
                    author={e.author}
                    category={e.category}
                    body={e.body}
                    image={e.image}
                    date={e.date}
                  />
                );
              })}
          </div>

          {/* Right Container */}
          <div className="right font-bold hidden laptop:block text-center px-8 h-full items-stretch relative scroll-auto">
            <h1 className="font-medium">Recommended Topics</h1>
            <div className="grid grid-cols-3 gap-3 my-4 w-full">
              <Link
                to="#money"
                className="badge rounded-pill w-fit bg-slate-200 font-medium text-sm text-black"
              >
                Money
              </Link>
              <Link
                to="/category/#politics"
                className="badge rounded-pill w-fit bg-slate-200 font-medium text-sm text-black"
              >
                Politics
              </Link>
              <Link
                to="/category/#Startups"
                className="badge rounded-pill w-fit bg-slate-200 font-medium text-sm text-black"
              >
                Startups
              </Link>
              <Link
                to="/category/#Gaming"
                className="badge rounded-pill w-fit bg-slate-200 font-medium text-sm text-black"
              >
                Gaming
              </Link>
            </div>

            <div
              className={`mt-16 text-left h-80 ${
                userSuggestions.length > 4 ? "overflow-y-auto" : ""
              }`}
            >
              <h1>Who to Follow</h1>
              {userSuggestions.map((e) => {
                return (
                  <Profile_HomePage
                    key={e._id}
                    image={e.image}
                    username={e.username}
                    bio={e.bio}
                    id={e._id}
                  />
                );
              })}
            </div>
            <div className="text-left">
              <Footer />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HomePage;
