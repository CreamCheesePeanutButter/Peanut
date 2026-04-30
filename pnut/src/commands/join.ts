import { joinVoiceChannel } from "@discordjs/voice";

export async function handleJoin(interaction: any) {
  // Support slash OR prefix
  const member =
    interaction.member ||
    interaction.guild?.members.cache.get(interaction.user?.id);

  if (!member?.voice?.channel) {
    return interaction.reply({
      content: "❌ You need to be in a voice channel first.",
      ephemeral: true,
    });
  }

  const channel = member.voice.channel;

  joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guild.id,
    adapterCreator: channel.guild.voiceAdapterCreator,
  });

  return interaction.reply(`🎤 Joined ${channel.name}`);
}
