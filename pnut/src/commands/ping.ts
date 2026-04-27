import { InteractionResponseType } from "discord-interactions";

export function handlePing(
  req: { body: { data: { name: string } } },
  res: any,
) {
  return res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: "🏓 Pong!",
    },
  });
}
