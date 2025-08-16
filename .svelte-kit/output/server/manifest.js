export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["robots.txt"]),
	mimeTypes: {".txt":"text/plain"},
	_: {
		client: {start:"_app/immutable/entry/start.BSJphvAv.js",app:"_app/immutable/entry/app.CtIj0ZRI.js",imports:["_app/immutable/entry/start.BSJphvAv.js","_app/immutable/chunks/BhWlgVgB.js","_app/immutable/chunks/BukDRVN_.js","_app/immutable/chunks/CcYvD-Gm.js","_app/immutable/entry/app.CtIj0ZRI.js","_app/immutable/chunks/CcYvD-Gm.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/BukDRVN_.js","_app/immutable/chunks/CQNQEjI1.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js'))
		],
		remotes: {
			
		},
		routes: [
			
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
