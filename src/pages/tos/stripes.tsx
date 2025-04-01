import { NextPage } from "next";
import TOSMD from "../../markdown/tos/stripes.mdx";

const Privacy: NextPage = () => {
  return (
    <div className="px-6 pt-12">
      <div className="mx-auto max-w-prose">
        <TOSMD />
      </div>
    </div>
  );
};

export default Privacy;
