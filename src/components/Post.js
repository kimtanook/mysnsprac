/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect} from "react";
import {authService, dbService, storageService} from "../firebase.js";
import {
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import {deleteObject, ref} from "firebase/storage";
import {useState} from "react";
import nullDisplay from "../images/nullimage.png";
import {useSelector} from "react-redux";
import edit from "../images/edit-icon.png";
import cancel from "../images/cancel-icon.png";
import ok from "../images/ok-icon.png";
import deleteIcon from "../images/delete-icon.png";

const Post = ({postObj, isOwner}) => {
  // post 수정관련
  const [editing, setEditing] = useState(false);
  const [newPost, setNewPost] = useState(postObj.text);
  // comment 관련
  const [commentWrite, setCommentWrite] = useState(false);
  const [comment, setComment] = useState("");
  const [commentStore, setCommentStore] = useState([]);
  // redux user state
  const globalUser = useSelector((state) => state.userObj.users);

  // 실시간 comment DB 감지 onSnapshot
  useEffect(() => {
    const q = query(
      collection(dbService, `post/${postObj.id}/comment`),
      orderBy("createAt", "desc")
    );
    onSnapshot(q, (querySnapshot) => {
      const commentsArr = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCommentStore(commentsArr);
    });
  }, []);

  // post 삭제
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
  // post 수정 토글
  const toggleEditing = () => setEditing((prev) => !prev);

  // post 수정 submit
  const onSubmit = async (event) => {
    event.preventDefault();
    await updateDoc(doc(dbService, `post/${postObj.id}`), {
      text: newPost,
    });
    setEditing(false);
  };

  // post 수정 value 감지
  const onChange = (event) => {
    setNewPost(event.target.value);
  };

  // comment 작성 value 감지
  const onCommentChange = (event) => {
    const {
      target: {value},
    } = event;
    setComment(value);
  };

  // comment 작성 submit
  const onCommentSubmit = async (event) => {
    event.preventDefault();
    await addDoc(collection(dbService, `post/${postObj.id}/comment`), {
      createAt: Date.now(),
      creatorId: globalUser.uid,
      displayName: authService.currentUser.displayName,
      photoURL: authService.currentUser.photoURL,
      text: comment,
    });
    setComment("");
  };

  // comment 삭제
  const onCommentDelete = async (event) => {
    event.preventDefault();
    const ok = window.confirm("정말 삭제하시겠습니끼?");
    if (ok) {
      commentStore.forEach((commentItem) => {
        if (commentItem.id === event.target.id) {
          deleteDoc(
            doc(dbService, `post/${postObj.id}/comment/${commentItem.id}`)
          );
        }
      });
    }
  };
  return (
    <div>
      <div className="post-box">
        <div className="creator-container">
          <div className="creator-img-name">
            {postObj.photoURL ? (
              <img
                className="post-creator-img"
                src={postObj.photoURL}
                alt="img"
              />
            ) : (
              <img className="post-creator-img" src={nullDisplay} alt="img" />
            )}
            <div className="post-creator-name">
              {postObj.displayName ?? `익명`}
            </div>
          </div>
          <div className="post-date">
            {new Date(postObj.createAt + 9 * 60 * 60 * 1000).toLocaleString(
              "ko-KR",
              {
                timeZone: "UTC",
              }
            )}
          </div>
        </div>
        <div className="post-container">
          <div>
            {postObj.attachmentUrl && (
              <img className="post-img" src={postObj.attachmentUrl} alt="img" />
            )}
          </div>
          {editing ? (
            <div>
              <form className="edit-container" onSubmit={onSubmit}>
                <div>
                  <input
                    className="edit-text"
                    type="text"
                    placeholder="Edit your post"
                    value={newPost}
                    required
                    onChange={onChange}
                  />
                </div>
                <button
                  className="submit-btn"
                  type="submit"
                  value="Update Post"
                >
                  <img src={ok} className="ok-icon" alt="ok-icon" />
                </button>
                <button
                  className="edit-btn"
                  type="button"
                  onClick={toggleEditing}
                >
                  <img className="cancel-icon" src={cancel} alt="cancel" />
                </button>
              </form>
            </div>
          ) : (
            <div>
              <div className="post-title">{postObj.text}</div>
              {isOwner && (
                <>
                  <button className="edit-btn" onClick={toggleEditing}>
                    <img className="cancel-icon" src={edit} alt="cancel" />
                  </button>
                  <button className="delete-btn" onClick={onDeleteClick}>
                    <img
                      className="cancel-icon"
                      src={deleteIcon}
                      alt="cancel"
                    />
                  </button>
                </>
              )}
            </div>
          )}
          {commentWrite ? (
            <div className="comment-wrap">
              <form onSubmit={onCommentSubmit}>
                <button
                  className="toggle-btn"
                  type="button"
                  onClick={() => {
                    setCommentWrite(!commentWrite);
                  }}
                >
                  Cancel
                </button>
                <input
                  className="comment-input"
                  value={comment}
                  onChange={onCommentChange}
                  type="text"
                  placeholder="댓글을 달아보세요!"
                  maxLength={120}
                  required
                />
                <button className="comment-submit-btn">Ok</button>
              </form>
              <div className="comment-list-wrap">
                {commentStore.map((comment) => (
                  <div className="comment-list-container" key={comment.id}>
                    <div className="comment-list">
                      <div className="comment-name">
                        {comment.displayName ?? "익명"}
                      </div>
                      <div className="comment-text">{comment.text}</div>
                    </div>
                    <div className="comment-date">
                      {new Date(
                        comment.createAt + 9 * 60 * 60 * 1000
                      ).toLocaleString("ko-KR", {
                        timeZone: "UTC",
                      })}
                    </div>
                    {globalUser.uid === comment.creatorId ? (
                      <button
                        className="comment-delete-btn"
                        id={comment.id}
                        onClick={onCommentDelete}
                      >
                        Delete
                      </button>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="comment-wrap">
              <button
                className="toggle-btn"
                type="button"
                onClick={() => {
                  setCommentWrite(!commentWrite);
                }}
              >
                Go to Comments({commentStore.length}개)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Post;
