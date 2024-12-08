// import fs from 'fs';
// import path from 'path';
// import matter from 'gray-matter';
// import { remark } from 'remark';
// import html from 'remark-html';
// import remarkParse from 'remark-parse';

// const postsDirectory = path.join(process.cwd(), 'public/blogContent');

// export type PostMetaData = {
//   date: string;
//   title: string;
//   image: string;
//   category: string;
// };

// export type PostData = {
//   id: string;
//   contentHtml: string;
//   excerpt: string;
// } & PostMetaData;

// export function getAllPostIds() {
//   const fileNames = fs.readdirSync(postsDirectory);
//   return fileNames.map(fileName => ({
//     params: {
//       postId: fileName.replace(/\.md$/, ''),
//     },
//   }));
// }

// function extractExcerpt(markdownContent: string): string {
//   const ast = remark().use(remarkParse).parse(markdownContent);
//   let excerpt = '';

//   for (const node of ast.children) {
//     if (node.type === 'paragraph') {
//       excerpt = node.children
//         .filter((child: any) => child.type === 'text')
//         .map((child: any) => child.value)
//         .join(' ');
//       break;
//     }
//   }

//   return excerpt.slice(0, 50) + '...';
// }

// export async function getPostData(id: string): Promise<PostData> {
//   const fullPath = path.join(postsDirectory, `${id}.md`);
//   const fileContents = fs.readFileSync(fullPath, 'utf8');
//   const matterResult = matter(fileContents);

//   const processedContent = await remark().use(html).process(matterResult.content);
//   const contentHtml = processedContent.toString();

//   return {
//     id,
//     contentHtml,
//     excerpt: extractExcerpt(matterResult.content),
//     ...(matterResult.data as PostMetaData),
//   };
// }
