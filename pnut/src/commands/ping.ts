import { ChatInputCommandInteraction } from "discord.js";

export async function handlePing(interaction: ChatInputCommandInteraction) {
  return interaction.reply({
    content: "🏓 Pong!",
  });
}
