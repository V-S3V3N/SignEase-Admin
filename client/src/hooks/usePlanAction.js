import { db } from "../firebase";
import {
  collection,
  doc,
  where,
  query,
  getDocs,
  updateDoc,
  addDoc,
} from "firebase/firestore";
import { useState } from "react";

const usePlanActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createPlan = async (planData) => {
    setLoading(true);
    setError(null);
    try {
      // check if a plan with the same name already exists
      const plansRef = collection(db, "plans");
      const q = query(plansRef, where("name", "==", planData.name));
      const querySnapshot = await getDocs(q);

      // if a plan with the same name exists, throw an error
      if (!querySnapshot.empty) {
        return { success: false, message: "A plan with this name already exists!" };
      }

      await addDoc(plansRef, planData);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
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
