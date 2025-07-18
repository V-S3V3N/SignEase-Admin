import React from "react";
import { useState } from "react";

const SubscriptionPlan = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload
    console.log("Submitted:", { email, password });

    // Add your logic here (e.g., API call)
  };

  return (
    <div className="container-fluid">
      {/* <!-- Page Heading --> */}
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">Subscription Plan</h1>
      </div>

      {/* <!-- Content Row --> */}
      <div className="row">
        <div class="col-lg-6">
          {/* <!-- Collapsable Card Example --> */}
          <div class="card shadow mb-4">
            {/* <!-- Card Header - Accordion --> */}
            <a
              href="#collapseCardExample"
              class="d-block card-header py-3"
              data-toggle="collapse"
              role="button"
              aria-expanded="true"
              aria-controls="collapseCardExample"
            >
              <h6 class="m-0 font-weight-bold text-primary">
                Create New Subscription Plan
              </h6>
            </a>
            {/* <!-- Card Content - Collapse --> */}
            <div class="collapse show" id="collapseCardExample">
              <div class="card-body">
                <form className="plan-form">
                  <div className="form-group">
                    <strong>Plan Name:</strong>
                    <input
                      type="text"
                      className="form-control form-control-user"
                      id="planNameInput"
                      placeholder="Enter Plan Name..."
                    />
                  </div>
                  <div className="form-group">
                    <strong>Plan Duration (Days):</strong>
                    <input
                      type="text"
                      className="form-control form-control-user"
                      id="planDurationInput"
                      placeholder="Enter Plan Duration..."
                    />
                  </div>
                  <div className="form-group">
                    <strong>Plan Price:</strong>
                    <input
                      type="text"
                      className="form-control form-control-user"
                      id="planPriceInput"
                      placeholder="Enter Plan Price..."
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Content Row --> */}

      <div className="row">
        {/* <!-- Area Chart --> */}
        <div className="col-xl-8 col-lg-7">
          <div className="card shadow mb-4">
            {/* <!-- Card Header - Dropdown --> */}
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 className="m-0 font-weight-bold text-primary">
                Earnings Overview
              </h6>
              <div className="dropdown no-arrow">
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
              </div>
            </div>
            {/* <!-- Card Body --> */}
            <div className="card-body">
              <div className="chart-area">
                <canvas id="myAreaChart"></canvas>
              </div>
            </div>
          </div>
        </div>

        {/* <!-- Pie Chart --> */}
        <div className="col-xl-4 col-lg-5">
          <div className="card shadow mb-4">
            {/* <!-- Card Header - Dropdown --> */}
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 className="m-0 font-weight-bold text-primary">
                Revenue Sources
              </h6>
              <div className="dropdown no-arrow">
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
              </div>
            </div>
            {/* <!-- Card Body --> */}
            <div className="card-body">
              <div className="chart-pie pt-4 pb-2">
                <canvas id="myPieChart"></canvas>
              </div>
              <div className="mt-4 text-center small">
                <span className="mr-2">
                  <i className="fas fa-circle text-primary"></i> Direct
                </span>
                <span className="mr-2">
                  <i className="fas fa-circle text-success"></i> Social
                </span>
                <span className="mr-2">
                  <i className="fas fa-circle text-info"></i> Referral
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlan;
