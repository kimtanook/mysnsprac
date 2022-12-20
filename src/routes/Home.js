/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect} from "react";
import Post from "../components/Post";
import PostFactory from "../components/PostFactory";
import {useDispatch, useSelector} from "react-redux";
import {getPost} from "../redux/modules/postsObj";
import logo from "../images/logo.png";

const Home = () => {
  const globalUser = useSelector((state) => state.userObj.users);
  const globalPost = useSelector((state) => state.postsObj.posts);
  const globalLoading = useSelector((state) => state.postsObj.status);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPost());
  }, []);

  return (
    <div className="home-container">
      <div className="home-title">
        <img className="home-logo" src={logo} />
      </div>
      <PostFactory />
      {globalLoading === "Loading" ? (
        <div className="loading-mark">Loading...</div>
      ) : (
        <div>
          {globalPost.map((post) => (
            <Post
              key={post.id}
              postObj={post}
              isOwner={post.creatorId === globalUser.uid}
            />
          ))}
        </div>
      )}
    </div>
  );
};
export default Home;
