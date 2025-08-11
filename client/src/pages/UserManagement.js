import React, { useMemo, useState } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import useUser from "../hooks/useUser";
import useUserActions from "../hooks/useUserAction";

const UserManagement = () => {
  const [reloadKey, setReloadKey] = useState(0);
  const { nonAdminUsers, loading } = useUser(reloadKey);
  const { updateUser, loading: updateLoading, error } = useUserActions();
  const [editRowId, setEditRowId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const handleReload = () => {
    setReloadKey((prev) => prev + 1); // triggers useEffect to run again
  };

  const handleEditClick = (row) => {
    setEditRowId(row.original.userid);
    setEditFormData({ ...row.original });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: name === "suspended" ? value === "true" : value,
    }));
  };

  const handleSaveClick = async (userId) => {
    await updateUser(userId, editFormData);
    setEditRowId(null);
    handleReload();
  };

  const handleCancelClick = () => {
    setEditRowId(null);
    setEditFormData({});
  };

  const columns = useMemo(
    () => [
      {
        Header: "Username",
        accessor: "username",
        minWidth: 150,
        maxWidth: 300,
      },
      {
        Header: "Email",
        accessor: "email",
        minWidth: 300,
        maxWidth: 500,
      },
      {
        Header: "Verification Status",
        accessor: "emailverified",
        Cell: ({ value }) => (value ? "Yes" : "No"),
        minWidth: 200,
        maxWidth: 200,
      },
      { Header: "Gender", accessor: "gender" },
      { Header: "Sign Up Date", accessor: "createdat",
        minWidth: 300,
        maxWidth: 300,},
      {
        Header: "Suspended",
        accessor: "suspended",
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
    page,
    canPreviousPage,
    canNextPage,
    nextPage,
    previousPage,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data: useMemo(() => nonAdminUsers || [], [nonAdminUsers]),
      initialState: {
        pageSize: 5,
        sortBy: [{ id: "userid", desc: true }],
      },
    },
    useSortBy,
    usePagination
  );

  if (loading) {
    return (
      <div className="container-fluid">
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "50vh" }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      {/* <!-- Page Heading --> */}
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">User Management</h1>
      </div>

      {/* <!-- Content Row --> */}
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">User Management</h6>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table
              className="table table-bordered text-center"
              id="dataTable"
              width="100%"
              cellspacing="0"
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
                  const isEditing = row.original.userid === editRowId;

                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map((cell) => {
                        const colId = cell.column.id;
                        const isEditing = row.original.userid === editRowId;

                        return (
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
                            {isEditing &&
                            colId !== "username" &&
                            colId !== "email" &&
                            colId !== "emailverified" &&
                            colId !== "gender" &&
                            colId !== "createdat" ? (
                              <select
                                name="suspended"
                                value={
                                  editFormData.suspended ? "true" : "false"
                                }
                                onChange={handleInputChange}
                                className="form-select"
                              >
                                <option value="true">Yes</option>
                                <option value="false">No</option>
                              </select>
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
                                handleSaveClick(row.original.userid)
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

export default UserManagement;
