import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

const useUser = (reloadTrigger) => {
  const [nonAdminUsers, setNonAdminUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const usersRef = collection(db, "users");
        // Get all users documents then count those that are not admin
        const allUsersSnapshot = await getDocs(usersRef);
        const nonAdmins = allUsersSnapshot.docs
          .filter((doc) => doc.data().role !== "admin")
          .map(doc => {
            const data = doc.data();
            return {
              userid: doc.id,
              username: data.username,
              email: data.email,
              dob: data.dob,
              emailverified: data.emailverified,
              firstname: data.firstname,
              lastname: data.lastname,
              gender: data.gender,
              profilepicpath: data.profilepicpath,
              suspended: data.suspended,
              createdat: data.createdat?.toDate ? data.createdat.toDate().toLocaleDateString() : "",
            };
          });
        
        setNonAdminUsers(nonAdmins);
      } catch (error) {
        console.error("Error fetching user stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [reloadTrigger]);

  return { nonAdminUsers, loading };
};

export default useUser;