import { Index, MinimongoEngine } from 'meteor/easy:search'

const UsersIndex = new Index({
	collection: Search,
	fields: ['firstname'],
	engine: new MinimongoEngine()
});
