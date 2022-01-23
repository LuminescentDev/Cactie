const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const { convertTime } = require('../../functions/music/convert.js');
const { createPaste } = require('hastebin');
module.exports = {
	name: 'queue',
	description: 'Show the music queue and now playing.',
	aliases: ['q'],
	cooldown: 4,
	player: true,
	async execute(message, args, client) {
		const player = client.manager.get(message.guild.id);
		const queue = player.queue;
		const song = queue.current;
		const embed = new MessageEmbed()
			.setColor(song.color)
			.setThumbnail(song.img);
		const multiple = 10;
		const page = args.length && Number(args[0]) ? Number(args[0]) : 1;
		const end = page * multiple;
		const start = end - multiple;
		const tracks = queue.slice(start, end);
		if (song) embed.addField('Now Playing', `[${song.title}](${song.uri}) \`[${convertTime(song.duration).replace('7:12:56', 'LIVE')}]\` [${song.requester}]`);
		let mapped = tracks.map((track, i) => `**${start + (++i)}** • ${track.title} \`[${convertTime(track.duration).replace('7:12:56', 'LIVE')}]\` [${track.requester}]`).join('\n');
		if (mapped.length > 1024) mapped = `List too long, shortened to a link\n${await createPaste(mapped)}`;
		if (!tracks.length) embed.addField('No tracks up next', `in ${page > 1 ? `page ${page}` : 'the queue'}.`);
		else embed.addField('🎶 Queue List', mapped);
		const maxPages = Math.ceil(queue.length / multiple);
		embed.setFooter({ text: `Page ${page > maxPages ? maxPages : page} of ${maxPages}` });
		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('queue_prev')
					.setLabel('◄')
					.setStyle('SECONDARY'),
				new MessageButton()
					.setCustomId('queue_next')
					.setLabel('►')
					.setStyle('SECONDARY'),
			);
		return message.reply({ embeds: [embed], components: [row] });
	},
};