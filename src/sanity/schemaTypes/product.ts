interface Product {
  _id: string
  _type: string
  name: string
  slug: string
  description?: string
  price: number
  image?: {
    _type: string
    asset: {
      _ref: string
      _type: string
    }
  }
  category?: {
    _ref: string
    _type: string
  }
  stock: number
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

interface ValidationRule {
  required: () => ValidationRule
  min: (value: number) => ValidationRule
  max: (value: number) => ValidationRule
  custom: (fn: (value: unknown) => boolean | string) => ValidationRule
}

const productSchema = {
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule: ValidationRule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule: ValidationRule) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
    },
    {
      name: 'price',
      title: 'Price',
      type: 'number',
      validation: (Rule: ValidationRule) => Rule.required(),
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
    },
    {
      name: 'stock',
      title: 'Stock',
      type: 'number',
      validation: (Rule: ValidationRule) => Rule.required(),
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: ['active', 'inactive'],
      },
      validation: (Rule: ValidationRule) => Rule.required(),
    },
  ],
}

export default productSchema
  