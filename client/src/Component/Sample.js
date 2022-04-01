import React, { useEffect, useState } from "react";
import Axios from "axios";
import image from "../Image/image.jpg";

const Sample = () => {
  const [dimage, setImage] = useState();

  const uploadImage = async () => {
    try {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", "m3bhbcbm");
      await Axios.post(
        "https://api.cloudinary.com/v1_1/shravan/image/upload",
        formData
      ).then((res) => {
        //PUT A THEN BLOCK HERE
      });
    } catch (error) {
      //PUT AN ERROR MESSAGE HERE
    }
  };

  useEffect(() => {
    uploadImage();
  }, []);

  return (
    <div>
      <input
        type="file"
        name="sample"
        id="sample"
        onChange={(e) => {
          setImage(e.target.files[0]);
        }}
      />
    </div>
  );
};

export default Sample;
