import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Axios from "axios";
import Spinner from "../Component/Spinner";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const ArticlePage = () => {
  const articleID = useParams();
  const [article, setArticle] = useState({});
  const [follow, setFollow] = useState("Follow");
  const [token, setToken] = useState("");
  const [author, setAuthor] = useState({});
  const [loggeduserId, setLoggedUserId] = useState();
  const [articleDate, setArticleDate] = useState();
  const [readingTime, setReadingTime] = useState();
  const [loading, setLoading] = useState(false);
  const [buttonSpinner, setButtonSpinner] = useState(false);
  const [deleteSpinner, setDeleteSpinner] = useState(false);
  const [myArticle, setMyArticle] = useState(false);
  const [articleNotFound, setArticleNotFound] = useState(false);
  const navigate = useNavigate();

  const articleId = useParams();
  // articleId.id id of the article
  //FetchArticle
  const fetchArticle = async () => {
    try {
      setLoading(true);
      //Fetching the article and the author of article
      const article = await Axios.get(`/articles/article/${articleId.id}`);
      setArticle(article.data.article);
      setAuthor(article.data.author);
      const date = new Date(article.data.article.date);

      //setting the date of the article when created in (jan 30)
      const articleDate =
        date.toLocaleString("default", { month: "long" }) +
        " " +
        new Date(article.data.article.date).getDate();
      new Date(article.data.article.date).getDay();
      setArticleDate(articleDate);

      // setting the words per minute to read
      const timeToReadArticle = article.data.article.body.replace(
        /<\/?[^>]+(>|$)/g,
        ""
      );
      const wpm = 250;
      const words = timeToReadArticle.trim().split(/\s+/).length;
      const time = Math.ceil(words / wpm);
      setReadingTime(time);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setArticleNotFound(true);
    }
  };

  //Article BOdy
  function body() {
    return { __html: article.body };
  }

  //Follow user
  const followUser = async (id) => {
    try {
      setButtonSpinner(true);
      if (!token) {
        return navigate("/login");
      }
      await fetch("/auth/follow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-header": token,
        },
        body: JSON.stringify({
          userId: id,
        }),
      });
      getUser();
      setButtonSpinner(false);
    } catch (error) {
      console.log({ error: error.message });
    }
  };

  //Get User
  const getUser = async () => {
    if (token) {
      try {
        //Checking who created this article
        const loggedUser = await Axios({
          url: "/auth/getuser",
          method: "post",
          headers: {
            "auth-header": token,
          },
        });
        setLoggedUserId(loggedUser.data._id);
        const loggedUserId = loggedUser.data._id;

        const authorId = author._id;

        if (loggedUserId === authorId) {
          setMyArticle(true);
        }
        if (author) {
          const userFollowings = await fetch("/auth/loggedFollowings", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "auth-header": token,
            },
            body: JSON.stringify({ id: authorId }),
          });
          const userFollowingsJson = await userFollowings.json();
          setFollow(userFollowingsJson);
        }
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  //Delete Article
  const deleteArticle = async () => {
    setDeleteSpinner(true);
    try {
      const deleteArticle = await Axios({
        url: `/articles/delete/${articleID.id}`,
        method: "DELETE",
        headers: {
          "auth-header": token,
        },
      });
      navigate("/");
      console.log(deleteArticle.data);
      setDeleteSpinner(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    console.log(articleNotFound);
    const token = localStorage.getItem("token");
    setToken(token);
    fetchArticle();
  }, [articleNotFound]);

  useEffect(() => {
    console.log(articleID.id);
    getUser();
  }, [loading]);

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <div>
          {!articleNotFound ? (
            <div className="tablet:grid tablet:grid-cols-3">
              {/*  Article Body */}
              <div className="Main_Article w-full container col-span-2 ">
                <div className="Profile_Image text-center flex items-center mt-5 font-medium justify-start tablet:justify-start mx-1 grid-cols-3 gap-1 text-sm tablet:text-lg">
                  <img
                    src={author && author.image}
                    alt="No-Image"
                    className="h-10 border-0"
                  />
                  <p className="">{author && author.username} |</p>
                  <div className="Date">{articleDate} |</div>
                  <div className="">{readingTime} min read </div>
                </div>
                <h1 className="w-full text-left font-bold my-3 tablet:text-2xl">
                  {article.title}
                </h1>

                <div className="Article_Body text-sm">
                  <img
                    src={article.image}
                    alt="No-Image"
                    className="my-3 max-h-screen"
                  />
                  {myArticle && (
                    <div className="grid grid-cols-6 gap-2 ">
                      <Link to={`/update/${articleId.id}`}>
                        <button className="btn btn-primary ">Update</button>
                      </Link>
                      <button
                        onClick={deleteArticle}
                        className="btn btn-danger "
                      >
                        {deleteSpinner ? (
                          <div class="spinner-border text-light" role="status">
                            <span class="sr-only">Loading...</span>
                          </div>
                        ) : (
                          "Delete"
                        )}
                      </button>
                    </div>
                  )}
                  <p dangerouslySetInnerHTML={body()}></p>
                </div>
                <div></div>
              </div>
              {/* Related Section */}
              <div className="Related_Body container flex flex-col h-full justify-center text-center tablet:justify-start tablet:mt-4 laptop:text-xl">
                <h1 className="text-gray-500 text-md font-bold mt-3 tablet:text-left tablet:text-lg laptop:text-2xl ">
                  Related
                </h1>
                <div className="heading tablet:text-left">
                  <h1 className="tablet:text-left">Javascrpt</h1>
                  <div className="Related_Article flex my-2">
                    <img
                      src={require("../Image/image.jpg")}
                      alt="No-Img"
                      className="h-14"
                    />
                    <div className="mx-2">
                      <h1>Text editor for react</h1>
                      <p>Description of the ....</p>
                    </div>
                  </div>
                  <div className="Related_Article flex my-2">
                    <img
                      src={require("../Image/image.jpg")}
                      alt="No-Img"
                      className="h-14"
                    />
                    <div className="mx-2">
                      <h1>Text editor for react</h1>
                      <p>Description of the ....</p>
                    </div>
                  </div>
                  <div className="Related_Article flex my-2">
                    <img
                      src={require("../Image/image.jpg")}
                      alt="No-Img"
                      className="h-14"
                    />
                    <div className="mx-2">
                      <h1>Text editor for react</h1>
                      <p>Description of the ....</p>
                    </div>
                  </div>
                </div>
                {/* User Profile */}
                {author && (
                  <div className="userProfile hidden tablet:block my-3 laptop:w-full laptop:flex laptop:justify-center laptop:px-11 ">
                    {author._id !== loggeduserId ? (
                      <div className="max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 w-full dark:border-gray-700">
                        <div className="flex flex-col items-center pb-10 ">
                          <img
                            className="mb-3 w-24 h-24 rounded-full shadow-lg m-3"
                            src={author && author.image}
                            alt="Bonnie image"
                          />
                          <h3 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
                            {author && author.username}
                          </h3>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {author && author.bio}
                          </span>
                          <div className="flex mt-4 space-x-3 lg:mt-6 laptop:text-3xl">
                            <button
                              onClick={() => followUser(author._id)}
                              className="inline-flex items-center py-2 px-4 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                              {buttonSpinner ? (
                                <div
                                  class="spinner-border text-light"
                                  role="status"
                                >
                                  <span class="sr-only">Loading...</span>
                                </div>
                              ) : (
                                follow
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center text-2xl font-bold">
              <h1>Article Not Found</h1>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ArticlePage;
