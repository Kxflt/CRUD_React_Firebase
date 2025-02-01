// src/firebase/auth.jsx
import { FirebaseAuth } from "./config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

export const signUp = async (email, password) => {
  try {
    await createUserWithEmailAndPassword(FirebaseAuth, email, password);
    console.log("Usuario creado con éxito");
  } catch (error) {
    console.error("Error al crear usuario:", error);
  }
};

export const signIn = async (email, password) => {
  try {
    await signInWithEmailAndPassword(FirebaseAuth, email, password);
    console.log("Inicio de sesión exitoso");
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
  }
};
