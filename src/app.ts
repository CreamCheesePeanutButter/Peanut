import dotenv from "dotenv";
dotenv.config();

import { Client, GatewayIntentBits, Message } from "discord.js";

import { connectDB } from "./db.ts";

import { handleJoin } from "./commands/join.ts";
import { handleRegister } from "./commands/register.ts";
import { handlePing } from "./commands/ping.ts";
import { handleDaily } from "./commands/daily.ts";
import { handleCash } from "./commands/cash.ts";
import { handleCoinFlip } from "./gcommands/coinflip.ts";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Bot ready
client.once("clientReady", async () => {
  console.log(`🎤 Bot logged in as ${client.user?.tag}`);

  try {
    await connectDB();
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
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
      case "coinflip":
        const amount = parseInt(
          interaction.options.get("amount")?.value as string,
        );
        return handleCoinFlip(interaction, amount, interaction.user.id);

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

// Message commands (prefix-based)
const PREFIX = "p";
client.on("messageCreate", async (message: Message) => {
  // Ignore messages from bots or those that don't start with the prefix
  if (message.author.bot || !message.content.startsWith(PREFIX)) return;

  const channel = message.channel;
  if (!channel || !("send" in channel)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const command = args.shift()?.toLowerCase();

  if (command === "ping") {
    handlePing({
      reply: (response: any) => channel.send(response),
    } as any);
  }
  if (command === "register") {
    handleRegister({
      user: message.author,
      reply: (response: any) => channel.send(response),
    } as any);
  }
  if (command === "daily") {
    handleDaily({
      user: message.author,
      reply: (response: any) => channel.send(response),
    } as any);
  }
  if (command === "cash") {
    handleCash({
      user: message.author,
      reply: (response: any) => channel.send(response),
    } as any);
  }
  if (command === "join") {
    (console.log("VOICE CHANNEL JOIN:", message.member?.voice.channelId),
      handleJoin({
        member: message.member,

        guild: message.guild,
        reply: (response: any) => channel.send(response),
      } as any));
  }
  if (command === "coinflip" || command === "cf") {
    handleCoinFlip(message, parseInt(args[0]), message.author.id);
  }
});

// Login
client.login(process.env.DISCORD_TOKEN);
