import { ChatInputCommandInteraction } from "discord.js";
import User from "../models/User.ts";

export async function handleCash(interaction: ChatInputCommandInteraction) {
  const discordUser = interaction.user;

  if (!discordUser?.id) {
    return interaction.reply({
      content: "❌ Could not identify your Discord account.",
      ephemeral: true,
    });
  }

  try {
    const existing = await User.findOne({
      discordId: discordUser.id,
    });

    if (!existing) {
      return interaction.reply({
        content: "⚠️ You need to register first using /register.",
        ephemeral: true,
      });
    }

    // Update username in case it changed
    existing.username = discordUser.username;

    return interaction.reply({
      content: `💰 You have ${existing.pcash} pcash.`,
    });
  } catch (error) {
    console.error("Error checking user cash:", error);

    return interaction.reply({
      content: "❌ An error occurred while checking your cash balance.",
      ephemeral: true,
    });
  }
}
