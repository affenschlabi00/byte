import { defineField, defineType } from "sanity";

export const user = defineType({
    name: "user",
    title: "User",
    type: "document",
    fields: [
        defineField({
            name: "name",
            title: "Name",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "email",
            title: "Email",
            type: "string",
            validation: (Rule) => Rule.required().email(),
        }),
        defineField({
            name: "image",
            title: "Avatar",
            type: "url",
        }),
        defineField({
            name: "githubId",
            title: "GitHub ID",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "githubUsername",
            title: "GitHub Username",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "bio",
            title: "Bio",
            type: "text",
        }),
        defineField({
            name: "role",
            title: "Role",
            type: "string",
            initialValue: "user",
            options: {
                list: [
                    { title: "User", value: "user" },
                    { title: "Admin", value: "admin" },
                ],
            },
        }),
        defineField({
            name: "posts",
            title: "Posts",
            type: "array",
            of: [{ type: "reference", to: [{ type: "post" }] }],
        }),
        defineField({
            name: "joinedAt",
            title: "Joined At",
            type: "datetime",
            initialValue: () => new Date().toISOString(),
        }),
        defineField({
            name: "updatedAt",
            title: "Updated At",
            type: "datetime",
            initialValue: () => new Date().toISOString(),
        }),
    ],
}); 