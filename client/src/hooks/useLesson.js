import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";

const useLesson = (languageId, courseId) => {
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    if (!languageId) return;
    if (!courseId) return;

    const unsub = onSnapshot(
      collection(db, "languages", languageId, "courses", courseId, "lessons"),
      (snapshot) => {
        setLessons(snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            lessonid: doc.id,
            description: data.description,
            imagepath: data.imagepath || "",
          };
        }));
      }
    );

    return () => unsub();
  }, [languageId, courseId]);

  return lessons;
};

export default useLesson;
