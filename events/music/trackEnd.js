module.exports = async (client, player) => {
	const autoplay = player.get('autoplay');
	if (autoplay === true) {
		const requester = player.get('requester');
		const identifier = player.queue.current.identifier;
		const search = `https://www.youtube.com/watch?v=${identifier}&list=RD${identifier}`;
		const res = await player.search(search, requester);
		player.queue.add(res.tracks[2]);
	}
};