import React from "react";
import { useState } from "react";

const SubscriptionPlan = () => {
  const [planName, setPlanName] = useState("");
  const [planDuration, setPlanDuration] = useState("");
  const [planPrice, setPlanPrice] = useState("");

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

      <div className="row"></div>
    </div>
  );
};

export default SubscriptionPlan;
