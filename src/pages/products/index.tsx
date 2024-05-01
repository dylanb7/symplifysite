import { GetStaticProps, type NextPage } from "next";
import { productsList } from "~/lib/products";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { join } from "path";
import fs from "fs";
import { FrontMatter, getParsedFileContentBySlug } from "~/lib/md-utils";
import { Avatar } from "~/components/ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

const Products: NextPage<{ allFrontmatter: FrontMatter[] }> = ({
  allFrontmatter,
}) => {
  return (
    <div className="mx-auto mt-20 flex max-w-prose flex-wrap gap-2">
      {allFrontmatter.map((product) => (
        <a
          href={`/products/${product.slug}`}
          key={product.name}
          className="rounded-md hover:shadow-lg"
        >
          <Card>
            <CardHeader>
              <div className="flex flex-row gap-2">
                {product.image && (
                  <Avatar>
                    <AvatarImage src={product.image} />
                    <AvatarFallback>{product.name}</AvatarFallback>
                  </Avatar>
                )}

                <div className="flex flex-col justify-start gap-1">
                  <CardTitle>{product.name}</CardTitle>
                  <CardDescription>{product.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </a>
      ))}
    </div>
  );
};

const POSTS_PATH = join(process.cwd(), "src", "markdown", "products");

export const getStaticProps: GetStaticProps = async () => {
  const paths = fs
    .readdirSync(POSTS_PATH)
    .map((path) => path.replace(/\.mdx?$/, ""))
    .map((slug) => ({ params: { slug } }));

  const allFrontmatter = paths.map((path) => {
    const { frontMatter } = getParsedFileContentBySlug(
      path.params.slug,
      POSTS_PATH,
    );
    return frontMatter;
  });

  return {
    props: {
      allFrontmatter,
    },
  };
};

export default Products;
