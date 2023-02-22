// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { WebClient } from "@slack/web-api";

export default async function handler(req, res) {
  console.log('TOKEN', process.env.SLACK_TOKEN);
  const token = process.env.SLACK_TOKEN;

  const web = new WebClient(token);

  const conversationId = "C04PAEGMYRL";

  const chats = await web.conversations.history({
    channel: conversationId
  })

  const response = await web.pins.add({
    channel: conversationId,
    timestamp: "1677057296.029579"
  });
  
  res.status(200).json({ name: 'John Doe' })
}
