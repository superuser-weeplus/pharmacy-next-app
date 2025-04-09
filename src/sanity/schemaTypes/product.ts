export default {
    name: "product",
    title: "Product",
    type: "document",
    fields: [
      {
        name: "name",
        title: "Name",
        type: "string",
        validation: (Rule: any) => Rule.required(),
      },
      {
        name: "slug",
        title: "Slug",
        type: "slug",
        options: {
          source: "name",
          maxLength: 96,
        },
        validation: (Rule: any) => Rule.required(),
      },
      {
        name: "description",
        title: "Description",
        type: "text",
      },
      {
        name: "images",
        title: "Images",
        type: "array",
        of: [{ type: "image", options: { hotspot: true } }],
      },
      {
        name: "price",
        title: "Price",
        type: "number",
        validation: (Rule: any) => Rule.required().positive(),
      },
      {
        name: "stock",
        title: "Stock",
        type: "number",
        validation: (Rule: any) => Rule.required().min(0),
      },
      {
        name: "categories",
        title: "Categories",
        type: "array",
        of: [{ type: "reference", to: [{ type: "category" }] }],
      },
      {
        name: "atcCode",
        title: "ATC Code",
        type: "string",
      },
      {
        name: "requiresPrescription",
        title: "Requires Prescription",
        type: "boolean",
        initialValue: false,
      },
      {
        name: "createdAt",
        title: "Created At",
        type: "datetime",
        initialValue: () => new Date().toISOString(),
      },
      {
        name: "updatedAt",
        title: "Updated At",
        type: "datetime",
        initialValue: () => new Date().toISOString(),
      },
    ],
  }
  