const { schedule } = require('node-cron');
const { ButtonComponent, ButtonStyle, ActionRow, Embed } = require('discord.js');
function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const getTranscript = require('../functions/getTranscript.js');
module.exports = client => {
	schedule('0 0 * * *', async () => {
		// Get all users who have voted recently
		const voteData = await client.query('SELECT * FROM lastvoted');
		voteData.forEach(async data => {
			if (data.timestamp + 86400000 < Date.now()) {
				// If the user has not voted in 24 hours, remove them from the vote database
				await client.delData('lastvoted', 'userId', data.userId);
			}
		});
		// Get all tickets
		const ticketData = await client.query('SELECT * FROM ticketdata');
		ticketData.forEach(async data => {
			if (data.resolved == 'true') {
				data.users = data.users.split(',');
				const channel = await client.channels.cache.get(data.channelId);
				channel.setName(channel.name.replace('ticket', 'closed'));
				await sleep(1000);
				if (channel.name.includes(`ticket${client.user.username.replace('Pup', '').replace(' ', '').toLowerCase()}-`)) return channel.send({ content: 'Failed to close ticket, please try again in 10 minutes' });
				if (data.voiceticket !== 'false') {
					const voiceticket = await channel.guild.channels.cache.get(data.voiceticket);
					voiceticket.delete();
					await client.setData('ticketdata', 'channelId', channel.id, 'voiceticket', 'false');
				}
				await client.setData('ticketdata', 'channelId', channel.id, 'resolved', 'false');
				await data.users.forEach(userid => channel.permissionOverwrites.edit(client.users.cache.get(userid), { VIEW_CHANNEL: false }));
				const messages = await channel.messages.fetch({ limit: 100 });
				const link = await getTranscript(messages);
				const users = [];
				await data.users.forEach(userid => users.push(client.users.cache.get(userid)));
				const CloseDMEmbed = new Embed()
					.setColor(Math.floor(Math.random() * 16777215))
					.setTitle(`Closed ${channel.name}`)
					.addField({ name: '**Users in ticket**', value: `${users}` })
					.addField({ name: '**Transcript**', value: `${link}.txt` })
					.addField({ name: '**Closed by**', value: 'Automatically closed' });
				client.logger.info(`Created transcript of ${channel.name}: ${link}.txt`);
				users.forEach(usr => {
					usr.send({ embeds: [CloseDMEmbed] })
						.catch(error => { client.logger.warn(error); });
				});
				const resolveEmbed = new Embed()
					.setColor(0xFF6400)
					.setDescription('Automatically closed Resolved Ticket');
				const srvconfig = await client.getData('settings', 'guildId', channel.guild.id);
				if (srvconfig.tickets == 'buttons') {
					const row = new ActionRow()
						.addComponents([
							new ButtonComponent()
								.setCustomId('delete_ticket')
								.setLabel('Delete Ticket')
								.setEmoji({ name: '⛔' })
								.setStyle(ButtonStyle.Danger),
							new ButtonComponent()
								.setCustomId('reopen_ticket')
								.setLabel('Reopen Ticket')
								.setEmoji({ name: '🔓' })
								.setStyle(ButtonStyle.Primary),
						]);
					channel.send({ embeds: [resolveEmbed], components: [row] });
				}
				else if (srvconfig.tickets == 'reactions') {
					Embed.setColor(0x5662f6);
					Embed.setDescription('🔓 Reopen Ticket `/open`\n⛔ Delete Ticket `/delete`');
					const Panel = await channel.send({ embeds: [Embed] });
					Panel.react('🔓');
					Panel.react('⛔');
				}
				client.logger.info(`Closed resolved ticket #${channel.name}`);
			}
		});
	});
	client.logger.info('Ticket autoclose loaded');
};