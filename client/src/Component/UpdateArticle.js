import React, { useRef, useState, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import Axios from "axios";
import Spinner from "./Spinner";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const UpdateArticle = () => {
  const navigate = useNavigate();
  const articleID = useParams();
  const [article, setArticle] = useState({});
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
      fetchArticleData();
      setToken(token);
    } else {
      setLoginMessage("Login to create Article");
    }
  }, []);

  const fetchArticleData = async () => {
    const articleData = await Axios.get(`/articles/article/${articleID.id}`);
    console.log(articleData.data.article);
    setArticle(articleData.data.article);
  };

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

      const updateArticle = await Axios({
        url: `/articles/update/${articleID.id}`,
        method: "put",
        headers: {
          "Content-Type": "application/json",
          "auth-header": token,
        },
        data: JSON.stringify({ title, body, image, category }),
      });
      console.log(updateArticle);

      setSpinner(false);
      navigate(-1);
    } catch (error) {
      //PUT AN ERROR MESSAGE HERER
      console.log(error.message);
    }
  };
  return (
    <>
      {loginMessage ? (
        <h1 className="text-center text-3xl font-bold ">{loginMessage}</h1>
      ) : (
        <div className="container px-5 py-5">
          <h2 className="text-xl font-extrabold tablet:text-2xl tablet:my-3">
            Update Article
          </h2>
          <form
            action="/"
            onSubmit={(e) => {
              onClick(e);
            }}
          >
            <input
              defaultValue={article.title}
              type="text"
              name="title"
              ref={articleTitle}
              id="title"
              placeholder=" Title"
              className="border-b-2 w-full rounded border-yellow-500 font-xl outline-none"
            />
            <div className="my-3">
              <select
                onChange={(e) => setCategory(e.target.value)}
                className="form-select"
                aria-label="Default select example"
              >
                <option>Select Category</option>
                <option
                  selected={article.category === "Money" ? true : false}
                  value="Money"
                >
                  Money
                </option>
                <option
                  selected={article.category === "Politics" ? true : false}
                  value="Politics"
                >
                  Politics
                </option>
                <option
                  selected={article.category === "Startups" ? true : false}
                  value="Startups"
                >
                  Startups
                </option>
                <option
                  selected={article.category === "Gaming" ? true : false}
                  value="Gaming"
                >
                  Gaming
                </option>
              </select>
            </div>
            <div className="my-3 flex row justify-left">
              <Editor
                initialValue={article.body}
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
                required
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

export default UpdateArticle;
