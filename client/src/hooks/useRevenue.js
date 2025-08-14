import { useEffect, useState } from "react";
import { collection, getDocs, query, where, Timestamp } from "firebase/firestore";
import { db } from "../firebase";

const useRevenue = () => {
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [yearlyRevenue, setYearlyRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const now = new Date();

        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfYear = new Date(now.getFullYear(), 0, 1);

        const startOfMonthTS = Timestamp.fromDate(startOfMonth);
        const startOfYearTS = Timestamp.fromDate(startOfYear);

        const revenueRef = collection(db, "planrevenues");

        const monthlyQuery = query(revenueRef, where("timestamp", ">=", startOfMonthTS));
        const yearlyQuery = query(revenueRef, where("timestamp", ">=", startOfYearTS));

        const [monthlySnap, yearlySnap] = await Promise.all([
          getDocs(monthlyQuery),
          getDocs(yearlyQuery),
        ]);

        const monthlyTotal = monthlySnap.docs.reduce((sum, doc) => {
          const data = doc.data();
          return sum + (data.amount || 0);
        }, 0);

        const yearlyTotal = yearlySnap.docs.reduce((sum, doc) => {
          const data = doc.data();
          return sum + (data.amount || 0);
        }, 0);

        setMonthlyRevenue(monthlyTotal);
        setYearlyRevenue(yearlyTotal);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching revenue:", error);
        setLoading(false);
      }
    };

    fetchRevenue();
  }, []);

  return { monthlyRevenue, yearlyRevenue, loading };
};

export default useRevenue;