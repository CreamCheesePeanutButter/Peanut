import { Message, AttachmentBuilder } from "discord.js";
import User from "../models/User.ts";
import path from "path";

export async function handleCoinFlip(
  message: Message,
  amount: number,
  authorID: string,
) {
  try {
    const existing = await User.findOne({
      discordId: authorID,
    });

    if (!existing) {
      return message.reply("⚠️ You need to register first using !register.");
    }

    if (!amount || amount <= 0) {
      return message.reply("⚠️ Please specify a valid amount to bet.");
    }

    if (existing.pcash < amount) {
      return message.reply("⚠️ You don't have enough pcash to make that bet.");
    }

    // Initial message
    const flipMessage = await message.reply(
      `${existing.username} is flipping the coin... 🪙`,
    );

    // Delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Deduct bet
    existing.pcash -= amount;

    // Win rate
    const winRate = existing.isAdmin ? 1 : 0.5;

    // Flip
    const coin = Math.random() < winRate ? "Heads" : "Tails";

    let resultMessage = "";
    let imageFile = "";

    if (coin === "Heads") {
      existing.pcash += amount * 2;
      resultMessage = `🎉 You won **${amount}** pcash profit!`;
      imageFile = "head.png";
    } else {
      resultMessage = `💀 You lost **${amount}** pcash.`;
      imageFile = "tail.png";
    }

    await existing.save();

    const imagePath = path.join(process.cwd(), "src", "res", imageFile);

    const attachment = new AttachmentBuilder(imagePath, {
      name: imageFile,
    });

    return flipMessage.edit({
      content: `${existing.username} flipped the coin... 🪙 and it landed on **${coin}**!\n${resultMessage}`,
      embeds: [
        {
          title: "Coin Flip Result",
          description: `💰 Your new balance: **${existing.pcash}** pcash`,
          image: {
            url: `attachment://${imageFile}`,
          },
          color: coin === "Heads" ? 0x57f287 : 0xed4245,
        },
      ],
      files: [attachment],
    });
  } catch (error) {
    console.error("Error in coinflip:", error);
    return message.reply("❌ An error occurred while flipping the coin.");
  }
}
