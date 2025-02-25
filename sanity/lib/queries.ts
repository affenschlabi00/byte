import {defineQuery} from "groq";

export const POSTS_QUERY = (page: number, limit: number) => {
    const start = (page - 1) * limit; // Calculate the starting point for the current page
    const end = start + limit; // Calculate the endpoint for the current page

    return defineQuery(
        `*[_type == "post"] | order(_createdAt desc) [${start}...${end}] {
            title,
            description,
            views,
            preview {
                asset->{
                    url,
                    originalFilename,
                    mimeType
                }
            },
            files[]{
                asset->{
                    _id,
                    url,
                    originalFilename,
                    mimeType
                }
            }
        }`
    );
};


export const TOTAL_POSTS_COUNT_QUERY = defineQuery(
    `count(*[_type == "post"])`
);
