import { db } from "../firebase";
import { collection, doc, updateDoc, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useState } from "react";

const useCourseActions = (languageId) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createCourse = async (languageid, courseData, lessonForms) => {
    setLoading(true);
    setError(null);
    try {
      // 1. Add the course
      const courseRef = await addDoc(
        collection(db, "languages", languageid, "courses"),
        courseData
      );

      await createLessons(languageid, courseRef.id, lessonForms);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createLessons = async (languageid, courseId, lessonForms) => {
    const storage = getStorage();
    const lessonCollection = collection(
      db,
      "languages",
      languageid,
      "courses",
      courseId,
      "lessons"
    );

    for (let i = 0; i < lessonForms.length; i++) {
      const lesson = lessonForms[i];
      let imageUrl = "";

      if (lesson.imageFile) {
        const storageRef = ref(
          storage,
          `lesson_images/${courseId}_${i}_${lesson.imageFile.name}`
        );
        await uploadBytes(storageRef, lesson.imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      await addDoc(lessonCollection, {
        name: lesson.lessonName,
        description: lesson.lessonDescription,
        imagepath: imageUrl,
      });
    }
  };

  const updateCourse = async (courseId, updatedData) => {
    setLoading(true);
    setError(null);
    const { courseid: _cid, ...fieldsToSave } = updatedData;
    try {
      await updateDoc(
        doc(db, "languages", languageId, "courses", courseId),
        fieldsToSave
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    createCourse,
    updateCourse,
    loading,
    error,
  };
};

export default useCourseActions;
