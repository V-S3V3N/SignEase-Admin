import React, { useMemo, useState } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import usePlan from "../hooks/usePlan";
import usePlanActions from "../hooks/usePlanAction";

const SubscriptionPlan = () => {
  const [planName, setPlanName] = useState("");
  const [planDuration, setPlanDuration] = useState("");
  const [planPrice, setPlanPrice] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const planData = usePlan(reloadKey);
  const { createPlan, updatePlan, loading, error } =
    usePlanActions();
  const [editRowId, setEditRowId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const handleReload = () => {
    setReloadKey((prev) => prev + 1); // triggers useEffect to run again
  };

  const handleClear = () => {
    setPlanName("");
    setPlanDuration("");
    setPlanPrice("");
  };

  const handleCreatePlan = async (e) => {
    e.preventDefault();

    if (!planName || !planDuration || !planPrice) {
      alert("Please fill in all fields.");
      return;
    }

    const newPlan = {
      name: planName,
      price: parseFloat(planPrice),
      duration: parseInt(planDuration, 10),
      enabled: true,
    };
    await createPlan(newPlan);
    handleReload();
    handleClear();
  };

  const handleEditClick = (row) => {
    setEditRowId(row.original.planid);
    setEditFormData({ ...row.original });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: name === "enabled" ? value === "true" : value,
    }));
  };

  const handleSaveClick = async (planId) => {
    await updatePlan(planId, editFormData);
    setEditRowId(null);
    handleReload();
  };

  const handleCancelClick = () => {
    setEditRowId(null);
    setEditFormData({});
  };

  const columns = useMemo(
    () => [
      { Header: "Plan Name", accessor: "name" },
      { Header: "Price (RM)", accessor: "price" },
      { Header: "Duration (Days)", accessor: "duration" },
      { Header: "Total Earnings (RM)", accessor: "totalEarnings" },
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
      data: useMemo(() => planData || [], [planData]),
      initialState: {
        pageSize: 5,
        sortBy: [{ id: "totalEarnings", desc: true }],
      },
    },
    useSortBy,
    usePagination
  );

  return (
    <div className="container-fluid">
      {/* <!-- Page Heading --> */}
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">Subscription Plan</h1>
      </div>

      {/* <!-- Content Row --> */}
      <div className="row">
        <div className="col-lg-6">
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
                Create New Subscription Plan
              </h6>
            </a>
            {/* <!-- Card Content - Collapse --> */}
            <div className="collapse show" id="collapseCardExample">
              <div className="card-body">
                <form className="plan-form">
                  <div className="form-group">
                    <strong>Plan Name:</strong>
                    <input
                      type="text"
                      className="form-control form-control-user"
                      placeholder="Enter Plan Name..."
                      value={planName}
                      onChange={(e) => setPlanName(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <strong>Plan Duration (Days):</strong>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      className="form-control form-control-user"
                      placeholder="Enter Plan Duration..."
                      value={planDuration}
                      onChange={(e) => setPlanDuration(e.target.value)}
                      onBlur={(e) => {
                        // Validate only when user leaves the field
                        const numValue = parseInt(e.target.value);
                        if (isNaN(numValue) || numValue < 0) {
                          setPlanDuration("1"); // Reset to minimum if invalid
                        } else {
                          // Format to 2 decimal places if valid
                          setPlanDuration(numValue);
                        }
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <strong>Plan Price:</strong>
                    <input
                      type="number"
                      step="0.01"
                      min="20"
                      className="form-control form-control-user"
                      placeholder="Enter Plan Price..."
                      value={planPrice}
                      onChange={(e) => {
                        setPlanPrice(e.target.value);
                      }}
                      onBlur={(e) => {
                        // Validate only when user leaves the field
                        const numValue = parseFloat(e.target.value);
                        if (isNaN(numValue) || numValue < 20) {
                          setPlanPrice("20.00"); // Reset to minimum if invalid
                        } else {
                          // Format to 2 decimal places if valid
                          setPlanPrice(numValue.toFixed(2));
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
                      onClick={handleCreatePlan}
                      disabled={loading}
                    >
                      {loading ? "Creating..." : "Create Plan"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Content Row --> */}
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">
            Subscription Plans
          </h6>
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
                  const isEditing = row.original.planid === editRowId;

                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map((cell) => {
                        const colId = cell.column.id;
                        const isEditing = row.original.planid === editRowId;

                        return (
                          <td {...cell.getCellProps()}>
                            {isEditing && colId !== "totalEarnings" ? (
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
                                    colId === "price" || colId === "duration"
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
                                handleSaveClick(row.original.planid)
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

export default SubscriptionPlan;
