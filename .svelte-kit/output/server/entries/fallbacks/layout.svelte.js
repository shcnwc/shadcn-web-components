import "clsx";
function Layout($$payload, $$props) {
  let { children } = $$props;
  children($$payload);
  $$payload.out.push(`<!---->`);
}
export {
  Layout as default
};
