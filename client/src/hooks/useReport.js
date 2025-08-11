import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useState } from "react";
import REPORT_CONFIGS from "../utils/ReportConfig";

const useReport = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userReportData, setUserReportData] = useState(null);
  const [revenueReportData, setRevenueReportData] = useState(null);
  const [planReportData, setPlanReportData] = useState(null);

  const generateUserReport = async (fromDate, toDate, reportType = "user") => {
    setLoading(true);
    setError(null);
    try {
      const usersRef = collection(db, "users");
      const allUsersSnapshot = await getDocs(usersRef);

      let nonAdmins = allUsersSnapshot.docs
        .filter((doc) => doc.data().role !== "admin")
        .map((doc) => {
          const data = doc.data();
          return {
            userid: doc.id,
            username: data.username,
            email: data.email,
            dob: data.dob,
            emailverified: data.emailverified,
            firstname: data.firstname,
            lastname: data.lastname,
            gender: data.gender,
            profilepicpath: data.profilepicpath,
            suspended: data.suspended,
            createdat: data.createdat?.toDate ? data.createdat.toDate() : null,
          };
        });

      if (fromDate || toDate) {
        const start = fromDate ? new Date(fromDate) : new Date("1900-01-01");
        const end = toDate ? new Date(toDate) : new Date();
        nonAdmins = nonAdmins.filter((user) => {
          if (!user.createdat) return false;
          return user.createdat >= start && user.createdat <= end;
        });
      }

      // Apply report-specific filtering
      const config = REPORT_CONFIGS[reportType];
      if (!config) {
        throw new Error(`No config found for report type: ${reportType}`);
      }
      // let filteredUsers = config.filterLogic(nonAdmins);

      let stats = generateUserStatisticalData(nonAdmins);

      setUserReportData({
        users: nonAdmins,
        stats,
        config,
        summary: {
          total: nonAdmins.length,
          dateRange: { fromDate, toDate },
        },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateUserStatisticalData = (users) => {
    const total = users.length;
    return [
      { metric: "Total Users", count: total, percentage: "100%" },
      {
        metric: "Verified Users",
        count: users.filter((u) => u.emailverified).length,
        percentage: `${(
          (users.filter((u) => u.emailverified).length / total) *
          100
        ).toFixed(1)}%`,
      },
      {
        metric: "Suspended Users",
        count: users.filter((u) => u.suspended).length,
        percentage: `${(
          (users.filter((u) => u.suspended).length / total) *
          100
        ).toFixed(1)}%`,
      },
      {
        metric: "Male Users",
        count: users.filter((u) => u.gender === "Male").length,
        percentage: `${(
          (users.filter((u) => u.gender === "Male").length / total) *
          100
        ).toFixed(1)}%`,
      },
      {
        metric: "Female Users",
        count: users.filter((u) => u.gender === "Female").length,
        percentage: `${(
          (users.filter((u) => u.gender === "Female").length / total) *
          100
        ).toFixed(1)}%`,
      },
    ];
  };

  const generateRevenueReport = async (
    fromDate,
    toDate,
    plans,
    reportType = "revenue"
  ) => {
    setLoading(true);
    setError(null);
    try {
      const revenueRef = collection(db, "planrevenues");
      const revenueSnapshot = await getDocs(revenueRef);

      let revenues = revenueSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          revenueid: doc.id,
          amount: data.amount,
          planid: data.planid,
          timestamp: data.timestamp?.toDate ? data.timestamp.toDate() : null,
          userid: data.userid,
        };
      });

      // Apply date filtering
      if (fromDate || toDate) {
        const start = fromDate ? new Date(fromDate) : new Date("1900-01-01");
        const end = toDate ? new Date(toDate) : new Date();
        revenues = revenues.filter((purchase) => {
          if (!purchase.timestamp) return false;
          return purchase.timestamp >= start && purchase.timestamp <= end;
        });
      }

      // Map plan IDs to plan details
      const planMap = plans.reduce((acc, plan) => {
        acc[plan.planid] = plan;
        return acc;
      }, {});

      revenues = revenues.map((rev) => {
        const plan = planMap[rev.planid];
        return {
          ...rev,
          planName: plan ? plan.name : "Unknown Plan",
        };
      });

      // Apply report-specific filtering
      const config = REPORT_CONFIGS[reportType];
      if (!config) {
        throw new Error(`No config found for report type: ${reportType}`);
      }

      let stats = generateRevenueStatisticalData(revenues, planMap);

      setRevenueReportData({
        revenues,
        stats,
        config,
        summary: {
          total: revenues.length,
          dateRange: { fromDate, toDate },
        },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateRevenueStatisticalData = (revenues, planMap) => {
    let totalEarnings = 0;
    let topPlanId = null;
    let maxEarnings = 0;

    // total up the earning for each plan
    const earningsByPlan = revenues.reduce((acc, rev) => {
      if (!rev.planid || !rev.amount) return acc;
      acc[rev.planid] = (acc[rev.planid] || 0) + Number(rev.amount); //recursively sum up
      return acc;
    }, {});

    // find top plan
    for (const [planid, total] of Object.entries(earningsByPlan)) {
      if (total > maxEarnings) {
        maxEarnings = total;
        topPlanId = planid;
      }
    }

    // find total earnings
    for (const [planid, total] of Object.entries(earningsByPlan)) {
      totalEarnings += total;
    }

    const topPlan = planMap[topPlanId] || { name: "Unknown Plan" };

    return [
      {
        metric: "Top Plan",
        count: topPlan ? `RM ${maxEarnings.toFixed(2)}` : "RM 0",
        percentage: topPlan ? topPlan.name : "N/A",
      },
      {
        metric: "Total Revenues",
        count: "",
        percentage: `RM ${totalEarnings.toFixed(2)}`,
      },
    ];
  };

  const generatePlanReport = async (
    fromDate,
    toDate,
    plans,
    reportType = "plan"
  ) => {
    setLoading(true);
    setError(null);
    try {
      const revenueRef = collection(db, "planrevenues");
      const revenueSnapshot = await getDocs(revenueRef);

      let revenues = revenueSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          revenueid: doc.id,
          amount: data.amount,
          planid: data.planid,
          timestamp: data.timestamp?.toDate ? data.timestamp.toDate() : null,
          userid: data.userid,
        };
      });

      // Apply date filtering
      if (fromDate || toDate) {
        const start = fromDate ? new Date(fromDate) : new Date("1900-01-01");
        const end = toDate ? new Date(toDate) : new Date();
        revenues = revenues.filter((purchase) => {
          if (!purchase.timestamp) return false;
          return purchase.timestamp >= start && purchase.timestamp <= end;
        });
      }

      // Map plan IDs to plan details
      const planMap = plans.reduce((acc, plan) => {
        acc[plan.planid] = plan;
        return acc;
      }, {});

      // Aggregate total earnings and unique users per plan -- combine all the data based on each plan
      const planAggregates = {};

      // add up the amount and user
      revenues.forEach(({ planid, amount, userid }) => {
        if (!planid) return;

        if (!planAggregates[planid]) {
          planAggregates[planid] = {
            totalEarnings: 0,
            userSet: new Set(),
          };
        }

        planAggregates[planid].totalEarnings += amount;
        if (userid) {
          planAggregates[planid].userSet.add(userid);
        }
      });

      // Convert to array and include plan details
      let aggregatedPlans = Object.entries(planAggregates).map(
        ([planid, { totalEarnings, userSet }]) => ({
          planid,
          planName: planMap[planid]?.name || "Unknown Plan",
          duration: planMap[planid]?.duration || "N/A",
          price: planMap[planid]?.price || "N/A",
          totalEarnings,
          subscribers: userSet.size,
        })
      );

      // Sort by total earnings descending and pick top 3
      aggregatedPlans = aggregatedPlans
        .sort((a, b) => b.totalEarnings - a.totalEarnings)
        .slice(0, 3);

      // Apply report-specific filtering
      const config = REPORT_CONFIGS[reportType];
      if (!config) {
        throw new Error(`No config found for report type: ${reportType}`);
      }

      let stats = null;

      setPlanReportData({
        plansData: aggregatedPlans,
        stats,
        config,
        summary: {
          total: aggregatedPlans.length,
          dateRange: { fromDate, toDate },
        },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const clearReportData = () => {
    setUserReportData(null);
    setRevenueReportData(null);
  };

  return {
    generateUserReport,
    userReportData,
    generateRevenueReport,
    revenueReportData,
    generatePlanReport,
    planReportData,
    clearReportData,
    loading,
    error,
  };
};

export default useReport;
