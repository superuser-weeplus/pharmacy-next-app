interface ValidationRule {
  required: () => ValidationRule
  min: (value: number) => ValidationRule
  max: (value: number) => ValidationRule
  custom: (fn: (value: unknown) => boolean | string) => ValidationRule
}

const sessionSchema = {
    name: "session",
    title: "Session",
    type: "document",
    fields: [
      {
        name: "userId",
        title: "User ID",
        type: "string",
        validation: (Rule: ValidationRule) => Rule.required(),
      },
      {
        name: "sessionToken",
        title: "Session Token",
        type: "string",
        validation: (Rule: ValidationRule) => Rule.required(),
      },
      {
        name: "expires",
        title: "Expires",
        type: "datetime",
        validation: (Rule: ValidationRule) => Rule.required(),
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
  