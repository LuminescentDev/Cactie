const action = require('../../functions/action.js');
module.exports = {
	name: 'awooga',
	description: 'AWOOGAA!',
	usage: '[Someone]',
	options: require('../../discordcmds/options/someone.js'),
	async execute(message, args, client) {
		try {
			action(message, args, 'awooga', 'AWOOGAS', '👀👀');
		}
		catch (err) { client.error(err, message); }
	},
};