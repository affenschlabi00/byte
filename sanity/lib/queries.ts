import {defineQuery} from "groq";

export const POSTS_QUERY =
    defineQuery(
        `*[_type == "post"]{
          title,
          description,
          views,
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