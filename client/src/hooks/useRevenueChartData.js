import { useEffect, useState } from "react";
import { collection, getDocs} from "firebase/firestore";
import { db } from "../firebase";

function useRevenueChartData() {
  const [monthlyRevenueArray, setMonthlyRevenueArray] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMonthlyData = async () => {
      const snapshot = await getDocs(collection(db, "planrevenues"));
      const monthlyTotals = Array(12).fill(0);

      snapshot.forEach(doc => {
        const data = doc.data();
        const timestamp = data.timestamp?.toDate?.();
        const monthIndex = timestamp?.getMonth(); // 0 for Jan, 1 for Feb, etc.
        if (monthIndex !== undefined) {
          monthlyTotals[monthIndex] += data.amount || 0;
        }
      });

      setMonthlyRevenueArray(monthlyTotals);
      setLoading(false);
    };

    fetchMonthlyData();
  }, []);

  return { monthlyRevenueArray, loading };
}

export default useRevenueChartData;
