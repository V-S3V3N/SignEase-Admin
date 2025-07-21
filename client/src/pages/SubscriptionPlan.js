import React, { useMemo, useState } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import usePlan from "../hooks/usePlan";

const SubscriptionPlan = () => {
  const [planName, setPlanName] = useState("");
  const [planDuration, setPlanDuration] = useState("");
  const [planPrice, setPlanPrice] = useState("");
  const planData = usePlan();

  const handleClear = () => {
    setPlanName("");
    setPlanDuration("");
    setPlanPrice("");
  };

  const handleCreatePlan = (e) => {
    e.preventDefault();

    // ✅ Send data to Firebase, backend, or wherever
    console.log({ planName, planDuration, planPrice });

    // Optionally clear after submit
    handleClear();
  };

  const columns = useMemo(
    () => [
      { Header: "Plan Name", accessor: "name" },
      { Header: "Price (RM)", accessor: "price" },
      { Header: "Duration (Days)", accessor: "duration" },
      { Header: "Total Earnings (RM)", accessor: "totalEarnings" },
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
                      className="form-control form-control-user"
                      placeholder="Enter Plan Duration..."
                      value={planDuration}
                      onChange={(e) => setPlanDuration(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <strong>Plan Price:</strong>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control form-control-user"
                      placeholder="Enter Plan Price..."
                      value={planPrice}
                      onChange={(e) => setPlanPrice(e.target.value)}
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
                    >
                      Create Plan
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
              className="table table-bordered"
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
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {page.map((row) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map((cell) => (
                        <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                      ))}
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
