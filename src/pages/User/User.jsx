import { useState, useEffect } from "react";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { FirebaseAuth, db } from "../../firebase/config";
import styles from "./User.module.css";

const User = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    lastName: "",
    email: "",
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
            setUserData({ ...docSnap.data(), email: currentUser.email });
          } else {
            setUserData({ ...userData, email: currentUser.email });
          }
        } else {
          setUser(null);
          setUserData({
            name: "",
            lastName: "",
            email: "",
            address: "",
            postalCode: "",
            city: "",
            birthDate: "",
            hobbies: [],
          });
        }
      }
    );

    return () => unsubscribe();
  }, []);

  const validateForm = () => {
    let formErrors = {};

    if (!userData.name.trim()) formErrors.name = "El nombre es requerido";
    if (!userData.lastName.trim())
      formErrors.lastName = "El apellido es requerido";
    if (!userData.address.trim())
      formErrors.address = "La dirección es requerida";
    if (!userData.postalCode.trim())
      formErrors.postalCode = "El código postal es requerido";
    if (!/^\d{5}$/.test(userData.postalCode))
      formErrors.postalCode = "El código postal debe tener 5 dígitos";
    if (!userData.city.trim()) formErrors.city = "La ciudad es requerida";
    if (!userData.birthDate)
      formErrors.birthDate = "La fecha de nacimiento es requerida";

    const today = new Date();
    const birthDate = new Date(userData.birthDate);
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
        await setDoc(userRef, userData, { merge: true });
        await updateProfile(user, {
          displayName: `${userData.name} ${userData.lastName}`,
        });
        setMessage({ type: "success", text: "Perfil actualizado con éxito" });
        setIsEditing(false);
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
    const hobbyIndex = userData.hobbies.indexOf(hobbyId);
    if (hobbyIndex === -1) {
      setUserData((prevData) => ({
        ...prevData,
        hobbies: [...prevData.hobbies, hobbyId],
      }));
    } else {
      setUserData((prevData) => ({
        ...prevData,
        hobbies: prevData.hobbies.filter((id) => id !== hobbyId),
      }));
    }
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    setErrors({});
    setMessage(null);
  };

  if (!user) {
    return <p>Cargando datos del usuario...</p>;
  }
  const formatearFecha = (fechaOriginal) => {
    if (!fechaOriginal) return "";
    const [año, mes, dia] = fechaOriginal.split("-");
    return `${dia}/${mes}/${año}`;
  };

  return (
    <div className={styles.userCard}>
      <h2>Mi Ficha</h2>
      {message && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.text}
        </div>
      )}
      {!isEditing ? (
        <div className={styles.userInfo}>
          <p>
            <strong>Nombre:</strong> {userData.name}
          </p>
          <p>
            <strong>Apellidos:</strong> {userData.lastName}
          </p>
          <p>
            <strong>Email:</strong> {userData.email}
          </p>
          <p>
            <strong>Dirección:</strong> {userData.address}
          </p>
          <p>
            <strong>Código Postal:</strong> {userData.postalCode}
          </p>
          <p>
            <strong>Ciudad:</strong> {userData.city}
          </p>
          <p>
            <strong>Fecha de Nacimiento:</strong>{" "}
            {formatearFecha(userData.birthDate)}
          </p>

          <div>
            <strong>Aficiones:</strong>
            <ul>
              {userData.hobbies.map((hobbyId) => {
                const hobby = hobbiesList.find((h) => h.id === hobbyId);
                return hobby ? <li key={hobbyId}>{hobby.name}</li> : null;
              })}
            </ul>
          </div>
          <button onClick={toggleEditMode}>Editar Perfil</button>
        </div>
      ) : (
        <form onSubmit={handleUpdateProfile}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Nombre:</label>
            <input
              id="name"
              name="name"
              type="text"
              value={userData.name}
              onChange={(e) =>
                setUserData({ ...userData, name: e.target.value })
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
              value={userData.lastName}
              onChange={(e) =>
                setUserData({ ...userData, lastName: e.target.value })
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
              value={userData.address}
              onChange={(e) =>
                setUserData({ ...userData, address: e.target.value })
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
              value={userData.postalCode}
              onChange={(e) =>
                setUserData({ ...userData, postalCode: e.target.value })
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
              value={userData.city}
              onChange={(e) =>
                setUserData({ ...userData, city: e.target.value })
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
              value={userData.birthDate}
              onChange={(e) =>
                setUserData({ ...userData, birthDate: e.target.value })
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
                  checked={userData.hobbies.includes(hobby.id)}
                  onChange={() => handleHobbyChange(hobby.id)}
                />
                <label htmlFor={`hobby-${hobby.id}`}>{hobby.name}</label>
              </div>
            ))}
          </div>
          <button type="submit">Guardar Cambios</button>
          <button type="button" onClick={toggleEditMode}>
            Cancelar
          </button>
        </form>
      )}
    </div>
  );
};

export default User;
