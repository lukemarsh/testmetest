// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { WebClient } from "@slack/web-api";

export default async function handler(req, res) {
  const token = process.env.SLACK_TOKEN;
  const web = new WebClient(token);

  await web.pins.add({
    channel: req.body.channel,
    timestamp: req.body.timestamp
  });

  const users = [req.body.firefighter, "U2D1SE9FV", "UDPUWG5KK", "UBQRDLJ5A", "UE1F0TZK7", "U04M3CYH6A2"]

  await web.usergroups.users.update({
    usergroup: "S04QKARLE14",
    users: users.join(),
  })
  
  res.status(200);
}
