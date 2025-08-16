

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.BRDOjrgW.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/CcYvD-Gm.js","_app/immutable/chunks/CQNQEjI1.js"];
export const stylesheets = [];
export const fonts = [];
