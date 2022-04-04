import React, { useRef, useState, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import Axios from "axios";
import Spinner from "./Spinner";
const CreateArticle = () => {
  const [spinner, setSpinner] = useState(false);
  const [token, setToken] = useState("");
  const [loginMessage, setLoginMessage] = useState("");

  const editorRef = useRef(null);
  const articleTitle = useRef();
  const [category, setCategory] = useState();
  const [imageSelected, setImageSelected] = useState();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setToken(token);
    } else {
      setLoginMessage("Login to create Article");
    }
  }, []);

  const onClick = async (e) => {
    e.preventDefault();
    const title = articleTitle.current.value;
    const body = editorRef.current.getContent();

    try {
      const formData = new FormData();
      formData.append("file", imageSelected);
      formData.append("upload_preset", "m3bhbcbm");
      setSpinner(true);
      const uploadImage = await Axios.post(
        "https://api.cloudinary.com/v1_1/shravan/image/upload",
        formData
      );
      const image = uploadImage.data.url;

      await Axios({
        url: "/articles/createarticle",
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "auth-header": token,
        },
        data: JSON.stringify({ title, body, image, category }),
      });

      setSpinner(false);
      window.location = "/";
    } catch (error) {
      //PUT AN ERROR MESSAGE HERER
    }
  };
  return (
    <>
      {loginMessage ? (
        <h1 className="text-center text-3xl font-bold ">{loginMessage}</h1>
      ) : (
        <div className="container px-5 py-5 bg-gray-400">
          <h2 className="text-xl font-extrabold tablet:text-2xl tablet:my-3">
            Create Article
          </h2>
          <form action="/" onSubmit={(e) => onClick(e)}>
            <input
              required
              type="text"
              name="title"
              ref={articleTitle}
              id="title"
              placeholder=" Title"
              className="border-b-2 w-full p-2 rounded border-yellow-500 font-xl outline-none"
            />
            <div className="my-3">
              <select
                required
                onChange={(e) => setCategory(e.target.value)}
                className="form-select"
                aria-label="Default select example"
              >
                <option>Select Category</option>
                <option value="Money">Money</option>
                <option value="Politics">Politics</option>
                <option value="Startups">Startups</option>
                <option value="Gaming">Gaming</option>
              </select>
            </div>
            <div className="my-3 justify-left ">
              <Editor
                apiKey="9iawbi8owyho0ntw2v5ni672wt66z2ocj7h1r5z7f9ajscwu"
                onInit={(evt, editor) => (editorRef.current = editor)}
                init={{
                  height: 500,
                  menubar: false,
                  plugins: [
                    "advlist autolink autosave link image lists charmap print preview hr anchor pagebreak spellchecker",
                    "searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking",
                    "save table contextmenu directionality emoticons template textcolor paste textcolor colorpicker",
                  ],
                  toolbar:
                    "undo redo | formatselect | " +
                    "bold italic backcolor | alignleft aligncenter " +
                    "alignright alignjustify | bullist numlist outdent indent | " +
                    "removeformat | help",
                  content_style:
                    "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                }}
              />
              <input
                className="my-3"
                onChange={(e) => setImageSelected(e.target.files[0])}
                type="file"
                name="image"
                id="image"
                accept="image/png, image/jpeg"
              />
            </div>
            {spinner ? (
              <Spinner />
            ) : (
              <button
                type="submit"
                className="btn bg-black text-white font-bold font-mono"
              >
                Submit
              </button>
            )}
          </form>
        </div>
      )}
    </>
  );
};

export default CreateArticle;
