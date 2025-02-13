import {defineField, defineType} from "sanity";

export const post = defineType({
    name: "post",
    title: "Post",
    type: "document",
    fields : [
        defineField({
            name: "title",
            type: "string",
        }),
        defineField({
            name: "description",
            type: "string",
        }),
        defineField({
            name: "files",
            type: "array",
            of: [{ type: "file" }],
        }),
        defineField({
            name: "views",
            type: "number"
        })
    ]
})