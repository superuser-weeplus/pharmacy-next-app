const sessionSchema = {
    name: "session",
    title: "Session",
    type: "document",
    fields: [
      {
        name: "userId",
        title: "User ID",
        type: "string",
        validation: (Rule: { required: () => any }) => Rule.required(),
      },
      {
        name: "sessionToken",
        title: "Session Token",
        type: "string",
        validation: (Rule: { required: () => any }) => Rule.required(),
      },
      {
        name: "expires",
        title: "Expires",
        type: "datetime",
        validation: (Rule: { required: () => any }) => Rule.required(),
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

export default sessionSchema
  