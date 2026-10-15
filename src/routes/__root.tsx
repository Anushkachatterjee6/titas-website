import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";

const GOOGLE_FONTS_URL =
  "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&family=Outfit:wght@400;500;600;700&family=Noto+Sans+Bengali:wght@400;600&display=swap";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { CartProvider } from "../lib/cart";
import { AuthProvider } from "../lib/auth";
import { CartDrawer } from "../components/site/CartDrawer";
import { ChatLauncher } from "../components/site/ChatLauncher";
import { WhatsAppButton } from "../components/site/WhatsAppButton";
import { Toaster } from "../components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: unknown; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Lovable App" },
      { name: "description", content: "Lovable Generated Project" },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "Lovable App" },
      { property: "og:description", content: "Lovable Generated Project" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@Lovable" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        {/*
          Google Fonts, loaded without blocking first render — same 4
          families/weights as before (DM Sans, Instrument Serif, Outfit,
          Noto Sans Bengali), unchanged.

          A plain `<link rel="stylesheet">` here would be render-blocking:
          the browser can't paint any text until it's fetched the CSS,
          then the font files it references. This is the standard
          "preload as style, then swap its media to activate it" pattern
          (the same technique web.dev/loadCSS use): the browser fetches
          the stylesheet at a non-blocking priority (`media="print"` makes
          it initially inapplicable to screens, so it doesn't block
          rendering), and the instant it's loaded, the inline `onload`
          flips `media` to `all`, applying it.

          `onload` is deliberately lowercase (not React's camelCase
          `onLoad`) — a lowercase prop isn't one of React's synthetic
          event names, so React passes it straight through as a native
          HTML attribute instead of expecting a JS function value. That
          matters here specifically: this needs to fire as a real inline
          DOM event the instant the browser finishes the fetch, which can
          happen before React finishes hydrating — a React-attached
          `onLoad` handler could miss that if hydration hasn't completed
          yet, silently leaving the stylesheet in its inert `media="print"`
          state.

          The URL already has `&display=swap`, so even before this
          stylesheet applies, text renders immediately in the browser's
          fallback font and swaps to the real one once it loads — never a
          blank/invisible-text flash, and no layout shift from the swap
          since `display=swap` doesn't reserve different metrics per font.

          `<noscript>` repeats a plain blocking `<link>` for the (rare)
          case where JavaScript is unavailable, so fonts still load there
          too, just without the non-blocking benefit.
        */}
        <link rel="preload" as="style" href={GOOGLE_FONTS_URL} />
        <link
          rel="stylesheet"
          href={GOOGLE_FONTS_URL}
          media="print"
          // Not a typed React DOM prop (see the comment above) — cast just
          // this one extra attribute rather than widening the whole tag.
          {...({ onload: "this.media='all'" } as { onload?: string })}
        />
        <noscript>
          <link rel="stylesheet" href={GOOGLE_FONTS_URL} />
        </noscript>
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
          <Outlet />
          <CartDrawer />
          <ChatLauncher />
          <WhatsAppButton />
          <Toaster position="bottom-center" />
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
