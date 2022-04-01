import React, { useState } from "react";
import Axios from "axios";
import { Link } from "react-router-dom";

const Signup = (props) => {
  const [loading, setLoading] = useState();
  const [account, setAccount] = useState({
    fname: "",
    lname: "",
    username: "",
    email: "",
    password: "",
    bio: "",
  });

  const [imageSelected, setImageSelected] = useState();
  const onChange = (e) => {
    setAccount({ ...account, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("file", imageSelected);
    formData.append("upload_preset", "m3bhbcbm");
    const uploadImage = await Axios.post(
      "https://api.cloudinary.com/v1_1/shravan/image/upload",
      formData
    );
    const image = uploadImage.data.url;
    const createAccount = await Axios.post("/auth/signup", {
      ...account,
      image,
    });

    localStorage.setItem("token", createAccount.data);
    setLoading(false);
    window.location.pathname = "/";
  };
  return (
    <>
      <img
        src={require("../Image/loginImage.png")}
        alt="no-image"
        className="absolute h-full w-full z-0 object-cover"
      />
      {/* <div class="alert alert-danger text-center" role="alert">
        Email or password incorrect
      </div> */}
      )
      <div className="w-full z-10 relative flex justify-center items-center tablet:pt-10 laptop:pt-16 container">
        <div className="px-4  max-w-sm bg-white rounded-lg border border-gray-200 shadow-md sm:p-6 lg:p-8 dark:bg-gray-800 dark:border-gray-700">
          <form className="space-y-6" action="#" onSubmit={onSubmit}>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Sign up to Wordsorbit
            </h3>
            <div className="tablet:grid tablet:grid-cols-2 tablet:gap-2">
              <label htmlFor="image" className="container">
                Profile Image
              </label>
              <input
                onChange={(e) => setImageSelected(e.target.files[0])}
                type="file"
                name="image"
                id="image"
                className="bg-gray-50 border col-span-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                placeholder="First Name"
                required="Image is Required"
              />
              <input
                minLength={3}
                onChange={onChange}
                type="text"
                name="fname"
                id="fname"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                placeholder="First Name"
                required="First Name Is Required"
              />
              <input
                minLength={3}
                onChange={onChange}
                type="text"
                name="lname"
                id="lname"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                placeholder="Last Name"
                required="Last Name is Required"
              />
              <input
                minLength={3}
                onChange={onChange}
                type="text"
                name="username"
                id="username"
                className="bg-gray-50 border tablet:col-span-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                placeholder="Username"
                required="username is required"
              />
              <input
                onChange={onChange}
                type="email"
                name="email"
                id="email"
                className="bg-gray-50 border tablet:col-span-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                placeholder="E-mail"
                required="email is required"
              />
              <input
                onChange={onChange}
                type="text"
                name="bio"
                id="bio"
                className="bg-gray-50 border tablet:col-span-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                placeholder="Your Bio"
                required="bio is required"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Your password
              </label>
              <input
                minLength={5}
                onChange={onChange}
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                required="password is required"
              />
            </div>
            <button
              type="submit"
              className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              {loading ? (
                <div class="spinner-border text-white" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              ) : (
                "Create Account"
              )}
            </button>
            <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
              Already have an account?{" "}
              <Link
                to="#"
                className="text-blue-700 hover:underline dark:text-blue-500"
              >
                Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;
