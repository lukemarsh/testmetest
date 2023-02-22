// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { WebClient } from "@slack/web-api";

export default async function handler(req, res) {
  const token = process.env.SLACK_TOKEN;
  const web = new WebClient(token);

  await web.pins.add({
    channel: req.body.channel,
    timestamp: req.body.timestamp
  });

  const userGroup = await web.usergroups.create({
    name: 'testrota',
  });

  await web.usergroups.users.update({
    usergroup: userGroup.usergroup.id,
    users: 'UEC3MJXRT'
  })
  
  res.status(200).json({ name: 'John Doe' })
}
