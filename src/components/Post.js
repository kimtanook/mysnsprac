import React from "react";
import {dbService, storageService} from "../firebase.js";
import {doc, updateDoc, deleteDoc} from "firebase/firestore";
import {deleteObject, ref} from "firebase/storage";
import {useState} from "react";
import nullDisplay from "../images/nullimage.png";

const Post = ({postObj, isOwner}) => {
  const [editing, setEditing] = useState(false);
  const [newPost, setNewPost] = useState(postObj.text);
  const onDeleteClick = async () => {
    const ok = window.confirm("정말 삭제하시겠습니끼?");
    if (ok) {
      try {
        if (postObj.attachmentUrl) {
          await deleteObject(ref(storageService, postObj.attachmentUrl));
        }
        await deleteDoc(doc(dbService, `post/${postObj.id}`));
      } catch (error) {
        alert(error);
      }
    }
  };
  const toggleEditing = () => setEditing((prev) => !prev);
  const onSubmit = async (event) => {
    event.preventDefault();
    await updateDoc(doc(dbService, `post/${postObj.id}`), {
      text: newPost,
    });
    setEditing(false);
  };
  const onChange = (event) => {
    setNewPost(event.target.value);
  };

  return (
    <div className="post-box">
      <div className="creator-container">
        {postObj.photoURL ? (
          <img className="post-creator-img" src={postObj.photoURL} alt="img" />
        ) : (
          <img className="post-creator-img" src={nullDisplay} alt="img" />
        )}

        <div className="post-creator-name">{postObj.displayName ?? `익명`}</div>
      </div>
      <div className="post-container">
        {editing ? (
          <div>
            <form className="edit-container" onSubmit={onSubmit}>
              {postObj.attachmentUrl && (
                <img
                  className="post-img"
                  src={postObj.attachmentUrl}
                  width="150"
                  height="150px"
                  alt="img"
                />
              )}
              <h4>
                <input
                  className="edit-text"
                  type="text"
                  placeholder="Edit your post"
                  value={newPost}
                  required
                  onChange={onChange}
                />
              </h4>
              <input className="submit-btn" type="submit" value="Update Post" />
            </form>
            <button className="edit-btn" onClick={toggleEditing}>
              Cancel
            </button>
          </div>
        ) : (
          <div>
            {postObj.attachmentUrl && (
              <img className="post-img" src={postObj.attachmentUrl} alt="img" />
            )}
            <div className="post-title">{postObj.text}</div>
            {isOwner && (
              <>
                <button className="edit-btn" onClick={toggleEditing}>
                  Edit Text
                </button>
                <button className="delete-btn" onClick={onDeleteClick}>
                  Delete
                </button>
              </>
            )}
            <div className="post-date">
              {new Date(postObj.createAt + 9 * 60 * 60 * 1000).toLocaleString(
                "ko-KR",
                {
                  timeZone: "UTC",
                }
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Post;
