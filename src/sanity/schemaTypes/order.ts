interface OrderItem {
  _key: string
  _type: string
  product: {
    _ref: string
    _type: string
  }
  quantity: number
  price: number
}

interface Order {
  _id: string
  _type: string
  user: {
    _ref: string
    _type: string
  }
  items: OrderItem[]
  total: number
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  createdAt: string
  updatedAt: string
}

interface ValidationRule {
  required: () => ValidationRule
  min: (value: number) => ValidationRule
  max: (value: number) => ValidationRule
  custom: (fn: (value: any) => boolean | string) => ValidationRule
}

const orderSchema = {
  name: 'order',
  title: 'Order',
  type: 'document',
  fields: [
    {
      name: 'user',
      title: 'User',
      type: 'reference',
      to: [{ type: 'user' }],
      validation: (Rule: ValidationRule) => Rule.required(),
    },
    {
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'product',
              title: 'Product',
              type: 'reference',
              to: [{ type: 'product' }],
              validation: (Rule: ValidationRule) => Rule.required(),
            },
            {
              name: 'quantity',
              title: 'Quantity',
              type: 'number',
              validation: (Rule: ValidationRule) => Rule.required(),
            },
            {
              name: 'price',
              title: 'Price',
              type: 'number',
              validation: (Rule: ValidationRule) => Rule.required(),
            },
          ],
        },
      ],
    },
    {
      name: 'total',
      title: 'Total',
      type: 'number',
      validation: (Rule: ValidationRule) => Rule.required(),
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: ['pending', 'processing', 'completed', 'cancelled'],
      },
      validation: (Rule: ValidationRule) => Rule.required(),
    },
  ],
}

export default orderSchema
  