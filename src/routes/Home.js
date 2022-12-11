import React, { useEffect } from 'react';
import Post from '../components/Post';
import { dbService } from '../firebase.js';
import { collection, orderBy, query, onSnapshot } from 'firebase/firestore';
import PostFactory from '../components/PostFactory';
import '../css/style.css';
import { useDispatch, useSelector } from 'react-redux';
import { postActions } from '../redux/modules/postsObj';

const Home = () => {
  const globalUser = useSelector((state) => state.userObj.users);
  const globalPost = useSelector((state) => state.postsObj.posts);
  const dispatch = useDispatch();

  useEffect(() => {
    const q = query(collection(dbService, 'post'), orderBy('createAt', 'desc'));
    onSnapshot(q, (querySnapshot) => {
      const postsArr = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      dispatch(postActions.getPosts(postsArr));
    });
  }, []);

  return (
    <div className="home-container">
      <div className="home-title"></div>
      <PostFactory />
      <div>
        {globalPost.map((post) => (
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
export default Home;
