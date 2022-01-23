const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const fetch = (...args) => import('node-fetch').then(({ default: e }) => e(...args));
const YAML = require('yaml');
const fs = require('fs');
const createField = require('./createField.js');
const evalField = require('./evalField.js');
module.exports = async function analyzeTimings(message, client, args) {
	const Embed = new MessageEmbed()
		.setDescription('These are not magic values. Many of these settings have real consequences on your server\'s mechanics. See [this guide](https://eternity.community/index.php/paper-optimization/) for detailed information on the functionality of each setting.')
		.setFooter({ text: `Requested by ${message.member.user.tag}`, iconURL: message.member.user.avatarURL({ dynamic: true }) });

	let url = null;

	args.forEach(arg => {
		if (arg.startsWith('https://timin') && arg.includes('?id=')) url = arg.replace('/d=', '/?id=').split('#')[0].split('\n')[0];
		if (arg.startsWith('https://www.spigotmc.org/go/timings?url=') || arg.startsWith('https://spigotmc.org/go/timings?url=')) {
			Embed.addField('❌ Spigot', 'Spigot timings have limited information. Switch to [Purpur](https://purpurmc.org) for better timings analysis. All your plugins will be compatible, and if you don\'t like it, you can easily switch back.')
				.setURL(url);
			return { embeds: [Embed] };
		}
	});

	if (!url) return { content: 'Invalid URL' };

	client.logger.info(`Timings analyzed from ${message.member.user.tag} (${message.member.user.id}): ${url}`);

	const timings_host = url.split('?id=')[0];
	const timings_id = url.split('?id=')[1];

	const timings_json = timings_host + 'data.php?id=' + timings_id;
	const url_raw = url + '&raw=1';

	const response_raw = await fetch(url_raw);
	const request_raw = await response_raw.json();
	const response_json = await fetch(timings_json);
	const request = await response_json.json();

	const server_icon = timings_host + 'image.php?id=' + request_raw.icon;
	Embed.setAuthor({ name: 'Timings Analysis', iconURL: server_icon, url: url });

	if (!request_raw || !request) {
		Embed.addFields('❌ Invalid report', 'Create a new timings report.', true);
		return { embeds: [Embed] };
	}

	let version = request.timingsMaster.version;
	client.logger.info(version);

	if (version.endsWith('(MC: 1.17)')) version = version.replace('(MC: 1.17)', '(MC: 1.17.0)');

	const TIMINGS_CHECK = await YAML.parse(fs.readFileSync('./lang/int/timings_check.yml', 'utf8'));

	if (TIMINGS_CHECK.version && version) {
		// ghetto version check
		if (version.split('(MC: ')[1].split(')')[0] != TIMINGS_CHECK.version) {
			version = version.replace('git-', '').replace('MC: ', '');
			Embed.addField('❌ Outdated', `You are using \`${version}\`. Update to \`${TIMINGS_CHECK.version}\`.`, true);
		}
	}

	if (TIMINGS_CHECK.servers) {
		TIMINGS_CHECK.servers.forEach(server => {
			if (version.includes(server.name)) Embed.addFields(createField(server));
		});
	}

	const timing_cost = parseInt(request.timingsMaster.system.timingcost);
	if (timing_cost > 300) Embed.addField('❌ Timingcost', `Your timingcost is ${timing_cost}. Your cpu is overloaded and/or slow. Find a [better host](https://www.birdflop.com).`, true);

	const flags = request.timingsMaster.system.flags;
	const jvm_version = request.timingsMaster.system.jvmversion;
	if (flags.includes('-XX:+UseZGC') && flags.includes('-Xmx')) {
		const flaglist = flags.split(' ');
		flaglist.forEach(flag => {
			if (flag.startsWith('-Xmx')) {
				let max_mem = flag.split('-Xmx')[1];
				max_mem = max_mem.replace('G', '000');
				max_mem = max_mem.replace('M', '');
				max_mem = max_mem.replace('g', '000');
				max_mem = max_mem.replace('m', '');
				if (parseInt(max_mem) < 10000) Embed.addField('❌ Low Memory', 'ZGC is only good with a lot of memory.', true);
			}
		});
	}
	else if (flags.includes('-Daikars.new.flags=true')) {
		if (!flags.includes('-XX:+PerfDisableSharedMem')) Embed.addField('❌ Outdated Flags', 'Add `-XX:+PerfDisableSharedMem` to flags.', true);
		if (!flags.includes('-XX:G1MixedGCCountTarget=4')) Embed.addField('❌ Outdated Flags', 'Add `XX:G1MixedGCCountTarget=4` to flags.', true);
		if (!flags.includes('-XX:+UseG1GC') && jvm_version.startswith('1.8.')) Embed.addField('❌ Aikar\'s Flags', 'You must use G1GC when using Aikar\'s flags.', true);
		if (flags.includes('-Xmx')) {
			let max_mem = 0;
			const flaglist = flags.split(' ');
			flaglist.forEach(flag => {
				if (flag.startsWith('-Xmx')) {
					max_mem = flag.split('-Xmx')[1];
					max_mem = max_mem.replace('G', '000');
					max_mem = max_mem.replace('M', '');
					max_mem = max_mem.replace('g', '000');
					max_mem = max_mem.replace('m', '');
				}
			});
			if (parseInt(max_mem) < 5400) Embed.addField('❌ Low Memory', 'Allocate at least 6-10GB of ram to your server if you can afford it.', true);
			let index = 0;
			let max_online_players = 0;
			while (index < request.timingsMaster.data.length) {
				const timed_ticks = request.timingsMaster.data[index].minuteReports[0].ticks.timedTicks;
				const player_ticks = request.timingsMaster.data[index].minuteReports[0].ticks.playerTicks;
				const players = (player_ticks / timed_ticks);
				max_online_players = Math.max(players, max_online_players);
				index = index + 1;
			}
			if (1000 * max_online_players / parseInt(max_mem) > 6 && parseInt(max_mem) < 10000) Embed.addField('❌ Low Memory', 'You should be using more RAM with this many players.', true);
			if (flags.includes('-Xms')) {
				let min_mem = 0;
				flaglist.forEach(flag => {
					if (flag.startsWith('-Xmx')) {
						min_mem = flag.split('-Xmx')[1];
						min_mem = min_mem.replace('G', '000');
						min_mem = min_mem.replace('M', '');
						min_mem = min_mem.replace('g', '000');
						min_mem = min_mem.replace('m', '');
					}
				});
				if (min_mem != max_mem) Embed.addField('❌ Aikar\'s Flags', 'Your Xmx and Xms values should be equal when using Aikar\'s flags.', true);
			}
		}
	}
	else if (flags.includes('-Dusing.aikars.flags=mcflags.emc.gs')) {
		Embed.addField('❌ Outdated Flags', 'Update [Aikar\'s flags](https://aikar.co/2018/07/02/tuning-the-jvm-g1gc-garbage-collector-flags-for-minecraft/).', true);
	}
	else {
		Embed.addField('❌ Aikar\'s Flags', 'Use [Aikar\'s flags](https://aikar.co/2018/07/02/tuning-the-jvm-g1gc-garbage-collector-flags-for-minecraft/).', true);
	}

	const cpu = parseInt(request.timingsMaster.system.cpu);
	if (cpu <= 2) Embed.addField('❌ Threads', `You only have ${cpu} thread(s). Find a [better host](https://www.birdflop.com).`, true);

	const handlers = Object.keys(request_raw.idmap.handlers).map(i => { return request_raw.idmap.handlers[i]; });
	handlers.forEach(handler => {
		let handler_name = handler[1];
		if (handler_name.startsWith('Command Function - ') && handler_name.endsWith(':tick')) {
			handler_name = handler_name.split('Command Function - ')[1].split(':tick')[0];
			Embed.addField(`❌ ${handler_name}`, 'This datapack uses command functions which are laggy.', true);
		}
	});

	const plugins = Object.keys(request.timingsMaster.plugins).map(i => { return request.timingsMaster.plugins[i]; });
	const server_properties = request.timingsMaster.config['server.properties'];
	const bukkit = request.timingsMaster.config ? request.timingsMaster.config.bukkit : null;
	const spigot = request.timingsMaster.config ? request.timingsMaster.config.spigot : null;
	const paper = request.timingsMaster.config ? request.timingsMaster.config.paper : null;
	const purpur = request.timingsMaster.config ? request.timingsMaster.config.purpur : null;

	if (TIMINGS_CHECK.plugins) {
		Object.keys(TIMINGS_CHECK.plugins).forEach(server_name => {
			if (Object.keys(request.timingsMaster.config).includes(server_name)) {
				plugins.forEach(plugin => {
					Object.keys(TIMINGS_CHECK.plugins[server_name]).forEach(plugin_name => {
						if (plugin.name == plugin_name) {
							const stored_plugin = TIMINGS_CHECK.plugins[server_name][plugin_name];
							stored_plugin.name = plugin_name;
							Embed.addFields(createField(stored_plugin));
						}
					});
				});
			}
		});
	}
	if (TIMINGS_CHECK.config) {
		Object.keys(TIMINGS_CHECK.config).map(i => { return TIMINGS_CHECK.config[i]; }).forEach(config => {
			Object.keys(config).forEach(option_name => {
				const option = config[option_name];
				evalField(Embed, option, option_name, plugins, server_properties, bukkit, spigot, paper, purpur, client);
			});
		});
	}

	plugins.forEach(plugin => {
		if (plugin.authors && plugin.authors.toLowerCase().includes('songoda')) {
			if (plugin.name == 'EpicHeads') Embed.addField('❌ EpicHeads', 'This plugin was made by Songoda. Songoda is sketchy. You should find an alternative such as [HeadsPlus](https://spigotmc.org/resources/headsplus-»-1-8-1-16-4.40265/) or [HeadDatabase](https://www.spigotmc.org/resources/head-database.14280/).', true);
			else if (plugin.name == 'UltimateStacker') Embed.addField('❌ UltimateStacker', 'Stacking plugins actually causes more lag.\nRemove UltimateStacker.', true);
			else Embed.addField(`❌ ${plugin.name}`, 'This plugin was made by Songoda. Songoda is sketchy. You should find an alternative.', true);
		}
	});

	const worlds = request_raw.worlds ? Object.keys(request_raw.worlds).map(i => { return request_raw.worlds[i]; }) : [];
	let high_mec = false;
	worlds.forEach(world => {
		const max_entity_cramming = parseInt(world.gamerules.maxEntityCramming);
		if (max_entity_cramming >= 24) high_mec = true;
	});
	if (high_mec) Embed.addField('❌ maxEntityCramming', 'Decrease this by running the /gamerule command in each world. Recommended: 8.', true);

	const normal_ticks = request.timingsMaster.data[0].totalTicks;
	let worst_tps = 20;
	request.timingsMaster.data.forEach(data => {
		const total_ticks = data.totalTicks;
		if (total_ticks == normal_ticks) {
			const end_time = data.end;
			const start_time = data.start;
			let tps = null;
			if (end_time == start_time) tps = 20;
			else tps = total_ticks / (end_time - start_time);
			if (tps < worst_tps) worst_tps = tps;
		}
	});
	let red = 0;
	let green = 0;
	if (worst_tps < 10) {
		red = 255;
		green = 255 * (0.1 * worst_tps);
	}
	else {
		red = 255 * (-0.1 * worst_tps + 2);
		green = 255;
	}
	Embed.setColor([Math.round(red), Math.round(green), 0]);

	const issue_count = Embed.fields.length;
	if (issue_count == 0) {
		Embed.addField('✅ All good', 'Analyzed with no recommendations.');
		return { embeds: [Embed] };
	}
	const components = [];
	if (issue_count >= 13) {
		let page = 1;
		if (message.customId) {
			const footer = message.message.embeds[0].footer.text.split(' • ');
			page = parseInt(footer[footer.length - 1].split('Page ')[1].split(' ')[0]);
			if (message.customId == 'timings_next') page = page + 1;
			if (message.customId == 'timings_prev') page = page - 1;
			if (page == 0) page = Math.ceil(issue_count / 12);
			if (page > Math.ceil(issue_count / 12)) page = 1;
			const index = page * 12;
			Embed.fields.splice(0, index - 12);
			Embed.fields.splice(index, issue_count);
			footer[footer.length - 1] = `Page ${page} of ${Math.ceil(issue_count / 12)}`;
			Embed.setFooter({ text: footer.join(' • '), iconURL: message.message.embeds[0].footer.iconURL });
		}
		else {
			Embed.fields.splice(12, issue_count);
			Embed.addField(`Plus ${issue_count - 12} more recommendations`, 'Click the buttons below to see more');
			Embed.setFooter({ text: `Requested by ${message.member.user.tag} • Page ${page} of ${Math.ceil(issue_count / 12)}`, iconURL: message.member.user.avatarURL({ dynamic: true }) });
		}
		components.push(
			new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('timings_prev')
						.setLabel('◄')
						.setStyle('SECONDARY'),
					new MessageButton()
						.setCustomId('timings_next')
						.setLabel('►')
						.setStyle('SECONDARY'),
					new MessageButton()
						.setURL('https://github.com/pemigrade/botflop')
						.setLabel('Botflop')
						.setStyle('LINK'),
				),
		);
	}
	return { embeds: [Embed], components: components };
};