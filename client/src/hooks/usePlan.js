import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";

const usePlan = () => {
  const [planData, setPlanData] = useState([]);

  useEffect(() => {
    // Step 1: Fetch all plans
    const fetchData = async () => {
      const plansSnap = await getDocs(collection(db, "plans"));
      const allPlans = plansSnap.docs.map((doc) => ({
        planid: doc.id,
        ...doc.data(),
        totalEarnings: 0, // default to 0
      }));

      // Step 2: Refer to planrevenues collection and calculate total earnings
      const unsubscribe = onSnapshot(collection(db, "planrevenues"), (snapshot) => {
        const revenueByPlan = {};

        snapshot.docs.forEach((docSnap) => {
          const { planid, amount } = docSnap.data();
          if (!planid || amount === undefined) return;

          if (!revenueByPlan[planid]) {
            revenueByPlan[planid] = 0;
          }

          revenueByPlan[planid] += Number(amount);
        });

        // Step 3: Merge revenue into allPlans
        const merged = allPlans.map((plan) => ({
          ...plan,
          totalEarnings: revenueByPlan[plan.planid] || 0,
        }));

        setPlanData(merged);
      });
     return unsubscribe;
    };

    fetchData();
  }, []);

  return planData;
};

export default usePlan;
