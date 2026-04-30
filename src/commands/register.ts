import { ChatInputCommandInteraction } from "discord.js";
import User from "../models/User.ts";

export async function handleRegister(interaction: ChatInputCommandInteraction) {
  try {
    const discordUser = interaction.user;

    if (!discordUser?.id) {
      return interaction.reply({
        content: "❌ Could not identify your Discord account.",
        ephemeral: true,
      });
    }

    console.log("REGISTER USER:", discordUser.id, discordUser.username);

    const existing = await User.findOne({
      discordId: discordUser.id,
    });

    if (existing) {
      return interaction.reply({
        content: "⚠️ Already registered.",
        ephemeral: true,
      });
    }

    await User.create({
      discordId: discordUser.id,
      username: discordUser.username,
      pcash: 0,
      isAdmin: false,
      lastDaily: null,
    });

    return interaction.reply({
      content: "✅ Registered successfully!",
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return interaction.reply({
      content: "❌ Registration failed (check logs).",
      ephemeral: true,
    });
  }
}
