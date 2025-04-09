interface ValidationRule {
  required: () => ValidationRule
  min: (value: number) => ValidationRule
  max: (value: number) => ValidationRule
  custom: (fn: (value: unknown) => boolean | string) => ValidationRule
}

const userSchema = {
    name: "user",
    title: "User",
    type: "document",
    fields: [
      {
        name: "name",
        title: "Name",
        type: "string",
        validation: (Rule: ValidationRule) => Rule.required(),
      },
      {
        name: "email",
        title: "Email",
        type: "string",
        validation: (Rule: ValidationRule) => Rule.required(),
      },
      {
        name: "emailVerified",
        title: "Email Verified",
        type: "datetime",
      },
      {
        name: "image",
        title: "Image",
        type: "string",
      },
      {
        name: "passwordHash",
        title: "Password Hash",
        type: "string",
      },
      {
        name: "role",
        title: "Role",
        type: "string",
        options: {
          list: ['user', 'admin'],
        },
        validation: (Rule: ValidationRule) => Rule.required(),
      },
      {
        name: "status",
        title: "Status",
        type: "string",
        options: {
          list: [
            { title: "Active", value: "active" },
            { title: "Pending", value: "pending" },
            { title: "Suspended", value: "suspended" },
          ],
        },
        initialValue: "active",
      },
      {
        name: "lineProfile",
        title: "LINE Profile",
        type: "object",
        fields: [
          { name: "userId", title: "User ID", type: "string" },
          { name: "displayName", title: "Display Name", type: "string" },
          { name: "pictureUrl", title: "Picture URL", type: "url" },
        ],
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
  
export default userSchema
  