import React, { useMemo, useState, useEffect } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import useCourse from "../hooks/useCourse";
import useCourseActions from "../hooks/useCourseAction";

const Course = () => {
  const [courseName, setCourseName] = useState("");
  const [courseCategory, setCourseCategory] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [numberofLessons, setNumberofLessons] = useState("");
  const [courseLanguage, setCourseLanguage] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("asl");
  const [numberofTests, setNumberofTests] = useState("");
  const [lessonForms, setLessonForms] = useState([]);
  const [testForms, setTestForms] = useState([]);
  const [reloadKey, setReloadKey] = useState(0);
  const courseData = useCourse(selectedLanguage);
  const { createCourse, updateCourse, loading, error } =
    useCourseActions(selectedLanguage);
  const [editRowId, setEditRowId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const handleReload = () => {
    setReloadKey((prev) => prev + 1); // triggers useEffect to run again
  };

  const handleClear = () => {
    setCourseName("");
    setCourseCategory("");
    setCourseDescription("");
    setNumberofLessons("");
    setCourseLanguage("");
    setSelectedLanguage("");
    setLessonForms([]);
    setTestForms([]);
    setNumberofTests("");
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
          !lesson.lessonName || !lesson.lessonDescription || !lesson.imageFile
      ) || // Ensure all lessons have names and descriptions and images
      testForms.some(
        (test) =>
          !test.testDescription ||
          !test.testPassingScore ||
          !test.testTotalQuestion
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
    await createCourse(courseLanguage, newCourse, lessonForms);
    handleReload();
    handleClear();
  };

  const handleEditClick = (row) => {
    setEditRowId(row.original.courseid);
    setEditFormData({ ...row.original });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: name === "enabled" ? value === "true" : value,
    }));
  };

  const handleSaveClick = async (courseid) => {
    await updateCourse(courseid, editFormData);
    setEditRowId(null);
    handleReload();
  };

  const handleCancelClick = () => {
    setEditRowId(null);
    setEditFormData({});
  };

  useEffect(() => {
    const num = parseInt(numberofLessons) || 0;
    const newForms = Array.from({ length: num }, (_, i) => ({
      lessonName: "",
      lessonDescription: "",
      imageFile: null,
      imageUrl: "",
    }));
    setLessonForms(newForms);
  }, [numberofLessons]);

  useEffect(() => {
    const num = parseInt(numberofTests) || 0;
    const newForms = Array.from({ length: num }, (_, i) => ({
      testDescription: "",
      testPassingScore: "",
      testTotalQuestion: "",
    }));
    setTestForms(newForms);
  }, [numberofTests]);

  const handleLessonImageChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const updated = [...lessonForms];
    updated[index].imageFile = e.target.files[0];
    setLessonForms(updated);
  };

  const columns = useMemo(
    () => [
      { Header: "Course Name", accessor: "name" },
      { Header: "Category", accessor: "category" },
      { Header: "Description", accessor: "description" },
      { Header: "Number of Lessons", accessor: "numberoflessons" },
      {
        Header: "Enabled",
        accessor: "enabled",
        Cell: ({ value }) => (value ? "Yes" : "No"),
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // instead of rows, use page for pagination
    canPreviousPage,
    canNextPage,
    nextPage,
    previousPage,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data: useMemo(() => courseData || [], [courseData]),
      initialState: {
        pageSize: 5,
        sortBy: [{ id: "name", desc: true }],
      },
    },
    useSortBy,
    usePagination
  );

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
                  <div className="col-lg-6">
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
                        <strong>Number of Tests:</strong>
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
                            }
                          }}
                        />
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
                  <div className="col-lg-6">
                    <form className="lesson-form">
                      <fieldset
                        disabled={
                          !courseLanguage ||
                          !courseName ||
                          !courseCategory ||
                          !courseDescription ||
                          !numberofLessons
                        }
                      >
                        {lessonForms.map((lesson, index) => (
                          <div key={index} className="border p-3 mb-3">
                            <div className="form-group">
                              <strong>Lesson {index + 1} Name:</strong>
                              <input
                                type="text"
                                className="form-control form-control-user"
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
                              <strong>Lesson Image:</strong>
                              <input
                                type="file"
                                accept="image/*"
                                className="form-control form-control-user"
                                onChange={(e) =>
                                  handleLessonImageChange(e, index)
                                }
                              />
                            </div>
                          </div>
                        ))}
                      </fieldset>
                    </form>

                    {/* test form */}
                    <form className="test-form">
                      <fieldset
                        disabled={
                          !courseLanguage ||
                          !courseName ||
                          !courseCategory ||
                          !courseDescription ||
                          !numberofTests
                        }
                      >
                        {/* testDescription: "",
      testPassingScore: "",
      testTotalQuestion: "", */}
                        {testForms.map((test, index) => (
                          <div key={index} className="border p-3 mb-3">
                            <div className="form-group">
                              <strong>Test Description:</strong>
                              <input
                                type="text"
                                className="form-control form-control-user"
                                value={test.testDescription}
                                onChange={(e) => {
                                  const updated = [...testForms];
                                  updated[index].testDescription =
                                    e.target.value;
                                  setTestForms(updated);
                                }}
                              />
                            </div>
                            <div className="form-group">
                              <strong>Test Passing Scores:</strong>
                              <input
                                type="number"
                                min="1"
                                className="form-control form-control-user"
                                placeholder="Enter Test's Passing Scores..."
                                value={test.testPassingScore}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value, 10);
                                  if (val > 0 || e.target.value === "") {
                                    const updated = [...testForms];
                                    updated[index].testPassingScore =
                                      e.target.value;
                                    setTestForms(updated);
                                  }
                                }}
                              />
                            </div>
                            <div className="form-group">
                              <strong>Test Total Questions:</strong>
                              <input
                                type="number"
                                min="1"
                                className="form-control form-control-user"
                                placeholder="Enter Number of Test Questions..."
                                value={test.testTotalQuestion}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value, 10);
                                  if (val > 0 || e.target.value === "") {
                                    const updated = [...testForms];
                                    updated[index].testTotalQuestion =
                                      e.target.value;
                                    setTestForms(updated);
                                  }
                                }}
                              />
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
              className="table table-bordered"
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
    </div>
  );
};

export default Course;
