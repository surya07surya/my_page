import { useContext } from "react";
import FirebaseAuthContext from "app/contexts/FirebaseAuthContext";

export default function useAuth() {
  const context = useContext(FirebaseAuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside FirebaseAuthProvider");
  }

  return context;
}

