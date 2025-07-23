import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";

const usePlan = (reloadTrigger) => {
  const [planData, setPlanData] = useState([]);

  useEffect(() => {
  let unsubscribe;

  const fetchData = async () => {
    const plansSnap = await getDocs(collection(db, "plans"));
    const allPlans = plansSnap.docs.map((doc) => ({
      planid: doc.id,
      ...doc.data(),
      totalEarnings: 0,
    }));

    unsubscribe = onSnapshot(collection(db, "planrevenues"), (snapshot) => {
      const revenueByPlan = {};

      snapshot.docs.forEach((docSnap) => {
        const { planid, amount } = docSnap.data();
        if (!planid || amount === undefined) return;

        revenueByPlan[planid] = (revenueByPlan[planid] || 0) + Number(amount);
      });

      const merged = allPlans.map((plan) => ({
        ...plan,
        totalEarnings: revenueByPlan[plan.planid] || 0,
      }));

      setPlanData(merged);
    });
  };

  fetchData();

  return () => {
    if (unsubscribe) unsubscribe();
  };
}, [reloadTrigger]);


  return planData;
};

export default usePlan;
