import React, { useMemo, useState, useEffect } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import useCourse from "../hooks/useCourse";
import useCourseActions from "../hooks/useCourseAction";
import useLesson from "../hooks/useLesson";
import useTest from "../hooks/useTest";

const Course = () => {
  const [courseName, setCourseName] = useState("");
  const [courseCategory, setCourseCategory] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [numberofLessons, setNumberofLessons] = useState("");
  const [courseLanguage, setCourseLanguage] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("asl");
  const [numberofTests, setNumberofTests] = useState("");
  const [lessonForms, setLessonForms] = useState([]);
  const [questionForms, setQuestionForms] = useState([]);
  const [testDescription, setTestDescription] = useState("");
  const [testPassingScores, setTestPassingScores] = useState("");
  const courseData = useCourse(selectedLanguage);
  const { createCourse, updateCourse, loading, error } =
    useCourseActions(selectedLanguage);
  const [editRowId, setEditRowId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);
  const [showQuestions, setShowQuestions] = useState(false);
  const lessonsData = useLesson(selectedLanguage, selectedCourse?.courseid);
  const testsData = useTest(selectedLanguage, selectedCourse?.courseid);
  const [editLessonRowId, setEditLessonRowId] = useState(null);
  const [editLessonFormData, setEditLessonFormData] = useState({});
  const [originalData, setOriginalData] = useState(null);

  const handleClear = () => {
    setCourseName("");
    setCourseCategory("");
    setCourseDescription("");
    setNumberofLessons("");
    setCourseLanguage("");
    setLessonForms([]);
    setQuestionForms([]);
    setNumberofTests("");
    setTestDescription("");
    setTestPassingScores("");
  };

  const isPassingScoreValid = () => {
    const questions = parseInt(numberofTests, 10);
    const passingScore = parseInt(testPassingScores, 10);
    return (
      !testPassingScores ||
      !numberofTests ||
      (passingScore > 0 && passingScore < questions)
    );
  };

  const handleViewQuestions = (test) => {
    setSelectedTest(test);
    setShowQuestions(true);
  };

  const handleBackToTests = () => {
    setSelectedTest(null);
    setShowQuestions(false);
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();

    if (
      !courseName ||
      !courseCategory ||
      !courseDescription ||
      !numberofLessons ||
      !courseLanguage ||
      !numberofLessons ||
      !numberofTests ||
      lessonForms.some(
        (lesson) =>
          !lesson.lessonName || !lesson.lessonDescription || !lesson.mediaFile
      ) || // Ensure all lessons have names and descriptions and images
      questionForms.some(
        (test) => !test.testAnswer || !test.mediaFile // Ensure all tests have answers and images
      )
    ) {
      alert("Please fill in all fields.");
      return;
    }

    const newCourse = {
      category: courseCategory,
      description: courseDescription,
      name: courseName,
      numberoflessons: numberofLessons,
      enabled: true, // default to true
    };
    const newTest = {
      description: testDescription,
      passingscores: testPassingScores,
      totalquestions: numberofTests,
    };

    try {
      const result = await createCourse(
        courseLanguage,
        newCourse,
        lessonForms,
        newTest,
        questionForms
      );

      if (result.success) {
        alert("Course created successfully!");
      } else {
        alert(result.message || "Failed to create course. Please try again.");
        return;
      }

      handleClear();
    } catch (error) {
      console.error("Error creating course:", error);
      alert("Failed to create course. Please try again.");
    }
  };

  const handleEditClick = (row) => {
    setEditRowId(row.original.courseid);
    setEditFormData({ ...row.original });
    setOriginalData(row.original);
    setSelectedCourse(row.original);
    setSelectedTest(null);
    setShowQuestions(false);
  };

  const validateForm = () => {
    const errors = [];

    if (!editFormData.name?.toString().trim()) {
      errors.push("Course name is required");
    }
    if (!editFormData.category?.toString().trim()) {
      errors.push("Course category is required");
    }
    if (!editFormData.description?.toString().trim()) {
      errors.push("Course description is required");
    }

    if (errors.length > 0) {
      alert(errors.join("\n"));
      return false;
    }

    return true;
  };

  // const handleEditLessonClick = (row) => {
  //   setEditLessonRowId(row.original.lessonid);
  //   setEditLessonFormData({ ...row.original });
  // };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: name === "enabled" ? value === "true" : value,
    }));
  };

  const handleSaveClick = async (courseid) => {
    if (!validateForm()) {
      // revert to original data if validation fails
      setEditFormData(originalData);
      return;
    }
    try {
      await updateCourse(courseid, editFormData);
      setEditRowId(null);
    } catch (error) {
      // console.error("Error updating course:", error);
      // Revert to original data if update fails
      setEditFormData(originalData);
      alert("Failed to update course. Please try again.");
    }
    // handleReload();
  };

  const handleCancelClick = () => {
    setEditRowId(null);
    setEditFormData({});
    setSelectedCourse(null);
    setSelectedTest(null);
    setShowQuestions(false);
  };

  useEffect(() => {
    const num = parseInt(numberofLessons) || 0;
    const newForms = Array.from({ length: num }, (_, i) => ({
      lessonName: "",
      lessonDescription: "",
      mediaFile: null,
      mediaUrl: "",
      mediaType: "image",
    }));
    setLessonForms(newForms);
  }, [numberofLessons]);

  useEffect(() => {
    const num = parseInt(numberofTests) || 0;
    const newForms = Array.from({ length: num }, (_, i) => ({
      testAnswer: "",
      mediaFile: null,
      mediaUrl: "",
      mediaType: "image",
    }));
    setQuestionForms(newForms);
  }, [numberofTests]);

  const handleLessonMediaChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;
    const updated = [...lessonForms];
    const mediaType = file.type.startsWith("video/") ? "video" : "image";
    updated[index].mediaFile = file;
    updated[index].mediaType = mediaType;
    setLessonForms(updated);
  };

  const handleQuestionMediaChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;
    const updated = [...questionForms];
    const mediaType = file.type.startsWith("video/") ? "video" : "image";
    updated[index].mediaFile = file;
    updated[index].mediaType = mediaType;
    setQuestionForms(updated);
  };

  const MediaCell = ({ value, mediaType }) => {
    if (!value) return "No Media";

    if (mediaType === "video") {
      return (
        <video
          src={value}
          controls
          style={{ width: "300px", height: "300px", objectFit: "cover" }}
        >
          Your browser does not support video playback.
        </video>
      );
    } else {
      return (
        <img
          src={value}
          alt="Media"
          style={{ width: "300px", height: "300px", objectFit: "cover" }}
        />
      );
    }
  };

  const QuestionNumberCell = ({ row }) => {
    return row.index + 1;
  };

  const EnabledCell = ({ value }) => (value ? "Yes" : "No");

  const memoizedCourseData = useMemo(() => courseData || [], [courseData]);
  const memoizedLessonsData = useMemo(() => lessonsData || [], [lessonsData]);
  const memoizedTestsData = useMemo(() => testsData || [], [testsData]);
  const memoizedQuestionsData = useMemo(
    () => selectedTest?.questions || [],
    [selectedTest]
  );

  const columns = useMemo(
    () => [
      { Header: "Course Name", accessor: "name" },
      { Header: "Category", accessor: "category" },
      { Header: "Description", accessor: "description" },
      { Header: "Number of Lessons", accessor: "numberoflessons" },
      {
        Header: "Enabled",
        accessor: "enabled",
        Cell: EnabledCell, // Using the pre-defined component
      },
    ],
    []
  );

  const lessonsColumns = useMemo(
    () => [
      // { Header: "Lesson Name", accessor: "lessonName" },
      { Header: "Description", accessor: "description" },
      {
        Header: "Lessons Media",
        accessor: "mediapath",
        Cell: ({ row }) => (
          <MediaCell
            value={row.original.mediapath}
            mediaType={row.original.mediatype || "image"}
          />
        ),
      },
    ],
    []
  );

  const testsColumns = useMemo(
    () => [
      { Header: "Test Description", accessor: "description" },
      { Header: "Total Questions", accessor: "totalquestions" },
      { Header: "Passing Score", accessor: "passingscore" },
    ],
    []
  );

  const questionsColumns = useMemo(
    () => [
      {
        Header: "Question #",
        id: "questionNumber",
        Cell: QuestionNumberCell,
        width: 50,
        minWidth: 50,
        maxWidth: 100,
      },
      {
        Header: "Answer",
        accessor: "answer",
        width: 200,
        minWidth: 400,
      },
      {
        Header: "Question Media",
        accessor: "questionmediapath",
        Cell: ({ row }) => (
          <MediaCell
            value={row.original.questionmediapath}
            mediaType={row.original.mediatype || "image"}
          />
        ),
      },
    ],
    []
  );

  const mainTable = useTable(
    {
      columns,
      data: memoizedCourseData,
      initialState: {
        pageSize: 5,
        sortBy: [{ id: "name", desc: true }],
      },
    },
    useSortBy,
    usePagination
  );

  const lessonsTable = useTable(
    {
      columns: lessonsColumns,
      data: memoizedLessonsData,
    },
    useSortBy
  );

  const testsTable = useTable(
    {
      columns: testsColumns,
      data: memoizedTestsData,
    },
    useSortBy
  );

  const questionsTable = useTable(
    {
      columns: questionsColumns,
      data: memoizedQuestionsData,
    },
    useSortBy
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    nextPage,
    previousPage,
    state: { pageIndex },
  } = mainTable;

  const {
    getTableProps: getLessonsTableProps,
    getTableBodyProps: getLessonsTableBodyProps,
    headerGroups: lessonsHeaderGroups,
    prepareRow: prepareLessonsRow,
    rows: lessonsRows,
  } = lessonsTable;

  const {
    getTableProps: getTestsTableProps,
    getTableBodyProps: getTestsTableBodyProps,
    headerGroups: testsHeaderGroups,
    prepareRow: prepareTestsRow,
    rows: testsRows,
  } = testsTable;

  const {
    getTableProps: getQuestionsTableProps,
    getTableBodyProps: getQuestionsTableBodyProps,
    headerGroups: questionsHeaderGroups,
    prepareRow: prepareQuestionsRow,
    rows: questionsRows,
  } = questionsTable;

  return (
    <div className="container-fluid">
      {/* <!-- Page Heading --> */}
      <div className="d-sm-flex align-items-center justify-content-start mb-4">
        <h1 className="h3 mb-0 text-gray-800">Course</h1>
        &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
        <div className="position-relative" style={{ width: "300px" }}>
          <select
            className="form-select pe-5" // pe-5 = padding-end for space
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
          >
            <option value="asl">ASL: American Sign Language</option>
            <option value="msl">MSL: Malaysian Sign Language</option>
          </select>

          <span
            className="position-absolute top-50 end-0 translate-middle-y me-3"
            style={{ pointerEvents: "none" }}
          >
            <i className="bi bi-chevron-down text-muted"></i>
          </span>
        </div>
      </div>

      {/* <!-- Content Row --> */}
      <div className="row">
        <div className="col-lg-12">
          {/* <!-- Collapsable Card Example --> */}
          <div className="card shadow mb-4">
            {/* <!-- Card Header - Accordion --> */}
            <a
              href="#collapseCardExample"
              className="d-block card-header py-3"
              data-toggle="collapse"
              role="button"
              aria-expanded="true"
              aria-controls="collapseCardExample"
            >
              <h6 className="m-0 font-weight-bold text-primary">
                Create New Course
              </h6>
            </a>
            {/* <!-- Card Content - Collapse --> */}
            <div className="collapse show" id="collapseCardExample">
              <div className="card-body">
                <div className="row">
                  <div className="col-lg-4">
                    <form className="course-form">
                      <div className="form-group">
                        <strong>Language:</strong>
                        <select
                          className="form-control form-control-user"
                          value={courseLanguage}
                          onChange={(e) => setCourseLanguage(e.target.value)}
                        >
                          <option value="">Select Language...</option>
                          <option value="asl">
                            ASL: American Sign Language
                          </option>
                          <option value="msl">
                            MSL: Malaysian Sign Language
                          </option>
                        </select>
                      </div>
                      <div className="form-group">
                        <strong>Course Name:</strong>
                        <input
                          type="text"
                          className="form-control form-control-user"
                          placeholder="Enter Course Name..."
                          value={courseName}
                          onChange={(e) => setCourseName(e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <strong>Course Category:</strong>
                        <input
                          type="text"
                          className="form-control form-control-user"
                          placeholder="Enter Course Category..."
                          value={courseCategory}
                          onChange={(e) => setCourseCategory(e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <strong>Course Description:</strong>
                        <input
                          type="text"
                          className="form-control form-control-user"
                          placeholder="Enter Course Description..."
                          value={courseDescription}
                          onChange={(e) => setCourseDescription(e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <strong>Number of Lessons:</strong>
                        <input
                          type="number"
                          min="1"
                          className="form-control form-control-user"
                          placeholder="Enter Number of Lessons..."
                          value={numberofLessons}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            if (val > 0 || e.target.value === "") {
                              setNumberofLessons(e.target.value);
                            }
                          }}
                        />
                      </div>
                      <div className="form-group">
                        <strong>Test Description:</strong>
                        <input
                          type="text"
                          className="form-control form-control-user"
                          placeholder="Enter Test Description..."
                          value={testDescription}
                          onChange={(e) => setTestDescription(e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <strong>Number of Test Questions:</strong>
                        <input
                          type="number"
                          min="1"
                          className="form-control form-control-user"
                          placeholder="Enter Number of Tests..."
                          value={numberofTests}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            if (val > 0 || e.target.value === "") {
                              setNumberofTests(e.target.value);

                              // Reset passing score if it becomes invalid
                              const currentPassingScore = parseInt(
                                testPassingScores,
                                10
                              );
                              if (
                                currentPassingScore &&
                                val &&
                                currentPassingScore >= val
                              ) {
                                setTestPassingScores("");
                              }
                            }
                          }}
                        />
                      </div>
                      <div className="form-group">
                        <strong>Test Passing Scores:</strong>
                        <input
                          type="number"
                          min="1"
                          className="form-control form-control-user"
                          placeholder="Enter Test Passing Scores..."
                          value={testPassingScores}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            const maxQuestions = parseInt(numberofTests, 10);

                            if (e.target.value === "") {
                              setTestPassingScores("");
                            } else if (
                              val > 0 &&
                              (!maxQuestions || val < maxQuestions)
                            ) {
                              setTestPassingScores(e.target.value);
                            }
                          }}
                        />
                        {numberofTests && (
                          <small className="form-text text-muted">
                            Passing score must be less than {numberofTests}{" "}
                            questions
                          </small>
                        )}
                        {testPassingScores && !isPassingScoreValid() && (
                          <div className="invalid-feedback">
                            Passing score must be less than the number of test
                            questions
                          </div>
                        )}
                      </div>
                      <div className="d-flex justify-content-center gap-2">
                        <button
                          type="button"
                          className="btn btn-secondary me-2"
                          onClick={handleClear}
                        >
                          Clear
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={handleCreateCourse}
                          disabled={loading}
                        >
                          {loading ? "Creating..." : "Create Course"}
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* lesson form */}
                  <div className="col-lg-4">
                    <form className="lesson-form">
                      <fieldset
                        disabled={
                          !courseLanguage ||
                          !courseName ||
                          !courseCategory ||
                          !courseDescription ||
                          !numberofLessons ||
                          !testDescription ||
                          !testPassingScores ||
                          !numberofTests
                        }
                      >
                        {lessonForms.map((lesson, index) => (
                          <div key={index} className="border p-3 mb-3">
                            <div className="form-group">
                              <strong>Lesson {index + 1} Name:</strong>
                              <input
                                type="text"
                                className="form-control form-control-user"
                                placeholder="Enter Lesson Name..."
                                value={lesson.lessonName}
                                onChange={(e) => {
                                  const updated = [...lessonForms];
                                  updated[index].lessonName = e.target.value;
                                  setLessonForms(updated);
                                }}
                              />
                            </div>
                            <div className="form-group">
                              <strong>Description:</strong>
                              <input
                                type="text"
                                className="form-control form-control-user"
                                placeholder="Enter Lesson's Description..."
                                value={lesson.lessonDescription}
                                onChange={(e) => {
                                  const updated = [...lessonForms];
                                  updated[index].lessonDescription =
                                    e.target.value;
                                  setLessonForms(updated);
                                }}
                              />
                            </div>
                            <div className="form-group">
                              <strong>Lesson Media (Image or Video):</strong>
                              <input
                                type="file"
                                accept="image/*,video/*"
                                className="form-control form-control-user"
                                onChange={(e) =>
                                  handleLessonMediaChange(e, index)
                                }
                              />
                              {lesson.mediaFile && (
                                <div className="mt-2">
                                  <small className="text-muted">
                                    Selected: {lesson.mediaFile.name} (
                                    {lesson.mediaType})
                                  </small>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </fieldset>
                    </form>
                  </div>

                  <div className="col-lg-4">
                    {/* test form */}
                    <form className="test-form">
                      <fieldset
                        disabled={
                          !courseLanguage ||
                          !courseName ||
                          !courseCategory ||
                          !courseDescription ||
                          !numberofLessons ||
                          !testDescription ||
                          !testPassingScores ||
                          !numberofTests
                        }
                      >
                        {questionForms.map((test, index) => (
                          <div key={index} className="border p-3 mb-3">
                            <div className="form-group">
                              <strong>Question {index + 1} Answer:</strong>
                              <input
                                type="text"
                                className="form-control form-control-user"
                                placeholder="Enter Question's Answer..."
                                value={test.testAnswer}
                                onChange={(e) => {
                                  const updated = [...questionForms];
                                  updated[index].testAnswer = e.target.value;
                                  setQuestionForms(updated);
                                }}
                              />
                            </div>
                            <div className="form-group">
                              <strong>Question Media (Image or Video):</strong>
                              <input
                                type="file"
                                accept="image/*,video/*"
                                className="form-control form-control-user"
                                onChange={(e) =>
                                  handleQuestionMediaChange(e, index)
                                }
                              />
                              {test.mediaFile && (
                                <div className="mt-2">
                                  <small className="text-muted">
                                    Selected: {test.mediaFile.name} (
                                    {test.mediaType})
                                  </small>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </fieldset>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Content Row --> */}
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Course</h6>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table
              className="table table-bordered text-center"
              id="dataTable"
              width="100%"
              cellSpacing="0"
            >
              <thead>
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th
                        {...column.getHeaderProps(
                          column.getSortByToggleProps()
                        )}
                        style={{ cursor: "pointer" }}
                      >
                        {column.render("Header")}
                        {column.isSorted
                          ? column.isSortedDesc
                            ? " 🔽"
                            : " 🔼"
                          : ""}
                      </th>
                    ))}
                    <th>Actions</th>
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {page.map((row) => {
                  prepareRow(row);
                  const isEditing = row.original.courseid === editRowId;

                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map((cell) => {
                        const colId = cell.column.id;
                        const isEditing = row.original.courseid === editRowId;

                        return (
                          <td {...cell.getCellProps()}>
                            {isEditing && colId !== "numberoflessons" ? (
                              colId === "enabled" ? (
                                <select
                                  name="enabled"
                                  value={
                                    editFormData.enabled ? "true" : "false"
                                  }
                                  onChange={handleInputChange}
                                  className="form-select"
                                >
                                  <option value="true">Enabled</option>
                                  <option value="false">Disabled</option>
                                </select>
                              ) : (
                                <input
                                  type={
                                    colId === "numberoflessons"
                                      ? "number"
                                      : "text"
                                  }
                                  name={colId}
                                  value={editFormData[colId]}
                                  onChange={handleInputChange}
                                  className="form-control"
                                />
                              )
                            ) : (
                              cell.render("Cell")
                            )}
                          </td>
                        );
                      })}

                      <td>
                        {isEditing ? (
                          <>
                            <button
                              className="btn btn-success btn-sm me-1"
                              onClick={() =>
                                handleSaveClick(row.original.courseid)
                              }
                            >
                              Save
                            </button>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={handleCancelClick}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="btn btn-primary btn-sm me-1"
                              onClick={() => handleEditClick(row)}
                            >
                              Edit
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {/* Pagination Controls */}
          <div className="d-flex justify-content-between mt-3">
            <button
              className="btn btn-sm btn-primary"
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
            >
              Previous
            </button>
            <span className="align-self-center">Page {pageIndex + 1}</span>
            <button
              className="btn btn-sm btn-primary"
              onClick={() => nextPage()}
              disabled={!canNextPage}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Lessons Table - Only show when a course is selected */}
      {selectedCourse && (
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <h6 className="m-0 font-weight-bold text-success">
              Lessons for Course "{selectedCourse.name}"
            </h6>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table
                {...getLessonsTableProps()}
                className="table table-bordered text-center"
                width="100%"
                cellSpacing="0"
              >
                <thead>
                  {lessonsHeaderGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
                          style={{ cursor: "pointer" }}
                        >
                          {column.render("Header")}
                          {column.isSorted
                            ? column.isSortedDesc
                              ? " 🔽"
                              : " 🔼"
                            : ""}
                        </th>
                      ))}
                      {/* <th>Actions</th> */}
                    </tr>
                  ))}
                </thead>
                <tbody {...getLessonsTableBodyProps()}>
                  {lessonsRows.map((row) => {
                    prepareLessonsRow(row);
                    const isEditingLesson =
                      row.original.lessonid === editLessonRowId;
                    return (
                      <tr {...row.getRowProps()}>
                        {row.cells.map((cell) => {
                          const colId = cell.column.id;
                          const isEditingLesson =
                            row.original.lessonid === editRowId;
                          return (
                            <td {...cell.getCellProps()}>
                              {isEditingLesson ? (
                                <input
                                  type={colId === "order" ? "number" : "text"}
                                  name={colId}
                                  value={editLessonFormData[colId] || ""}
                                  onChange={handleInputChange}
                                  className="form-control"
                                />
                              ) : (
                                cell.render("Cell")
                              )}
                            </td>
                          );
                        })}
                        {/* <td>
                          {isEditingLesson ? (
                            <>
                              <button
                                className="btn btn-success btn-sm me-1"
                                onClick={() =>
                                  handleSaveClick(row.original.lessonid)
                                }
                              >
                                Save
                              </button>
                              <button
                                className="btn btn-secondary btn-sm"
                                onClick={handleCancelClick}
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                className="btn btn-primary btn-sm me-1"
                                onClick={() => handleEditLessonClick(row)}
                              >
                                Edit
                              </button>
                            </>
                          )}
                        </td> */}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tests Table - Show list of tests */}
      {selectedCourse && !showQuestions && (
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <h6 className="m-0 font-weight-bold text-success">
              Tests for Course "{selectedCourse.name}"
            </h6>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table
                {...getTestsTableProps()}
                className="table table-bordered text-center"
                width="100%"
                cellSpacing="0"
              >
                <thead>
                  {testsHeaderGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
                          style={{ cursor: "pointer" }}
                        >
                          {column.render("Header")}
                          {column.isSorted
                            ? column.isSortedDesc
                              ? " 🔽"
                              : " 🔼"
                            : ""}
                        </th>
                      ))}
                      <th>Actions</th>
                    </tr>
                  ))}
                </thead>
                <tbody {...getTestsTableBodyProps()}>
                  {testsRows.map((row) => {
                    prepareTestsRow(row);
                    return (
                      <tr {...row.getRowProps()}>
                        {row.cells.map((cell) => (
                          <td {...cell.getCellProps()}>
                            {cell.render("Cell")}
                          </td>
                        ))}
                        <td>
                          <button
                            className="btn btn-warning btn-sm me-1"
                            onClick={() => handleViewQuestions(row.original)}
                          >
                            View Questions
                          </button>
                          {/* <button className="btn btn-primary btn-sm me-1">
                            Edit
                          </button> */}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Questions Table - Show when a specific test is selected */}
      {selectedCourse && showQuestions && selectedTest && (
        <div className="card shadow mb-4">
          <div className="card-header py-3 d-flex justify-content-between align-items-center">
            <h6 className="m-0 font-weight-bold text-success">
              Questions for Test: "{selectedTest.description}"
            </h6>
            <button
              className="btn btn-secondary btn-sm"
              onClick={handleBackToTests}
            >
              ← Back to Tests
            </button>
          </div>
          <div className="card-body">
            {/* Display selected test metadata */}
            <div className="alert alert-light mb-4">
              <div className="row">
                <div className="col-md-4">
                  <strong>Description:</strong> {selectedTest.description}
                </div>
                <div className="col-md-4">
                  <strong>Total Questions:</strong>{" "}
                  {selectedTest.totalquestions}
                </div>
                <div className="col-md-4">
                  <strong>Passing Score:</strong> {selectedTest.passingscore}
                </div>
              </div>
            </div>

            {/* Questions Table */}
            <div className="table-responsive">
              <table
                {...getQuestionsTableProps()}
                className="table table-bordered text-center"
                width="100%"
                cellSpacing="0"
              >
                <thead>
                  {questionsHeaderGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
                          style={{
                            cursor: "pointer",
                            ...(column.width && { width: column.width }),
                            ...(column.minWidth && {
                              minWidth: column.minWidth,
                            }),
                            ...(column.maxWidth && {
                              maxWidth: column.maxWidth,
                            }),
                          }}
                        >
                          {column.render("Header")}
                          {column.isSorted
                            ? column.isSortedDesc
                              ? " 🔽"
                              : " 🔼"
                            : ""}
                        </th>
                      ))}
                      {/* <th style={{ width: 100 }}>Actions</th> */}
                    </tr>
                  ))}
                </thead>
                <tbody {...getQuestionsTableBodyProps()}>
                  {questionsRows.map((row, index) => {
                    prepareQuestionsRow(row);
                    return (
                      <tr {...row.getRowProps()}>
                        {row.cells.map((cell) => (
                          <td
                            {...cell.getCellProps()}
                            style={{
                              ...(cell.column.width && {
                                width: cell.column.width,
                              }),
                              ...(cell.column.minWidth && {
                                minWidth: cell.column.minWidth,
                              }),
                              ...(cell.column.maxWidth && {
                                maxWidth: cell.column.maxWidth,
                              }),
                            }}
                          >
                            {cell.render("Cell")}
                          </td>
                        ))}
                        {/* <td>
                          <button className="btn btn-primary btn-sm me-1">
                            Edit
                          </button>
                        </td> */}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Course;
