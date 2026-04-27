import { joinVoiceChannel } from "@discordjs/voice";

export async function handleJoin(interaction: any) {
  const member = interaction.guild?.members.cache.get(interaction.user.id);
  const channel = member?.voice.channel;

  if (!channel) {
    return interaction.reply("Join a voice channel first.");
  }

  joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guild.id,
    adapterCreator: channel.guild.voiceAdapterCreator,
  });

  return interaction.reply(`Joined ${channel.name}`);
}
