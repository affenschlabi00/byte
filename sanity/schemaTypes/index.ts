import { type SchemaTypeDefinition } from 'sanity'
import {post} from "@/sanity/schemaTypes/post";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [post],
}
