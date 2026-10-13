import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    // The global `html { scroll-behavior: smooth }` (styles.css — used for
    // in-page anchor links like the FAQ jump links) means the router's
    // default scroll-to-top call resolves to an ANIMATED smooth scroll
    // rather than an instant jump, since CSS `scroll-behavior: smooth`
    // applies to any `scrollTo({ behavior: "auto" })` call, which is what
    // the router issues by default. On a route with a long previous scroll
    // position, that turns "new page starts at top" into a multi-hundred-ms
    // scroll-down-to-up animation playing out AFTER the new page has
    // already rendered — which both looks like scroll position carried
    // over, and can race the destination page's own Reveal/IntersectionObserver
    // setup against a still-animating viewport position. Forcing "instant"
    // here makes route-change scroll resets bypass the CSS smoothing
    // entirely, while in-page anchor links (handled separately by the
    // browser/`scrollIntoView`, not this option) keep their smooth scroll.
    scrollRestorationBehavior: "instant",
    defaultPreloadStaleTime: 0,
  });

  return router;
};
