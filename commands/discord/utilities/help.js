const { ButtonBuilder, ActionRowBuilder, EmbedBuilder, SelectMenuBuilder, SelectMenuOptionBuilder } = require('@discordjs/builders');
const { ButtonStyle, PermissionsBitField } = require('discord.js');
module.exports = {
	name: 'help',
	description: 'Get help with Cactie',
	aliases: ['commands'],
	botperm: 'AddReactions',
	usage: '[Type]',
	cooldown: 10,
	options: require('../../options/help.js'),
	async execute(message, args, client, lang) {
		try {
			const helpdesc = require(`../../../lang/${lang.language.name}/helpdesc.json`);
			const srvconfig = await client.getData('settings', 'guildId', message.guild.id);
			let HelpEmbed = new EmbedBuilder()
				.setColor(Math.floor(Math.random() * 16777215))
				.setTitle('**HELP**');
			let arg = args[0];
			if (arg) arg = arg.toLowerCase();
			if (arg == 'admin' || arg == 'fun' || arg == 'animals' || arg == 'music' || arg == 'nsfw' || arg == 'tickets' || arg == 'utilities' || arg == 'actions') {
				if (arg == 'nsfw' && !message.channel.nsfw) return message.react('🔞').catch(err => client.logger.error(err.stack));
				const category = helpdesc[arg.toLowerCase()];
				const commands = client.commands.filter(c => c.category == arg.toLowerCase());
				const array = [];
				commands.forEach(c => { array.push(`**${c.name}${c.usage ? ` ${c.usage}` : ''}**${c.description ? `\n${c.description}` : ''}${c.aliases ? `\n*Aliases: ${c.aliases}*` : ''}${c.permission ? `\n*Permission: ${c.permission}*` : ''}`); });
				HelpEmbed.setDescription(`**${category.name.toUpperCase()}**\n${category.description}\n[] = Optional\n<> = Required\n\n${array.join('\n')}`);
				if (category.footer) HelpEmbed.setFooter({ text: category.footer });
				if (category.field) HelpEmbed.setFields([category.field]);
			}
			else if (arg == 'supportpanel') {
				if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && message.member.id != '249638347306303499') return client.error('You can\'t do that!', message, true);
				const Panel = new EmbedBuilder()
					.setColor(0x2f3136)
					.setTitle('Need help? No problem!')
					.setFooter({ text: `${message.guild.name} Support`, iconURL: message.guild.iconURL() });
				let channel;
				if (args[1]) channel = message.guild.channels.cache.get(args[1]);
				if (!channel) channel = message.channel;

				if (srvconfig.tickets == 'buttons') {
					Panel.setDescription('Click the button below to open a ticket!');
					const row = new ActionRowBuilder()
						.addComponents([
							new ButtonBuilder()
								.setCustomId('create_ticket')
								.setLabel('Open Ticket')
								.setEmoji({ name: '🎫' })
								.setStyle(ButtonStyle.Primary),
						]);
					await channel.send({ embeds: [Panel], components: [row] });
					return message.reply('Support panel created! You may now delete this message');
				}
				else if (srvconfig.tickets == 'reactions') {
					Panel.setDescription('React with 🎫 to open a ticket!');
					const panelMsg = await channel.send({ embeds: [Panel] });
					await panelMsg.react('🎫');
				}
				else if (srvconfig.tickets == 'false') {
					return client.error('Tickets are disabled!', message, true);
				}
			}
			else {
				HelpEmbed.setDescription('Please use the dropdown below to navigate through the help menu\n\n**Options:**\nAdmin, Fun, Animals, Music, NSFW, Tickets, Utilities, Actions');
			}
			const options = [];
			const categories = Object.keys(helpdesc);
			categories.forEach(category => {
				if (category == 'supportpanel') return;
				options.push(
					new SelectMenuOptionBuilder()
						.setLabel(helpdesc[category].name)
						.setDescription(helpdesc[category].description)
						.setValue(`help_${category}`)
						.setDefault(arg == category),
				);
			});
			const row = new ActionRowBuilder()
				.addComponents([
					new SelectMenuBuilder()
						.setCustomId('help_menu')
						.setPlaceholder('Select a help category!')
						.addOptions(options),
				]);
			const row2 = new ActionRowBuilder()
				.addComponents([
					new ButtonBuilder()
						.setURL('https://cactie.smhsmh.club/discord')
						.setLabel('Support Discord')
						.setStyle(ButtonStyle.Link),
					new ButtonBuilder()
						.setURL('https://paypal.me/youhavebeenyoted')
						.setLabel('Donate')
						.setStyle(ButtonStyle.Link),
				]);
			const helpMsg = await message.reply({ embeds: [HelpEmbed], components: [row, row2] });

			const filter = i => i.customId == 'help_menu';
			const collector = helpMsg.createMessageComponentCollector({ filter, time: 3600000 });
			collector.on('collect', async interaction => {
				await interaction.deferUpdate();
				HelpEmbed = new EmbedBuilder()
					.setColor(Math.floor(Math.random() * 16777215))
					.setTitle('**HELP**');
				if (interaction.values[0] == 'help_nsfw' && !helpMsg.channel.nsfw) { HelpEmbed.setDescription('**NSFW commands are only available in NSFW channels.**\nThis is not an NSFW channel!'); }
				else {
					const category = helpdesc[interaction.values[0].split('_')[1]];
					const commands = client.commands.filter(c => c.category == interaction.values[0].split('_')[1]);
					const array = [];
					commands.forEach(c => { array.push(`**${c.name}${c.usage ? ` ${c.usage}` : ''}**${c.description ? `\n${c.description}` : ''}${c.aliases ? `\n*Aliases: ${c.aliases}*` : ''}${c.permission ? `\n*Permission: ${c.permission}*` : ''}`); });
					HelpEmbed.setDescription(`**${category.name.toUpperCase()}**\n${category.description}\n[] = Optional\n<> = Required\n\n${array.join('\n')}`);
					if (category.footer) HelpEmbed.setFooter({ text: category.footer });
					if (category.field) HelpEmbed.setFields([category.field]);
				}
				row.components[0].options.forEach(option => option.setDefault(option.toJSON().value == interaction.values[0]));
				helpMsg.edit({ embeds: [HelpEmbed], components: [row, row2] });
			});

			collector.on('end', () => {
				HelpEmbed.setDescription('Help command timed out.')
					.setFooter({ text: 'please do the help command again if you still need a list of commands.' });
				helpMsg.edit({ embeds: [HelpEmbed], components: [row2] })
					.catch(err => client.logger.warn(err));
			});
		}
		catch (err) { client.error(err, message); }
	},
};