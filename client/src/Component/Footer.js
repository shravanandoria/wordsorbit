import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <div className="bottom-0 relative ">
        <ul className="grid grid-cols-5 gap-2">
          <Link
            className="text-gray-500 font-normal hover:text-gray-500"
            to="/"
          >
            <li>Help</li>
          </Link>
          <Link
            className="text-gray-500 font-normal hover:text-gray-500"
            to="/"
          >
            <li>Status</li>
          </Link>
          <Link
            className="text-gray-500 font-normal hover:text-gray-500"
            to="/"
          >
            <li>Writers</li>
          </Link>
          <Link
            className="text-gray-500 font-normal hover:text-gray-500"
            to="/"
          >
            <li>Blog</li>
          </Link>
          <Link
            className="text-gray-500 font-normal hover:text-gray-500"
            to="/"
          >
            <li>Careers</li>
          </Link>
          <Link
            className="text-gray-500 font-normal hover:text-gray-500"
            to="/"
          >
            <li>Privacy</li>
          </Link>
          <Link
            className="text-gray-500 font-normal hover:text-gray-500"
            to="/"
          >
            <li>Terms</li>
          </Link>
          <Link
            className="text-gray-500 font-normal hover:text-gray-500"
            to="/"
          >
            <li>About</li>
          </Link>
          <Link
            className="text-gray-500 font-normal hover:text-gray-500"
            to="/"
          >
            <li>Knowable</li>
          </Link>
        </ul>
      </div>
    </>
  );
};

export default Footer;
