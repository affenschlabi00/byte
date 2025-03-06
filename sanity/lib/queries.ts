import {defineQuery} from "groq";

export const POSTS_QUERY = (page: number, limit: number, authorId?: string) => {
    const start = (page - 1) * limit; // Calculate the starting point for the current page
    const end = start + limit; // Calculate the endpoint for the current page
    const authorFilter = authorId ? `&& author._ref == "${authorId}"` : '';

    return defineQuery(
        `*[_type == "post" ${authorFilter}] | order(_createdAt desc) [${start}...${end}] {
            _id,
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
            },
            author->{
                _id,
                name,
                image
            }
        }`
    );
};

export const TOTAL_POSTS_COUNT_QUERY = (authorId?: string) => {
    const authorFilter = authorId ? `[author._ref == "${authorId}"]` : '';
    return defineQuery(
        `count(*[_type == "post" ${authorFilter}])`
    );
};
