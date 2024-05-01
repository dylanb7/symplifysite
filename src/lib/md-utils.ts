import fs from "fs";
import { join } from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

export const getParsedFileContentBySlug = (
  slug: string,
  postsPath: string,
): MarkdownDocument => {
  const postFilePath = join(postsPath, `${slug}.mdx`);
  const fileContents = fs.readFileSync(postFilePath);

  const { data, content } = matter(fileContents);

  return {
    frontMatter: data,
    content,
  };
};

export const renderMarkdown = async (
  markdownContent: string,
): Promise<string> => {
  return await markdownToHtml(markdownContent || "");
};

export async function markdownToHtml(markdown: string) {
  const result = await remark().use(html).process(markdown);
  return result.toString();
}

export interface FrontMatter {
  [prop: string]: string;
}

export interface MarkdownDocument {
  frontMatter: FrontMatter;
  content: string;
}

export interface MarkdownRenderingResult {
  frontMatter: FrontMatter;
  html: string;
}
