import React, { useMemo, useState } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import useReport from "../hooks/useReport";
import REPORT_CONFIGS from "../utils/ReportConfig";
import exportReportToPDF from "../utils/ExportReportToPDF";
import usePlan from "../hooks/usePlan";

const Report = () => {
  const [reportType, setReportType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const planData = usePlan(reloadKey);
  const {
    generateUserReport,
    clearReportData,
    generateRevenueReport,
    generatePlanReport,
    planReportData,
    revenueReportData,
    userReportData,
    loading,
    error,
  } = useReport();

  const handleReload = () => {
    setReloadKey((prev) => prev + 1); // triggers useEffect to run again
  };

  const handleClear = () => {
    setReportType("");
    setFromDate("");
    setToDate("");
    clearReportData();
  };

  const handleGenerateReport = async () => {
    if (!reportType || !fromDate || !toDate) {
      alert("Please fill in all fields.");
      return;
    }

    switch (reportType) {
      case "user":
        await generateUserReport(fromDate, toDate);
        break;
      case "revenue":
        await generateRevenueReport(fromDate, toDate, planData);
        break;
      case "plan":
        await generatePlanReport(fromDate, toDate, planData);
        break;
      default:
        alert("Please select a valid report type.");
        return;
    }
  };

  // ✅ Dynamic columns based on current report type
  const columns = useMemo(() => {
    if (!reportType || !REPORT_CONFIGS[reportType]) {
      return [];
    }
    return REPORT_CONFIGS[reportType].columns;
  }, [reportType]);

  // ✅ Dynamic data based on report type
  const tableData = useMemo(() => {
    switch (reportType) {
      case "user":
        return Array.isArray(userReportData?.users) ? userReportData.users : [];
      case "revenue":
        return Array.isArray(revenueReportData?.revenues)
          ? revenueReportData.revenues
          : [];
      case "plan":
        return Array.isArray(planReportData?.plansData)
          ? planReportData.plansData
          : [];
    }
    return [];
  }, [userReportData, revenueReportData, planReportData, reportType]);

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
      data: tableData,
      initialState: { pageSize: 10 },
    },
    useSortBy,
    usePagination
  );

  // ✅ Export to PDF function
  const handleExportToPDF = () => {
    if (!reportType) return;
    let detailData = [];
    let statsData = [];
    let config = null;

    switch (reportType) {
      case "user":
        detailData = userReportData.users;
        statsData = userReportData.stats;
        config = userReportData.config;
        break;
      case "revenue":
        detailData = revenueReportData.revenues;
        statsData = revenueReportData.stats;
        config = revenueReportData.config;
        break;
      case "plan":
        detailData = planReportData.plansData;
        statsData = planReportData.stats;
        config = planReportData.config;
        break;
    }

    if (!detailData || !config) {
      alert("No data to export");
      return;
    }

    exportReportToPDF(
      detailData,
      statsData,
      config,
      reportType,
      fromDate,
      toDate
    );
  };

  const handleFromDateChange = (e) => {
    setFromDate(e.target.value);
    // if from date > to date then reset
    if (toDate && new Date(e.target.value) > new Date(toDate)) {
      setToDate("");
      alert("To Date cannot be before From Date.");
    }
  };

  const handleToDateChange = (e) => {
    if (fromDate && new Date(e.target.value) < new Date(fromDate)) {
      setToDate("");
      alert("To Date cannot be before From Date.");
    } else {
      setToDate(e.target.value);
    }
  };

  return (
    <div className="container-fluid">
      {/* <!-- Page Heading --> */}
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">Report Generation</h1>
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
                Report Generation
              </h6>
            </a>
            {/* <!-- Card Content - Collapse --> */}
            <div className="collapse show" id="collapseCardExample">
              <div className="card-body">
                <form className="plan-form">
                  <div className="form-group">
                    <strong>Report Type:</strong>
                    <select
                      className="form-control form-control-user"
                      value={reportType}
                      onChange={(e) => setReportType(e.target.value)}
                    >
                      <option value="">Select Report Type...</option>
                      <option value="user">User Report</option>
                      <option value="revenue">Revenue Report</option>
                      <option value="plan">Subscription Plan Report</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <strong>From Date:</strong>
                    <input
                      type="date"
                      className="form-control form-control-user"
                      value={fromDate}
                      onChange={handleFromDateChange}
                    />
                  </div>
                  <div className="form-group">
                    <strong>To Date:</strong>
                    <input
                      type="date"
                      className="form-control form-control-user"
                      value={toDate}
                      onChange={handleToDateChange}
                      disabled={!fromDate}
                      min={fromDate}
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
                      onClick={handleGenerateReport}
                      disabled={loading}
                    >
                      {loading ? "Generating..." : "Generate Report"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        {tableData.length > 0 && (
          <div className="col-lg-6">
            <div className="card shadow mb-4">
              <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-success">
                  Report Summary
                </h6>
              </div>
              <div className="card-body">
                <p>
                  <strong>Report Type:</strong>{" "}
                  {REPORT_CONFIGS[reportType]?.title}
                </p>
                <p>
                  <strong>Records Found:</strong> {tableData.length}
                </p>
                <p>
                  <strong>Date Range:</strong> {fromDate} to {toDate}
                </p>
                <button className="btn btn-success" onClick={handleExportToPDF}>
                  <i className="fas fa-file-pdf"></i> Export to PDF
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {tableData.length > 0 && (
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <h6 className="m-0 font-weight-bold text-primary">
              {REPORT_CONFIGS[reportType]?.title || "Report Results"}
            </h6>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table
                {...getTableProps()}
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
                    </tr>
                  ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                  {page.map((row) => {
                    prepareRow(row);
                    return (
                      <tr {...row.getRowProps()}>
                        {row.cells.map((cell) => (
                          <td {...cell.getCellProps()}>
                            {cell.render("Cell")}{" "}
                          </td>
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
      )}

      {!loading && !tableData.length && reportType && (
        <div className="card shadow mb-4">
          <div className="card-body text-center">
            <p className="text-muted">
              No data found for the selected criteria.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          Error: {error}
        </div>
      )}
    </div>
  );
};

export default Report;
