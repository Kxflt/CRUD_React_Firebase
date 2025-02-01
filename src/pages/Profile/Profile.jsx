import { useState, useEffect } from "react";
import styles from "./Profile.module.css";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db, FirebaseAuth } from "../../firebase/config";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState({
    name: "",
    lastName: "",
    address: "",
    postalCode: "",
    city: "",
    birthDate: "",
    hobbies: [],
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);

  const hobbiesList = [
    { id: 1, name: "Deportes" },
    { id: 2, name: "Música" },
    { id: 3, name: "Lectura" },
    { id: 4, name: "Cine" },
    { id: 5, name: "Cocina" },
    { id: 6, name: "Viajar" },
    { id: 7, name: "Gaming" },
    { id: 8, name: "Pasear" },
    { id: 9, name: "Playa" },
    { id: 10, name: "Montaña" },
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      FirebaseAuth,
      async (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
          const userRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            setProfileData(docSnap.data());
          }
        } else {
          setUser(null);
        }
      }
    );

    return () => unsubscribe();
  }, []);

  const validateForm = () => {
    let formErrors = {};

    if (!profileData.name.trim()) formErrors.name = "El nombre es requerido";
    if (!profileData.lastName.trim())
      formErrors.lastName = "El apellido es requerido";
    if (!profileData.address.trim())
      formErrors.address = "La dirección es requerida";
    if (!profileData.postalCode.trim())
      formErrors.postalCode = "El código postal es requerido";
    if (!/^\d{5}$/.test(profileData.postalCode))
      formErrors.postalCode = "El código postal debe tener 5 dígitos";
    if (!profileData.city.trim()) formErrors.city = "La ciudad es requerida";
    if (!profileData.birthDate)
      formErrors.birthDate = "La fecha de nacimiento es requerida";

    const today = new Date();
    const birthDate = new Date(profileData.birthDate);
    if (birthDate > today)
      formErrors.birthDate = "La fecha de nacimiento no puede ser futura";

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (validateForm()) {
      try {
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, profileData, { merge: true });
        await updateProfile(user, {
          displayName: `${profileData.name} ${profileData.lastName}`,
        });
        setMessage({ type: "success", text: "Perfil actualizado con éxito" });
      } catch (error) {
        setMessage({
          type: "error",
          text: `Error al actualizar perfil: ${error.message}`,
        });
      }
    } else {
      setMessage({
        type: "error",
        text: "Por favor, corrija los errores en el formulario",
      });
    }
  };

  const handleHobbyChange = (hobbyId) => {
    const hobbyIndex = profileData.hobbies.indexOf(hobbyId);
    if (hobbyIndex === -1) {
      setProfileData((prevData) => ({
        ...prevData,
        hobbies: [...prevData.hobbies, hobbyId],
      }));
    } else {
      setProfileData((prevData) => ({
        ...prevData,
        hobbies: prevData.hobbies.filter((id) => id !== hobbyId),
      }));
    }
  };

  if (!user) {
    return <p>No estás logueado. Por favor, inicia sesión.</p>;
  }

  return (
    <div className={styles.profile}>
      <h2>Perfil del usuario</h2>
      {message && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.text}
        </div>
      )}
      <form onSubmit={handleUpdateProfile}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Nombre:</label>
          <input
            id="name"
            name="name"
            type="text"
            value={profileData.name}
            onChange={(e) =>
              setProfileData((prevData) => ({
                ...prevData,
                name: e.target.value,
              }))
            }
          />
          {errors.name && <span className={styles.error}>{errors.name}</span>}
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="lastName">Apellidos:</label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            value={profileData.lastName}
            onChange={(e) =>
              setProfileData((prevData) => ({
                ...prevData,
                lastName: e.target.value,
              }))
            }
          />
          {errors.lastName && (
            <span className={styles.error}>{errors.lastName}</span>
          )}
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="address">Dirección:</label>
          <input
            id="address"
            name="address"
            type="text"
            value={profileData.address}
            onChange={(e) =>
              setProfileData((prevData) => ({
                ...prevData,
                address: e.target.value,
              }))
            }
          />
          {errors.address && (
            <span className={styles.error}>{errors.address}</span>
          )}
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="postalCode">Código postal:</label>
          <input
            id="postalCode"
            name="postalCode"
            type="text"
            value={profileData.postalCode}
            onChange={(e) =>
              setProfileData((prevData) => ({
                ...prevData,
                postalCode: e.target.value,
              }))
            }
          />
          {errors.postalCode && (
            <span className={styles.error}>{errors.postalCode}</span>
          )}
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="city">Ciudad:</label>
          <input
            id="city"
            name="city"
            type="text"
            value={profileData.city}
            onChange={(e) =>
              setProfileData((prevData) => ({
                ...prevData,
                city: e.target.value,
              }))
            }
          />
          {errors.city && <span className={styles.error}>{errors.city}</span>}
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="birthDate">Fecha de nacimiento:</label>
          <input
            id="birthDate"
            name="birthDate"
            type="date"
            value={profileData.birthDate}
            onChange={(e) =>
              setProfileData((prevData) => ({
                ...prevData,
                birthDate: e.target.value,
              }))
            }
          />
          {errors.birthDate && (
            <span className={styles.error}>{errors.birthDate}</span>
          )}
        </div>
        <div className={styles.hobbies}>
          <h3>Aficiones:</h3>
          {hobbiesList.map((hobby) => (
            <div key={hobby.id}>
              <input
                type="checkbox"
                id={`hobby-${hobby.id}`}
                checked={profileData.hobbies.includes(hobby.id)}
                onChange={() => handleHobbyChange(hobby.id)}
              />
              <label htmlFor={`hobby-${hobby.id}`}>{hobby.name}</label>
            </div>
          ))}
        </div>
        <button type="submit">Actualizar perfil</button>
      </form>
    </div>
  );
};

export default Profile;
