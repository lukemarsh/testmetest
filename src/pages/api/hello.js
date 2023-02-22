// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { WebClient } from "@slack/web-api";

export default async function handler(req, res) {
  const token = "thisismytoken";

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
