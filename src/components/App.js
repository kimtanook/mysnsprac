import AppRouter from "./Router";
import {useEffect, useState} from "react";
import {authService} from "../firebase";
import {onAuthStateChanged} from "firebase/auth";
import {useDispatch} from "react-redux";
import {userActions} from "../redux/modules/userObj";
import "../css/style.css";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    onAuthStateChanged(authService, (user) => {
      if (user) {
        setIsLoggedIn(true);
        dispatch(
          userActions.currentUser({
            displayName: user.displayName,
            photoURL: user.photoURL,
            uid: user.uid,
          })
        );
      } else {
        setIsLoggedIn(false);
        if (window.location.hash !== "") {
          window.location.replace("");
        }
      }
      setInit(true);
    });
  }, []);
  const refreshUser = () => {
    dispatch(
      userActions.currentUser({
        displayName: authService.currentUser.displayName,
        uid: authService.currentUser.uid,
      })
    );
  };

  return (
    <div>
      {init ? (
        <AppRouter refreshUser={refreshUser} isLoggedIn={isLoggedIn} />
      ) : (
        "initializing..."
      )}
    </div>
  );
}

export default App;
