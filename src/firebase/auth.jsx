import { FirebaseAuth } from "./config";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";

const getErrorMessage = (code) => {
  switch (code) {
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "Credenciales incorrectas. Por favor, verifica tu email y contraseña.";
    case "auth/invalid-email":
      return "El email proporcionado no es válido.";
    case "auth/user-disabled":
      return "Esta cuenta ha sido deshabilitada.";
    case "auth/email-already-in-use":
      return "Ya existe una cuenta con este email.";
    default:
      return "Ocurrió un error durante la autenticación. Por favor, inténtalo de nuevo.";
  }
};

export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      FirebaseAuth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    throw new Error(getErrorMessage(error.code));
  }
};

export const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      FirebaseAuth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    throw new Error(getErrorMessage(error.code));
  }
};

export const logOut = async () => {
  try {
    await signOut(FirebaseAuth);
  } catch (error) {
    throw new Error(getErrorMessage(error.code));
  }
};
