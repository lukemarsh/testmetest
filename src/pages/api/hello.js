// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { WebClient } from "@slack/web-api";

export default async function handler(req, res) {
  const token = process.env.SLACK_TOKEN;
  const web = new WebClient(token);
  const { body : { firefighter, channel, timestamp } } = req;
  const users = [
    firefighter,
    "U2D1SE9FV",
    "UDPUWG5KK",
    "UBQRDLJ5A",
    "UE1F0TZK7",
    "U04M3CYH6A2"
  ];
  const userGroupId = "S04QKARLE14";

  const pins = await web.pins.list({
    channel: channel,
  });

  console.log('pins', JSON.stringify(pins));

  const lastBotPin = pins.items.find(p => p.message.includes("support rotas today"));

  console.log('last bot pin', lastBotPin);

  try {
    await web.pins.remove({
      channel: channel,
      timestamp: lastBotPin.message.ts
    });
  } catch (error) {
    throw new Error(error);
  }

  try {
    await web.pins.add({
      channel: channel,
      timestamp: timestamp
    });
  } catch (error) {
    throw new Error(error);
  }

  try {
    await web.usergroups.users.update({
      usergroup: userGroupId,
      users: users.join(),
    })
  } catch (error) {
    throw new Error(error);
  }
  
  res.status(200).json({ success: 'great success' })
}
