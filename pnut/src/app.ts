import dotenv from "dotenv";
dotenv.config();

import { Client, GatewayIntentBits } from "discord.js";

import { connectDB } from "./db.ts";

import { handleJoin } from "./commands/join.ts";
import { handleRegister } from "./commands/register.ts";
import { handlePing } from "./commands/ping.ts";
import { handleDaily } from "./commands/daily.ts";
import { handleCash } from "./commands/cash.ts";

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

// Bot ready
client.once("clientReady", async () => {
  console.log(`🎤 Bot logged in as ${client.user?.tag}`);

  try {
    await connectDB();
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
  }
});

// Slash commands
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  try {
    switch (interaction.commandName) {
      case "join":
        return handleJoin(interaction);

      case "ping":
        return handlePing(interaction);

      case "register":
        return handleRegister(interaction);

      case "daily":
        return handleDaily(interaction);

      case "cash":
        return handleCash(interaction);

      default:
        return interaction.reply({
          content: "Unknown command.",
          ephemeral: true,
        });
    }
  } catch (error) {
    console.error("Bot error:", error);

    if (interaction.replied || interaction.deferred) {
      return interaction.followUp("❌ Something went wrong.");
    }

    return interaction.reply("❌ Something went wrong.");
  }
});

// Login
client.login(process.env.DISCORD_TOKEN);
