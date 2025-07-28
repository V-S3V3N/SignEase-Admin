import { db } from "../firebase";
import { collection, doc, updateDoc, addDoc, setDoc } from "firebase/firestore";
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
      const courseId = courseData.name;
      const courseDocRef = doc(courseCollection, courseId);

      const processedCourseData = {
        ...courseData,
        numberoflessons: parseInt(courseData.numberoflessons) || 0,
      };

      await setDoc(courseDocRef, processedCourseData);

      await createLessons(languageid, courseId, lessonForms);
      await createTests(languageid, courseId, testData, questionForms);
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
      let imageUrl = "";

      if (question.imageFile) {
        const storageRef = ref(
          storage,
          `question_images/${courseId}_${i}_${question.imageFile.name}`
        );
        await uploadBytes(storageRef, question.imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      questionsArray.push({
        answer: question.testAnswer,
        questionimagepath: imageUrl,
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
