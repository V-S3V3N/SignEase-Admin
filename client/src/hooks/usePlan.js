// import { collection, onSnapshot } from "firebase/firestore";
// import { useEffect, useState } from "react";
// import { db } from "../firebase";

// // this will fetch plan revenue data and merge it with plan details --> to show which plan is generating which revenue
// const usePlan = () => {
//   const [planData, setPlanData] = useState([]);

//   useEffect(() => {
//     const unsubscribe = onSnapshot(collection(db, "planrevenues"), async (snapshot) => {
//       const dataWithPlanDetails = await Promise.all(
//         snapshot.docs.map(async (docSnap) => {
//           const revenue = docSnap.data();
//           const planId = docSnap.id;

//           // Reference to the matching plan document
//           const planRef = doc(db, "plans", planId);
//           const planSnap = await getDoc(planRef);

//           return {
//             planId,
//             ...revenue,
//             ...(planSnap.exists() ? planSnap.data() : {}) // merges name, desc, etc.
//           };
//         })
//       );

//       setPlanData(dataWithPlanDetails);
//     });

//     return () => unsubscribe();
//   }, []);

//   return planData;
// };

// export default usePlan;


