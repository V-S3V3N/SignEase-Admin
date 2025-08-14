import { db } from "../firebase";
import { collection, doc, updateDoc, addDoc, getDoc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useState } from "react";

const useCourseActions = (languageId) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createCourse = async (
    languageid,
    courseData,
    lessonForms,
    testData,
    questionForms
  ) => {
    setLoading(true);
    setError(null);
    try {
      const courseCollection = collection(
        db,
        "languages",
        languageid,
        "courses"
      );
      const courseId = courseData.name.toLowerCase().replace(/\s+/g, "-");
      const courseDocRef = doc(courseCollection, courseId);

      //check if course already exists
      const existingCourse = await getDoc(courseDocRef);
      if (existingCourse.exists()) {
        return { success: false, message: "A course with this name already exists!" };
      }

      const processedCourseData = {
        ...courseData,
        numberoflessons: parseInt(courseData.numberoflessons) || 0,
      };

      await setDoc(courseDocRef, processedCourseData);

      await createLessons(languageid, courseId, lessonForms);
      await createTests(languageid, courseId, testData, questionForms);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
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
      let mediaUrl = "";

      if (lesson.mediaFile) {
        const storageRef = ref(
          storage,
          `lesson_media/${courseId}_${i}_${lesson.mediaFile.name}`
        );
        await uploadBytes(storageRef, lesson.mediaFile);
        mediaUrl = await getDownloadURL(storageRef);
      }

      await addDoc(lessonCollection, {
        name: lesson.lessonName,
        description: lesson.lessonDescription,
        mediapath: mediaUrl,
        mediatype: lesson.mediaType,
      });
    }
  };

  const createTests = async (languageid, courseId, testData, questionForms) => {
    const storage = getStorage();
    const testCollection = collection(
      db,
      "languages",
      languageid,
      "courses",
      courseId,
      "tests"
    );

    const testDocId = `${courseId}_test`;

    const questionsArray = [];

    for (let i = 0; i < questionForms.length; i++) {
      const question = questionForms[i];
      let mediaUrl = "";

      if (question.mediaFile) {
        const storageRef = ref(
          storage,
          `question_media/${courseId}_${i}_${question.mediaFile.name}`
        );
        await uploadBytes(storageRef, question.mediaFile);
        mediaUrl = await getDownloadURL(storageRef);
      }

      questionsArray.push({
        answer: question.testAnswer,
        questionmediapath: mediaUrl,
        mediatype: question.mediaType,
      });
    }

    const testDocRef = doc(testCollection, testDocId);
    await setDoc(testDocRef, {
      description: testData.description,
      passingscore: parseInt(testData.passingscores) || 0,
      totalquestions: parseInt(testData.totalquestions) || 0,
      questions: questionsArray,
    });
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
