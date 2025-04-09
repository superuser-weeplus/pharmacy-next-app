interface Category {
  _id: string
  _type: string
  name: string
  slug: string
  description?: string
  image?: {
    _type: string
    asset: {
      _ref: string
      _type: string
    }
  }
}

interface ValidationRule {
  required: () => ValidationRule
  min: (value: number) => ValidationRule
  max: (value: number) => ValidationRule
  custom: (fn: (value: any) => boolean | string) => ValidationRule
}

const categorySchema = {
    name: "category",
    title: "Category",
    type: "document",
    fields: [
      {
        name: "name",
        title: "Name",
        type: "string",
        validation: (Rule: ValidationRule) => Rule.required(),
      },
      {
        name: "slug",
        title: "Slug",
        type: "slug",
        options: {
          source: "name",
          maxLength: 96,
        },
        validation: (Rule: ValidationRule) => Rule.required(),
      },
      {
        name: "description",
        title: "Description",
        type: "text",
      },
      {
        name: "image",
        title: "Image",
        type: "image",
        options: {
          hotspot: true,
        },
      },
      {
        name: "parent",
        title: "Parent Category",
        type: "reference",
        to: [{ type: "category" }],
      },
      {
        name: "atcCode",
        title: "ATC Code",
        type: "string",
      },
    ],
  }

export default categorySchema
  