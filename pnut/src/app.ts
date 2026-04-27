import dotenv from "dotenv";
dotenv.config();

import { Client, GatewayIntentBits } from "discord.js";
import { handleJoin } from "./commands/join.ts";

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

client.once("clientReady", () => {
  console.log(`🎤 Voice bot logged in as ${client.user?.tag}`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  try {
    switch (interaction.commandName) {
      case "ping":
        return interaction.reply("🏓 Pong!");

      case "join":
        handleJoin(interaction);
        return;

      default:
        return interaction.reply("Unknown command.");
    }
  } catch (error) {
    console.error("Voice bot error:", error);

    if (interaction.replied || interaction.deferred) {
      return interaction.followUp("❌ Something went wrong.");
    }

    return interaction.reply("❌ Something went wrong.");
  }
});

client.login(process.env.DISCORD_TOKEN);
