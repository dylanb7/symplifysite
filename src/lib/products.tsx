import StripesMD from "../markdown/products/stripes.md";
import { type ReactNode } from "react";

export type ProductProps = {
  markdown: ReactNode;
  name: string;
  description: string;
  image: string;
  slug: string;
};

export const StripesProduct: ProductProps = {
  markdown: <StripesMD />,
  name: "Stripes",
  description: "",
  image: "/stripesicon.png",
  slug: "stripes",
};

export const productsList: ProductProps[] = [StripesProduct];
