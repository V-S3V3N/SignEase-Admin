import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";

const useTest = (languageId, courseId) => {
  const [tests, setTests] = useState([]);

  useEffect(() => {
    if (!languageId) return;
    if (!courseId) return;

    const unsub = onSnapshot(
      collection(db, "languages", languageId, "courses", courseId, "tests"),
      (snapshot) => {
        setTests(snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            testid: doc.id,
            description: data.description,
            passingscore: data.passingscore,
            questions: data.questions || [],
            totalquestions: data.totalquestions,
          };
        }));
      }
    );

    return () => unsub();
  }, [languageId, courseId]);

  return tests;
};

export default useTest;