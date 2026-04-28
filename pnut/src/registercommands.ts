import dotenv from "dotenv";
dotenv.config();
import { Client, GatewayIntentBits } from "discord.js";
import { joinVoiceChannel } from "@discordjs/voice";

const APP_ID = process.env.APP_ID!;
const DISCORD_TOKEN = process.env.DISCORD_TOKEN!;
const GUILD_ID = process.env.GUILD_ID!;

async function main() {
  const commands = [
    { name: "ping", description: "Replies with Pong!" },
    { name: "register", description: "Registers you in the database" },
    { name: "daily", description: "Claim your daily reward" },
    { name: "cash", description: "Check your pcash balance" },
    { name: "join", description: "Join the voice channel" },
  ];

  const url = `https://discord.com/api/v10/applications/${APP_ID}/guilds/${GUILD_ID}/commands`;

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bot ${DISCORD_TOKEN}`,
    },
    body: JSON.stringify(commands),
  });

  console.log("Status:", res.status);
  console.log(await res.json());
}

main();

// async function clearCommands() {
//   const url = `https://discord.com/api/v10/applications/${APP_ID}/guilds/${GUILD_ID}/commands`;

//   const res = await fetch(url, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bot ${DISCORD_TOKEN}`,
//     },
//     body: JSON.stringify([]),
//   });

//   console.log("Status:", res.status);
//   console.log(await res.text());
// }
// clearCommands();

// async function clearGlobalCommands() {
//   const url = `https://discord.com/api/v10/applications/${APP_ID}/commands`;

//   const res = await fetch(url, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bot ${DISCORD_TOKEN}`,
//     },
//     body: JSON.stringify([]),
//   });

//   console.log("Global clear status:", res.status);
//   console.log(await res.text());
// }

// clearGlobalCommands();
