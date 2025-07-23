import { db } from "../firebase";
import { collection, doc, deleteDoc, updateDoc, addDoc } from "firebase/firestore";
import { useState } from "react";

const usePlanActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createPlan = async (planData) => {
    setLoading(true);
    setError(null);
    try {
      await addDoc(collection(db, "plans"), planData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updatePlan = async (planId, updatedData) => {
    setLoading(true);
    setError(null);

    // Extracting fields to save, excluding planid and totalEarnings
    const { planid: _pid, totalEarnings, ...fieldsToSave } = updatedData;
    try {
      await updateDoc(doc(db, "plans", planId), fieldsToSave);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    createPlan,
    updatePlan,
    loading,
    error,
  };
};

export default usePlanActions;
