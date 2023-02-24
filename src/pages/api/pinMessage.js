// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { WebClient } from "@slack/web-api";

export default async function handler(req, res) {
  const token = process.env.SLACK_TOKEN;
  const web = new WebClient(token);
  const { body : { channel, timestamp } } = req;

  if (!channel || !timestamp) {
    return res.status(400).send("Invalid parameters supplied");
  }

  let pins = [];

  try {
    pins = await web.pins.list({
      channel: channel,
    });
  } catch (error) {
    return res.status(500).send(error.message);
  }

  const lastBotPin = pins.items.find(
    p => p.message.username === "Engineering Rota"
  );

  if (lastBotPin) {
    try {
      await web.pins.remove({
        channel: channel,
        timestamp: lastBotPin.message.ts
      });
    } catch (error) {
      return res.status(500).send(error.message);
    }
  }

  try {
    await web.pins.add({
      channel: channel,
      timestamp: timestamp
    });
  } catch (error) {
    return res.status(500).send(error.message);
  }

  res.status(200).json({ success: 'great success' })
}
