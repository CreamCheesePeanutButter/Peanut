import dotenv from "dotenv";
dotenv.config();
import express from "express";
import {
  InteractionType,
  InteractionResponseType,
  verifyKeyMiddleware,
} from "discord-interactions";

import { connectDB } from "./db.ts";
import { handleRegister } from "./commands/register.ts";
import { handlePing } from "./commands/ping.ts";
import { handleDaily } from "./commands/daily.ts";
import { handleCash } from "./commands/cash.ts";

const app = express();
const PORT = process.env.PORT || 3000;

const PUBLIC_KEY = process.env.PUBLIC_KEY;

if (!PUBLIC_KEY) throw new Error("Missing PUBLIC_KEY");

// connect DB
await connectDB();

app.post("/interactions", verifyKeyMiddleware(PUBLIC_KEY), async (req, res) => {
  const { type, data } = req.body;

  // commands
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;

    switch (name) {
      case "ping":
        return handlePing(req, res);

      case "register":
        return handleRegister(req, res);

      case "daily":
        return handleDaily(req, res);

      case "cash":
        return handleCash(req, res);
      case "join":
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content:
              "⚠️ /join is handled by the voice bot. Webhook mode cannot directly control voice here.",
          },
        });
      default:
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: { content: "Unknown command" },
        });
    }
  }
});
app.use(express.json());

app.listen(PORT, () => {
  console.log(`🚀 Bot running on port ${PORT}`);
});
