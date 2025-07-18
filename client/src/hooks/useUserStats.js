import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

export const useUserStats = () => {
  const [nonAdminUsers, setNonAdminUsers] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const usersRef = collection(db, "users");
        // Get all users documents then count those that are not admin
        const allUsersSnapshot = await getDocs(usersRef);
        const allUsers = allUsersSnapshot.docs.map((doc) => doc.data());
        const nonAdmins = allUsers.filter((user) => user.role !== "admin");
        setNonAdminUsers(nonAdmins.length);
      } catch (error) {
        console.error("Error fetching user stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, []);

  return { nonAdminUsers, loading };
};
