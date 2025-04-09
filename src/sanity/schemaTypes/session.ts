export default {
    name: "session",
    title: "Session",
    type: "document",
    fields: [
      {
        name: "userId",
        title: "User ID",
        type: "string",
      },
      {
        name: "sessionToken",
        title: "Session Token",
        type: "string",
      },
      {
        name: "expires",
        title: "Expires",
        type: "datetime",
      },
      {
        name: "createdAt",
        title: "Created At",
        type: "datetime",
      },
      {
        name: "updatedAt",
        title: "Updated At",
        type: "datetime",
      },
    ],
  }
  