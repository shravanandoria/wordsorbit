import React, { useEffect, useState } from "react";
import Article from "./Article";
import Axios from "axios";
const UserProfile = () => {
  const [userArticles, setUserArticles] = useState([]);
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    followers: [],
    following: [],
    image: "",
    bio: "",
    email: "",
  });

  const fetchUserData = async () => {
    //Fetch logged in user Details
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    const user = await Axios({
      url: "/auth/getuser",
      method: "post",
      headers: {
        "auth-header": token,
      },
    });
    const { username, body, image, followers, following, bio, _id, email } =
      user.data;
    setUserInfo({ username, body, image, followers, following, bio, email });

    //Fetch Logged in user Articles
    const userArticles = await Axios.get(`/articles/${_id}`);
    setUserArticles(userArticles.data.userArticles);
  };
  useEffect(() => {
    // console.log(userInfo);
    fetchUserData();
  }, []);
  return (
    <>
      <div className="container mt-3 tablet:grid tablet:grid-cols-3 tablet:gap-4 laptop:text-lg">
        <div>
          <img
            src={
              userInfo.image ? userInfo.image : require("../Image/profile.png")
            }
            alt="No-Image"
            className="h-60"
          />
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
          <h1 className="my-1">Your Articles</h1>
          {userArticles.map((e) => {
            return (
              <div>
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
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default UserProfile;
