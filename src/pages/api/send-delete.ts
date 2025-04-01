import type { NextApiRequest, NextApiResponse } from "next";
import { resend } from "../../lib/resend";

const send = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email } = req.body;
  try {
    const { data, error } = await resend.emails.send({
      from: email,
      to: "help@symplifysolutions.com",

      subject: "Account Deletion",
      text: `${email} would like to delete their account`,
    });

    if (error) {
      res.status(400).json({ error });
    }

    res.status(200).json({ data });
  } catch (error) {
    res.status(400).json({ error });
  }
};

export default send;
