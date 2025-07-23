import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";

const useCourse = (languageId) => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    if (!languageId) return;

    const unsub = onSnapshot(
      collection(db, "languages", languageId, "courses"),
      (snapshot) => {
        setCourses(snapshot.docs.map(doc => ({ courseid: doc.id, ...doc.data() })));
      }
    );

    return () => unsub();
  }, [languageId]);

  return courses;
};

export default useCourse;
