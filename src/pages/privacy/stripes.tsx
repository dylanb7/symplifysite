import { NextPage } from "next";
import PrivacyMD from "../../markdown/privacy/stripes-privacy.mdx";

const Privacy: NextPage = () => {
  return (
    <div className="px-6 pt-12">
      <div className="mx-auto max-w-prose">
        <PrivacyMD />
      </div>
    </div>
  );
};

export default Privacy;
