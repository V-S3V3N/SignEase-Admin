const REPORT_CONFIGS = {
  user: {
    title: "User Report",
    columns: [
      {
        Header: "User ID",
        accessor: "userid",
        minWidth: 30,
      },
      {
        Header: "Username",
        accessor: "username",
        minWidth: 30,
      },
      {
        Header: "Email",
        accessor: "email",
        minWidth: 40,
      },
      {
        Header: "Verified?",
        accessor: "emailverified",
        Cell: ({ value }) => (value ? "Yes" : "No"),
        minWidth: 20,
      },
      { Header: "Gender", accessor: "gender", minWidth: 20 },
      {
        Header: "Created At",
        accessor: "createdat",
        Cell: ({ value }) => value?.toLocaleDateString(),
        minWidth: 25,
      },
      {
        Header: "Suspended",
        accessor: "suspended",
        Cell: ({ value }) => (value ? "Yes" : "No"),
        minWidth: 25,
      },
    ],
    // filterLogic: (users) => users,
  },
  revenue: {
    title: "Revenue Report",
    columns: [
      { Header: "ID", accessor: "revenueid", minWidth: 50 },
      { Header: "Amount", accessor: "amount", minWidth: 30 },
      { Header: "Plan", accessor: "planName", minWidth: 40 },
      { Header: "User ID", accessor: "userid", minWidth: 50 },
      {
        Header: "Date",
        accessor: "timestamp",
        Cell: ({ value }) => value?.toLocaleDateString(),
        minWidth: 25,
      },
    ],
    // filterLogic: (data) => data,
  },
  plan: {
    title: "Subscription Plan Report",
    columns: [
      { Header: "Plan Name", accessor: "planName", minWidth: 50 },
      { Header: "Duration", accessor: "duration", minWidth: 25 },
      { Header: "Price", accessor: "price", minWidth: 30 },
      { Header: "Total Earnings", accessor: "totalEarnings", minWidth: 30 },
      { Header: "Subscribers", accessor: "subscribers", minWidth: 25 },
      //number of people subscribed to it
    ],
    // filterLogic: (data) => data,
  },
};

export default REPORT_CONFIGS;
