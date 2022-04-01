import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Article from "./Article";
import Axios from "axios";

const UserProfile = () => {
  const userId = useParams();

  const [userArticles, setUserArticles] = useState([]);
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    followers: [],
    following: [],
    image: "",
    bio: "",
  });

  const fetchAuthor = async () => {
    const userInfo = await Axios.get(`/auth/fetchuserinfo/${userId.id}`);
    const { username, body, image, followers, following, bio } = userInfo.data;
    setUserInfo({ username, body, image, followers, following, bio });
  };
  const fetchArticles = async () => {
    const userArticles = await Axios.get(`/articles/${userId.id}`);
    setUserArticles(userArticles.data.userArticles);
  };
  useEffect(() => {
    fetchAuthor();
    fetchArticles();
  }, []);
  return (
    <div className="container mt-3 tablet:grid tablet:grid-cols-3 tablet:gap-4 laptop:text-lg">
      <div>
        <img src={userInfo.image} alt="No-Image" className="h-60" />
        <h1 className="font-bold my-2">{userInfo.username}</h1>
        <div className="font-medium my-2">
          Followers: {userInfo.followers.length}
        </div>
        <div className="font-medium my-2">
          <h1>Following: {" " + userInfo.following.length}</h1>
        </div>
        <div className="font-medium my-2">
          <h1>Email: {userInfo.email}</h1>
        </div>
        <div className="font-medium my-2">
          <h1>Bio: {userInfo.bio}</h1>
        </div>
      </div>

      <div className="font-medium mt-3 text-center col-span-2">
        <h1 className="my-1">Articles</h1>
        <hr className="" />
        {userArticles.map((e) => {
          return (
            <Article
              key={e._id}
              id={e._id}
              title={e.title}
              body={e.body}
              image={e.image}
              author={e.author}
              category={e.category}
              date={e.date}
            />
          );
        })}
      </div>
    </div>
  );
};

export default UserProfile;
