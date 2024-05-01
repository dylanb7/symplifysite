import { GetStaticProps, GetStaticPaths, type NextPage } from "next";
import fs from "fs";
import Image from "next/image";
import StripesMDX from "../../markdown/products/stripes.mdx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import { join } from "path";
import {
  FrontMatter,
  getParsedFileContentBySlug,
  renderMarkdown,
} from "~/lib/md-utils";
import { buttonVariants } from "~/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

const Stripes: NextPage<{ frontMatter: FrontMatter; html: string }> = ({
  frontMatter,
  html,
}) => {
  return (
    <div className="mx-4">
      <div className="mx-auto mt-16 max-w-prose">
        <Card className="mb-4">
          <CardHeader className="flex flex-row gap-2">
            {frontMatter.image && (
              <Avatar>
                <AvatarImage src={frontMatter.image} />
                <AvatarFallback>{frontMatter.name}</AvatarFallback>
              </Avatar>
            )}

            <div className="flew flex-col">
              {frontMatter.name && <CardTitle>{frontMatter.name}</CardTitle>}
              {frontMatter.description && (
                <CardDescription>{frontMatter.description}</CardDescription>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-start gap-2">
            {frontMatter.webLink && (
              <a
                href={frontMatter.webLink}
                className={buttonVariants({ variant: "link" })}
              >
                {frontMatter.webLinkText ?? frontMatter.webLink}
              </a>
            )}

            <div className="flex flex-row gap-3">
              {frontMatter.appStoreLink && (
                <a href={frontMatter.appStoreLink}>
                  <Image
                    width={150}
                    height={100}
                    src={"/appstorebutton.webp"}
                    alt="Appstore Link"
                  />
                </a>
              )}

              {frontMatter.googlePlayLink && (
                <a href={frontMatter.googlePlayLink}>
                  <Image
                    width={150}
                    height={100}
                    src={"/googleplaybutton.webp"}
                    alt="Appstore Link"
                  />
                </a>
              )}
            </div>
          </CardContent>
        </Card>
        <StripesMDX />
      </div>
    </div>
  );
};

const POSTS_PATH = join(process.cwd(), "src", "markdown", "products");

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (!params || typeof params.slug !== "string")
    return {
      props: {
        notFound: true,
      },
    };
  const articleMarkdownContent = getParsedFileContentBySlug(
    params.slug,
    POSTS_PATH,
  );

  const renderedHTML = await renderMarkdown(articleMarkdownContent.content);

  return {
    props: {
      frontMatter: articleMarkdownContent.frontMatter,
      html: renderedHTML,
    },
  };
};
export const getStaticPaths: GetStaticPaths = async () => {
  const paths = fs
    .readdirSync(POSTS_PATH)
    .map((path) => path.replace(/\.mdx?$/, ""))
    .map((slug) => ({ params: { slug } }));

  return {
    paths,
    fallback: false,
  };
};

export default Stripes;
