import React, {useRef, useState} from "react";
import {authService, storageService} from "../firebase";
import {signOut, updateProfile} from "firebase/auth";
import {getDownloadURL, ref, uploadString} from "firebase/storage";
import {useSelector} from "react-redux";
import Post from "../components/Post";
import logoutIcon from "../images/logout_icon.jpg";

const Profile = ({refreshUser}) => {
  const globalUser = useSelector((state) => state.userObj.users);
  const globalPost = useSelector((state) => state.postsObj.posts);

  const [editing, setEditing] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState(globalUser.displayName);
  const [newProfileImg, setNewProfileImg] = useState("");

  const logout = () => {
    signOut(authService)
      .then(() => {
        // Sign-out successful.
        localStorage.clear();
        console.log("로그아웃 성공");
      })
      .catch((error) => {
        // An error happened.
        console.log("error:", error);
      });
  };
  // 프로필 사진과 닉네임 수정 저장.
  const onSubmit = async (event) => {
    event.preventDefault();
    const newCurrentUser = authService.currentUser;

    if (newProfileImg !== newCurrentUser.photoURL) {
      const imgRef = ref(
        storageService,
        `userProfileImgs/${authService.currentUser.uid}`
      );
      const response = await uploadString(imgRef, newProfileImg, "data_url");
      const attachmentUrl = await getDownloadURL(response.ref, imgRef);
      updateProfile(newCurrentUser, {
        ...newCurrentUser,
        photoURL: attachmentUrl,
      });
    }
    await updateProfile(authService.currentUser, {
      displayName: newDisplayName,
    });

    alert("수정 완료!");
    refreshUser();
    toggleEditing();
  };

  const onChange = (event) => {
    setNewDisplayName(event.target.value);
  };

  const fileInput = useRef();

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
      setNewProfileImg(result);
    };
  };
  // 내가 쓴 포스트들 가져오기
  const myPost = globalPost.filter((post) => post.creatorId === globalUser.uid);

  const toggleEditing = () => {
    setEditing((prev) => !prev);
    setNewProfileImg(authService.currentUser.photoURL);
  };

  return (
    <div className="profile-container">
      <img onClick={logout} className="logout-btn" src={logoutIcon} />

      <form className="profile-form" onSubmit={onSubmit}>
        {editing ? (
          <div>
            <img
              className="profile-img"
              src={newProfileImg}
              width="150"
              height="150px"
              alt="img"
            />
            <div className="profile-name">{globalUser.displayName}</div>
            <button
              type="button"
              className="toggle-btn"
              onClick={toggleEditing}
            >
              취소
            </button>
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
              <input
                className="profile-display-name"
                onChange={onChange}
                type="text"
                placeholder="수정할 닉네임"
                value={newDisplayName}
                required
              />
            </div>
            <input
              className="profile-update"
              type="submit"
              value="Update Profile"
            />
          </div>
        ) : (
          <div>
            <img
              className="profile-img"
              src={authService.currentUser.photoURL}
              width="150"
              height="150px"
              alt="img"
            />
            <div className="profile-name">{globalUser.displayName}</div>
            <button
              type="button"
              className="toggle-btn"
              onClick={toggleEditing}
            >
              수정
            </button>
          </div>
        )}
      </form>
      <hr width="250px" />
      <div>
        {myPost.map((post) => (
          <Post
            key={post.id}
            postObj={post}
            isOwner={post.creatorId === globalUser.uid}
          />
        ))}
      </div>
    </div>
  );
};
export default Profile;
