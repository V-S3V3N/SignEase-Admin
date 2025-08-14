import { useRef, useEffect, useMemo, useState } from "react";
import Chart from "chart.js/auto";
// import usePlanRevenue from "../hooks/usePlan";
// if have {} it means it is a named export , if no {} it is a default export
import useRevenue from "../hooks/useRevenue";
import useRevenueChartData from "../hooks/useRevenueChartData";
import useUserStats from "../hooks/useUserStats";
import { Link } from "react-router-dom";
import { useTable, useSortBy, usePagination } from "react-table";
import useUser from "../hooks/useUser";
import useUserActions from "../hooks/useUserAction";

const Dashboard = () => {
  const [reloadKey, setReloadKey] = useState(0);
  const { nonAdminUsers, loading } = useUser(reloadKey);
  const { updateUser, loading: updateLoading, error } = useUserActions();
  const [editRowId, setEditRowId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const {
    monthlyRevenue,
    yearlyRevenue,
    loading: loadingRevenue,
  } = useRevenue();
  const { monthlyRevenueArray, loading: loadingChart } = useRevenueChartData();
  const { nonAdminUsersStats, loading: loadingUser } = useUserStats();
  const lineChartRef = useRef(null);

  const handleReload = () => {
    setReloadKey((prev) => prev + 1); // triggers useEffect to run again
  };

  const handleEditClick = (row) => {
    setEditRowId(row.original.userid);
    setEditFormData({ suspended: row.original.suspended });
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

  useEffect(() => {
    const ctxLine = document.getElementById("myAreaChart");

    // Line Chart
    if (ctxLine && !loadingChart && monthlyRevenueArray.length > 0) {
      // Destroy previous chart instance if any
      if (lineChartRef.current) {
        lineChartRef.current.destroy();
      }
      lineChartRef.current = new Chart(ctxLine, {
        type: "line",
        data: {
          labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          datasets: [
            {
              label: "Revenues",
              data: monthlyRevenueArray,
              borderColor: "#4e73df",
              backgroundColor: "rgba(78, 115, 223, 0.05)",
              fill: true,
              tension: 0.4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
          },
          scales: {
            y: { beginAtZero: true },
          },
        },
      });
    }
  }, [monthlyRevenueArray, loadingChart]);

  return (
    <div className="container-fluid">
      {/* <!-- Page Heading --> */}
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">Dashboard</h1>
        <Link
          to="/report"
          className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
        >
          <i className="fas fa-download fa-sm text-white-50"></i> Generate
          Report
        </Link>
      </div>

      {/* <!-- Content Row --> */}
      <div className="row">
        {/* <!-- Users Card --> */}
        <div className="col-xl-4 col-md-6 mb-4">
          <div className="card border-left-primary shadow h-100 py-2">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    Users
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {loadingUser ? "Loading..." : `${nonAdminUsersStats} Users`}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-users fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <!-- Earnings (Monthly) Card Example --> */}
        <div className="col-xl-4 col-md-6 mb-4">
          <div className="card border-left-success shadow h-100 py-2">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                    Revenues (Monthly)
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {loadingRevenue
                      ? "Loading..."
                      : `RM ${monthlyRevenue.toFixed(2)}`}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-money-bills fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <!-- Earnings (Annual) Card Example --> */}
        <div className="col-xl-4 col-md-6 mb-4">
          <div className="card border-left-success shadow h-100 py-2">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                    Revenues (Annually)
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {loadingRevenue
                      ? "Loading..."
                      : `RM ${yearlyRevenue.toFixed(2)}`}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-money-bills fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Content Row --> */}

      <div className="row">
        {/* <!-- Area Chart --> */}
        <div className="col-xl-12 col-lg-7">
          <div className="card shadow mb-4">
            {/* <!-- Card Header - Dropdown --> */}
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 className="m-0 font-weight-bold text-primary">
                Revenue Overview
              </h6>
              {/* <div className="dropdown no-arrow">
                <a
                  className="dropdown-toggle"
                  href="#"
                  role="button"
                  id="dropdownMenuLink"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <i className="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
                </a>
                <div
                  className="dropdown-menu dropdown-menu-right shadow animated--fade-in"
                  aria-labelledby="dropdownMenuLink"
                >
                  <div className="dropdown-header">Dropdown Header:</div>
                  <a className="dropdown-item" href="#">
                    Action
                  </a>
                  <a className="dropdown-item" href="#">
                    Another action
                  </a>
                  <div className="dropdown-divider"></div>
                  <a className="dropdown-item" href="#">
                    Something else here
                  </a>
                </div>
              </div> */}
            </div>
            {/* <!-- Card Body --> */}
            <div className="card-body">
              <div className="chart-area">
                <canvas id="myAreaChart"></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- USER Content Row --> */}
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">User Management</h1>
      </div>
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

export default Dashboard;
