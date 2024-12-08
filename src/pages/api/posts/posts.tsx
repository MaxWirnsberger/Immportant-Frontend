import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkParse from 'remark-parse';

const postsDirectory = path.join(process.cwd(), 'public/blogContent');

type PostMetaData = {
  date: string;
  title: string;
  image: string;
  category: string;
};

type PostData = {
  id: string;
  contentHtml: string;
  excerpt: string;
} & PostMetaData;

function extractExcerpt(markdownContent: string): string {
  const ast = remark().use(remarkParse).parse(markdownContent);
  let excerpt = '';

  for (const node of ast.children) {
    if (node.type === 'paragraph') {
      excerpt = node.children
        .filter((child: any) => child.type === 'text')
        .map((child: any) => child.value)
        .join(' ');
      break;
    }
  }

  return excerpt.slice(0, 50) + '...';
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Request received:', req.method);  // Hinzugefügt
  if (req.method === 'GET') {
    console.log('GET request received');
    if (!fs.existsSync(postsDirectory)) {
      console.log(`Directory not found: ${postsDirectory}`);
      fs.mkdirSync(postsDirectory, { recursive: true });
    }
    const fileNames = fs.readdirSync(postsDirectory);
    console.log('Files found:', fileNames);
    const allPostsData = fileNames.map((fileName) => {
      const id = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const matterResult = matter(fileContents);
      const excerpt = extractExcerpt(matterResult.content);
      return {
        id,
        excerpt,
        ...(matterResult.data as PostMetaData),
      };
    });
    res.status(200).json(allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1)));
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
