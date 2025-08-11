import { db } from "../firebase";
import { collection, doc, deleteDoc, updateDoc, addDoc } from "firebase/firestore";
import { useState } from "react";

const useUserActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateUser = async (userId, updatedData) => {
    setLoading(true);
    setError(null);

    // Extracting fields to save, excluding userid and totalEarnings
    const { userid: _uid, ...fieldsToSave } = updatedData;
    try {
      await updateDoc(doc(db, "users", userId), fieldsToSave);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    updateUser,
    loading,
    error,
  };
};

export default useUserActions;
