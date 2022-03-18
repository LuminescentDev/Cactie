const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
module.exports = {
	name: 'rockpaperscissors',
	description: 'Play Rock Paper Scissors with an opponent',
	aliases: ['rps'],
	args: true,
	usage: '<Opponent User>',
	cooldown: 10,
	options: require('../options/user.json'),
	async execute(message, args, client) {
		const user = message.guild.members.cache.get(args[0].replace(/\D/g, ''));
		if (!user) return client.error(message.lang.invalidmember, message, true);
		if (user.id == message.member.id) return client.error('You played yourself, oh wait, you can\'t.', message, true);
		const emoji = {
			rock: ['🪨', 'Rock', '🪨 Rock'],
			paper: ['📄', 'Paper', '📄 Paper'],
			scissors: ['✂️', 'Scissors', '✂️ Scissors'],
		};
		const row = new ActionRowBuilder();
		Object.keys(emoji).map(i => {
			row.addComponents(
				new ButtonBuilder()
					.setCustomId(i)
					.setEmoji({ name: emoji[i][0] })
					.setLabel(emoji[i][1])
					.setStyle(ButtonStyle.Secondary),
			);
		});
		const TicTacToe = new EmbedBuilder()
			.setColor(Math.floor(Math.random() * 16777215))
			.setTitle('Rock Paper Scissors')
			.setDescription('Select an option!')
			.setFields({ name: '**Waiting for:**', value: `${message.member}\n${user}` });

		const rpsmsg = await message.reply({ content: `${message.member} ${user}`, embeds: [TicTacToe], components: [row] });

		const collector = rpsmsg.createMessageComponentCollector({ time: 3600000 });

		const choices = {};
		collector.on('collect', async interaction => {
			if (interaction.customId != 'rock' && interaction.customId != 'paper' && interaction.customId != 'scissors') return;
			await interaction.deferReply({ ephemeral: true }).catch(err => client.logger.error(err));
			if (interaction.user.id != message.member.id && interaction.user.id != user.id) return interaction.editReply({ content: 'You\'re not in this game!' });
			if (choices[interaction.user.id]) return interaction.editReply({ content: `You've already selected ${emoji[choices[interaction.user.id]][2]}!` });
			choices[interaction.user.id] = interaction.customId;
			await interaction.editReply({ content: `**Selected ${emoji[interaction.customId][2]}!**` });

			if (interaction.user.id == message.member.id) TicTacToe.setFields({ name: '**Waiting for:**', value: `${user}` });
			else if (interaction.user.id == user.id) TicTacToe.setFields({ name: '**Waiting for:**', value: `${message.member}` });

			if (choices[message.member.id] && choices[user.id]) {
				TicTacToe.setFields();
				let win = true;
				if (choices[user.id] == 'rock' && choices[message.member.id] == 'scissors') win = false;
				else if (choices[user.id] == 'paper' && choices[message.member.id] == 'rock') win = false;
				else if (choices[user.id] == 'scissors' && choices[message.member.id] == 'paper') win = false;
				if (choices[message.member.id] == choices[user.id]) {
					TicTacToe.setDescription(`**It's a tie!**\nBoth users picked ${emoji[choices[user.id]][2]}!`);
					return rpsmsg.edit({ embeds: [TicTacToe], components: [] });
				}
				const winner = win ? message.member : user;
				const loser = win ? user : message.member;
				TicTacToe.setDescription(`**${winner} wins!**\n\n${emoji[choices[winner.id]][2]} wins over ${emoji[choices[loser.id]][2]}!`)
					.setThumbnail(winner.user.avatarURL());
				return rpsmsg.edit({ embeds: [TicTacToe], components: [] });
			}

			rpsmsg.edit({ embeds: [TicTacToe] });
		});

		collector.on('end', () => {
			if (TicTacToe.toJSON().fields) return;
			rpsmsg.edit({ content: 'A game of rock paper scissors should not last longer than 15 minutes are you high', components: [], embeds: [] });
		});
	},
};