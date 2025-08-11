import { useRef, useEffect } from "react";
import Chart from "chart.js/auto";
// import usePlanRevenue from "../hooks/usePlan";
// if have {} it means it is a named export , if no {} it is a default export
import { useRevenue } from "../hooks/useRevenue";
import { useRevenueChartData } from "../hooks/useRevenueChartData";
import { useUserStats } from "../hooks/useUserStats";
import { Link } from "react-router-dom";

const Dashboard = () => {
  // const revenueData = usePlanRevenue();
  const {
    monthlyRevenue,
    yearlyRevenue,
    loading: loadingRevenue,
  } = useRevenue();
  const { monthlyRevenueArray, loading: loadingChart } = useRevenueChartData();
  const { nonAdminUsers, loading: loadingUser } = useUserStats();

  const lineChartRef = useRef(null);

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
                    {loadingUser ? "Loading..." : `${nonAdminUsers} Users`}
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
    </div>
  );
};

export default Dashboard;
