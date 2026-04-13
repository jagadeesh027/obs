import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { User } from "../types";
import { seedFirestore } from "../seed";
import { handleFirestoreError, OperationType } from "../lib/firestore-errors";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);

          let userData: User;
          if (userDoc.exists()) {
            userData = userDoc.data() as User;
          } else {
            // Create a new user profile if it doesn't exist
            userData = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || "",
              role: firebaseUser.email === "jagadeeshnaidu027@gmail.com" ? "admin" : "client",
              name: firebaseUser.displayName || "",
            };
            await setDoc(userDocRef, userData);
          }
          
          setUser(userData);
          if (userData.role === "admin") {
            seedFirestore().catch(err => {
              console.error("Seed error caught in AuthContext:", err);
            });
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${firebaseUser.uid}`);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    loading,
    isAdmin: user?.role === "admin",
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
