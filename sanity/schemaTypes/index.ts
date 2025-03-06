import { type SchemaTypeDefinition } from 'sanity'
import {post} from "@/sanity/schemaTypes/post";
import {user} from "@/sanity/schemaTypes/user";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [post, user],
}
