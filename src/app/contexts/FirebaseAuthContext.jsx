import { createContext, useEffect, useReducer } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "firebase/auth";

import { firebaseConfig } from "app/config";
import Loading from "app/components/MatxLoading";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const initialAuthState = {
  user: null,
  isInitialized: false,
  isAuthenticated: false
};

const reducer = (state, action) => {
  switch (action.type) {
    case "FB_AUTH_STATE_CHANGED": {
      const { isAuthenticated, user } = action.payload;
      return { ...state, isAuthenticated, isInitialized: true, user };
    }
    default:
      return state;
  }
};

const FirebaseAuthContext = createContext({
  ...initialAuthState,
  method: "FIREBASE"
});

export const FirebaseAuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialAuthState);

  const signInWithEmail = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const register = (email, username, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const logout = () => signOut(auth);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      dispatch({
        type: "FB_AUTH_STATE_CHANGED",
        payload: {
          isAuthenticated: !!user,
          user: user
            ? {
                id: user.uid,
                email: user.email,
                avatar: user.photoURL,
                name: user.displayName || user.email
              }
            : null
        }
      });
    });

    return () => unsubscribe();
  }, []);

  return (
    <FirebaseAuthContext.Provider
      value={{
        ...state,
        method: "FIREBASE",
        signInWithEmail,
        signInWithGoogle,
        register,
        logout
      }}
    >
      {/* ALWAYS RENDER CHILDREN -> FIXES THE ERROR */}
      {!state.isInitialized ? <Loading /> : null}
      {children}
    </FirebaseAuthContext.Provider>
  );
};

export default FirebaseAuthContext;



