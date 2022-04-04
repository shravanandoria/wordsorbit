import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Profile_HomePage = (props) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState("Follow");
  const [userId, setUserId] = useState("");

  const followUser = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return navigate("/login");
    }
    setLoading(true);
    await fetch("/auth/follow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-header": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        userId: id,
      }),
    });
    setLoading(false);
  };

  useEffect(async () => {
    const token = localStorage.getItem("token");
    if (token) {
      const response = await fetch("/auth/getuser/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-header": token,
        },
      });
      const json = await response.json();
      setUserId(json._id);
      const id = props.id;
      const userFollowings = await fetch("/auth/loggedFollowings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-header": token,
        },
        body: JSON.stringify({ id }),
      });

      const userFollowingsJson = await userFollowings.json();
      setIsFollowing(userFollowingsJson);
    }
  }, [loading]);

  return (
    <>
      {userId !== props.id ? (
        <div className="my-3 text-left bg-slate-600 shadow-md text-gray-300 p-3 rounded">
          <div className="grid lg:grid-cols-5 xl:grid-cols-5 gap-1">
            <div>
              <img
                src={props.image}
                className="max-w-sm max-h-11 object-cover"
                alt="no-image"
              />
            </div>
            <div className="col-md-8 col-span-2 w-full text-left ">
              <Link to={`/profile/${props.id}`}>
                <h5 className="hover:text-black">{props.username}</h5>
                <p className="card-text font-normal text-sm text-gray-400 hover:text-black">
                  {props.bio.slice(0, 50)}
                </p>
              </Link>
            </div>
            <button
              onClick={() => {
                followUser(props.id);
              }}
              className="border-2 hover:bg-black rounded-xl p-2 order-gray-500 text-sm text-center w-fit h-fit col-start-6"
            >
              {loading ? (
                <div
                  className="spinner-border text-dark h-5 w-5 "
                  role="status"
                >
                  <span className="sr-only">Loading...</span>
                </div>
              ) : (
                isFollowing
              )}
            </button>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default Profile_HomePage;
