import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Axios from "axios";

const Article = (props) => {
  const { title, body, image, author, category, date } = props;
  const dateFormat = new Date(date).toLocaleDateString();
  const [readingTime, setReadingTime] = useState();
  const [articleAuthor, setArticleAuthor] = useState({});

  const countWord = () => {
    const articleBody = body.replace(/<\/?[^>]+(>|$)/g, "");
    const wpm = 250;
    const words = articleBody.trim().split(/\s+/).length;
    const time = Math.ceil(words / wpm);
    setReadingTime(time);
  };

  const fetchAuthor = async () => {
    const authorResp = await Axios.get(`/auth/getuser/${author}`);
    setArticleAuthor(authorResp.data.user);
  };
  useEffect(() => {
    countWord();
    fetchAuthor();
  }, []);
  return (
    <>
      <Link
        to={`/article/${props.id}`}
        target={"_blank"}
        className="hover:font-black font-black"
      >
        <div className="mb-3 my-3 w-full text-left">
          <div className="row g-0">
            <div className="col-md-4">
              <img
                src={image}
                className="img-fluid max-h-48 rounded-start tablet:max-h-52 w-full"
                alt="..."
              />
            </div>
            <div className="col-md-8 tablet:flex tablet:flex-col tablet:justify-center laptop:justify-center">
              <div className="mx-3">
                <p className="font-medium  text-gray-500">
                  <Link to={`/profile/${author}`}>
                    {articleAuthor.username}
                  </Link>{" "}
                  in
                  {" " + category}
                </p>
                <h5 className="card-title font-bold text-lg tablet:text-2xl">
                  {title}
                </h5>
              </div>
              <div className="card-body flex flex-col laptop:justify-end">
                <p className="card-text  font-medium">
                  {body.replace(/<\/?[^>]+(>|$)/g, "").slice(0, 80)}...
                </p>
                <div className="grid grid-cols-2 text-gray-500 font-medium tablet:justify-end ">
                  <p>{dateFormat}</p> <p>{readingTime} min read</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
      <hr />
    </>
  );
};

export default Article;
