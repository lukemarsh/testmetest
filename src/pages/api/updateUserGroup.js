// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { WebClient } from "@slack/web-api";

export default async function handler(req, res) {
  const token = process.env.SLACK_TOKEN;
  const web = new WebClient(token);
  const { body : { users, usergroup } } = req;

  if (!users || !usergroup) {
    return res.status(400).send("Invalid parameters supplied");
  }

//   const users = [
//     firefighter,
//     "U2D1SE9FV",
//     "UDPUWG5KK",
//     "UBQRDLJ5A",
//     "UE1F0TZK7",
//     "U04M3CYH6A2"
//   ];
//   const userGroupId = "S04QKARLE14";

  try {
    await web.usergroups.users.update({
      usergroup: usergroup,
      users: JSON.parse(users).join(),
    })
  } catch (error) {
    return res.status(error.requestResult.statusCode).send(error.message);
  }
  
  res.status(200).json({ success: 'great success' })
}
