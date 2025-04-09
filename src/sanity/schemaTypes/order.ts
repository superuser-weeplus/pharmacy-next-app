export default {
    name: "order",
    title: "Order",
    type: "document",
    fields: [
      {
        name: "orderNumber",
        title: "Order Number",
        type: "string",
        validation: (Rule: any) => Rule.required(),
      },
      {
        name: "user",
        title: "User",
        type: "reference",
        to: [{ type: "user" }],
      },
      {
        name: "items",
        title: "Items",
        type: "array",
        of: [
          {
            type: "object",
            fields: [
              {
                name: "product",
                title: "Product",
                type: "reference",
                to: [{ type: "product" }],
                validation: (Rule: any) => Rule.required(),
              },
              {
                name: "quantity",
                title: "Quantity",
                type: "number",
                validation: (Rule: any) => Rule.required().min(1),
              },
              {
                name: "price",
                title: "Price at Order Time",
                type: "number",
                validation: (Rule: any) => Rule.required().positive(),
              },
            ],
          },
        ],
      },
      {
        name: "totalAmount",
        title: "Total Amount",
        type: "number",
        validation: (Rule: any) => Rule.required().positive(),
      },
      {
        name: "status",
        title: "Status",
        type: "string",
        options: {
          list: [
            { title: "Pending", value: "pending" },
            { title: "Processing", value: "processing" },
            { title: "Shipped", value: "shipped" },
            { title: "Delivered", value: "delivered" },
            { title: "Cancelled", value: "cancelled" },
          ],
        },
        initialValue: "pending",
      },
      {
        name: "shippingAddress",
        title: "Shipping Address",
        type: "object",
        fields: [
          { name: "name", title: "Name", type: "string" },
          { name: "address", title: "Address", type: "string" },
          { name: "city", title: "City", type: "string" },
          { name: "postalCode", title: "Postal Code", type: "string" },
          { name: "country", title: "Country", type: "string" },
          { name: "phone", title: "Phone", type: "string" },
        ],
      },
      {
        name: "paymentInfo",
        title: "Payment Information",
        type: "object",
        fields: [
          { name: "method", title: "Method", type: "string" },
          { name: "transactionId", title: "Transaction ID", type: "string" },
          { name: "status", title: "Status", type: "string" },
        ],
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
  