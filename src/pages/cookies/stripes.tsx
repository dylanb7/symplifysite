import { NextPage } from "next";
import CookiesMD from "../../markdown/cookies/stripes-cookies.mdx";

const Privacy: NextPage = () => {
  return (
    <div className="px-6 pt-12">
      <div className="mx-auto max-w-prose">
        <CookiesMD />
      </div>
    </div>
  );
};

export default Privacy;
