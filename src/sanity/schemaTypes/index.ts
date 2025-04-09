import { type SchemaTypeDefinition } from 'sanity'
import user from "./user"
import account from "./account"
import session from "./session"

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [user,  account, session],
}
