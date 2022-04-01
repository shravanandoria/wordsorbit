import React from "react";
import spinner from "../Image/spinner.gif";

const Spinner = () => {
  return (
    <div className=" flex  items-center w-full h-full justify-center font-black">
      <img src={spinner} alt="" />
    </div>
  );
};

export default Spinner;
