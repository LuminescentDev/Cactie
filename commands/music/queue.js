const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const { convertTime } = require('../../functions/music/convert.js');
const { createPaste } = require('hastebin');
const msg = require('../../lang/en/msg.json');
module.exports = {
	name: 'queue',
	description: 'Show the music queue and now playing.',
	usage: '[Page Number]',
	aliases: ['q'],
	cooldown: 4,
	player: true,
	async execute(message, args, client) {
		// Get the player, queue, and embed
		const player = client.manager.get(message.guild.id);
		const queue = player.queue;
		const song = queue.current;
		const embed = new MessageEmbed()
			.setColor(song.color)
			.setThumbnail(song.img);

		// Get first page or page specified
		const page = args.length && Number(args[0]) ? Number(args[0]) : 1;
		const end = page * 10;
		const start = end - 10;
		const tracks = queue.slice(start, end);

		// Add current song as a field and queue list
		if (song) embed.addField(msg.music.np, `[${song.title}](${song.uri}) \`[${convertTime(song.duration).replace('7:12:56', 'LIVE')}]\` [${song.requester}]`);
		let mapped = tracks.map((track, i) => `**${start + (++i)}** • ${track.title} \`[${convertTime(track.duration).replace('7:12:56', 'LIVE')}]\` [${track.requester}]`).join('\n');
		if (mapped.length > 1024) mapped = `List too long, shortened to a link\n${await createPaste(mapped)}`;
		if (!tracks.length) embed.addField('No tracks up next', `in ${page > 1 ? `page ${page}` : 'the queue'}.`);
		else embed.addField('🎶 Queue List', mapped);

		// Get max pages and add it to footer and reply with buttons
		const maxPages = Math.ceil(queue.length / 10);
		embed.setFooter({ text: msg.page.replace('-1', page > maxPages ? maxPages : page).replace('-2', maxPages) });
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
		message.reply({ embeds: [embed], components: [row] });
	},
};