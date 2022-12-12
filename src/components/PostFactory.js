import React, {useState, useRef} from "react";
import {dbService, storageService, authService} from "../firebase";
import {ref, getDownloadURL, uploadString} from "firebase/storage";
import {addDoc, collection} from "firebase/firestore";
import {v4 as uuidv4} from "uuid";
import {useSelector} from "react-redux";

const PostFactory = () => {
  const globalUser = useSelector((state) => state.userObj.users);

  const [post, setPost] = useState("");
  const [attachment, setAttachment] = useState("");
  const [toggle, setToggle] = useState(false);

  const toggleEditing = () => setToggle((prev) => !prev);

  const onSubmit = async (event) => {
    let attachmentUrl = "";
    event.preventDefault();
    if (attachment !== "") {
      const fileRef = ref(storageService, `${globalUser.uid}/${uuidv4()}`);
      const response = await uploadString(fileRef, attachment, "data_url");
      attachmentUrl = await getDownloadURL(response.ref);
    }
    try {
      await addDoc(collection(dbService, "post"), {
        createAt: Date.now(),
        creatorId: globalUser.uid,
        displayName: authService.currentUser.displayName,
        photoURL: authService.currentUser.photoURL,
        text: post,
        attachmentUrl,
      });
      setPost("");
      onClearAttachment();
    } catch (error) {
      console.log(error);
    }
  };
  const fileInput = useRef();
  const onClearAttachment = () => {
    fileInput.current.value = null;
    setAttachment("");
    setPost("");
  };

  const onChange = (event) => {
    const {
      target: {value},
    } = event;
    setPost(value);
  };
  const onFileChange = (e) => {
    const {
      target: {files},
    } = e;
    const theFile = files[0];
    const reader = new FileReader();
    reader.readAsDataURL(theFile);
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: {result},
      } = finishedEvent;
      setAttachment(result);
    };
  };
  return (
    <div className="post-submit-container">
      <button className="toggle-btn" onClick={toggleEditing}>
        {toggle ? `Cancel` : `Go To Posting`}
      </button>
      {toggle ? (
        <div className="post-wrap">
          <form className="post-form" onSubmit={onSubmit}>
            <div>
              <input
                className="post-input"
                value={post}
                onChange={onChange}
                type="text"
                placeholder="오늘은 무엇을 했나요?"
                maxLength={120}
                required
              />
            </div>
            <div>
              {attachment && (
                <img
                  className="preview-img"
                  src={attachment}
                  width="100px"
                  height="100px"
                  alt="img"
                />
              )}
            </div>
            <div>
              <input
                className="file-input"
                type="file"
                accept="image/*"
                onChange={onFileChange}
                ref={fileInput}
              />
            </div>
            <div>
              <input className="submit-btn" type="submit" value="OK" />
            </div>
          </form>
          <div>
            <button className="clear-btn" onClick={onClearAttachment}>
              Clear
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default PostFactory;
