// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { WebClient } from "@slack/web-api";

export default async function handler(req, res) {
  const token = process.env.SLACK_TOKEN;
  const web = new WebClient(token);
  const { body : { users, usergroup } } = req;

  if (!users || !usergroup) {
    return res.status(400).send("Invalid parameters supplied");
  }

  try {
    await web.usergroups.users.update({
      usergroup: usergroup,
      users: users.join(),
    })
  } catch (error) {
    return res.status(500).send(error.message);
  }
  
  res.status(200).json({ success: 'great success' })
}
