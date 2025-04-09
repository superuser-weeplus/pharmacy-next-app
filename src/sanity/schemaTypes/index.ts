import { type SchemaTypeDefinition } from 'sanity'
import user from "./user"
import product from "./product"
import order from "./order"
import category from "./category"
import account from "./account"
import session from "./session"

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [user, product, order, category, account, session],
}
