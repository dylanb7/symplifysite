import type { NextApiRequest, NextApiResponse } from "next";
import createClient from "~/utils/supabase/route";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const client = createClient(req, res);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const newPass = typeof req.body === "string" ? req.body : undefined;
  if (newPass) {
    const { error } = await client.auth.updateUser({ password: newPass });
    if (error) {
      return res.status(500).json(error);
    }
    return res.status(200);
  }
  return res.status(401).json("Invalid Passord");
}
