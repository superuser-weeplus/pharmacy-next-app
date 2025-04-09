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

const productSchema = {
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule: { required: () => any }) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule: { required: () => any }) => Rule.required(),
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
      validation: (Rule: { required: () => any }) => Rule.required(),
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
      validation: (Rule: { required: () => any }) => Rule.required(),
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: ['active', 'inactive'],
      },
      validation: (Rule: { required: () => any }) => Rule.required(),
    },
  ],
}

export default productSchema
  