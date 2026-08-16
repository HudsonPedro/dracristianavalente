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
import { reportLovableError } from "../lib/lovable-error-reporting";
import { CartProvider } from "../contexts/cart-context";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>

        <h2 className="mt-4 text-xl font-semibold text-foreground">
          Page not found
        </h2>

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

function ErrorComponent({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  console.error(error);

  const router = useRouter();

  useEffect(() => {
    reportLovableError(error, {
      boundary: "tanstack_root_error_component",
    });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back
          home.
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

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },

      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },

      {
        title: "Dra. Cristiana Valente Estética - Capilar e Facial",
      },

      {
        name: "description",
        content:
          "Estética facial, corporal e capilar com protocolos personalizados, tecnologia avançada e resultados naturais. Agende sua avaliação com a Dra. Cristiana Valente.",
      },

      {
        name: "author",
        content: "Lovable",
      },

      {
        property: "og:title",
        content: "Dra. Cristiana Valente Estética - Capilar e Facial",
      },

      {
        property: "og:description",
        content:
          "Estética facial, corporal e capilar com protocolos personalizados, tecnologia avançada e resultados naturais. Agende sua avaliação com a Dra. Cristiana Valente.",
      },

      {
        property: "og:type",
        content: "website",
      },

      {
        name: "twitter:card",
        content: "summary",
      },

      {
        name: "twitter:site",
        content: "@Lovable",
      },

      {
        name: "twitter:title",
        content: "Dra. Cristiana Valente Estética - Capilar e Facial",
      },

      {
        name: "twitter:description",
        content:
          "Estética facial, corporal e capilar com protocolos personalizados, tecnologia avançada e resultados naturais. Agende sua avaliação com a Dra. Cristiana Valente.",
      },

      {
        property: "og:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/1c9bdef7-242f-49ca-bc00-e04bb557052e/id-preview-5e3e921f--8cd2e9a1-3be0-4e9a-bbba-314d8bcb5e19.lovable.app-1784309014317.png",
      },

      {
        name: "twitter:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/1c9bdef7-242f-49ca-bc00-e04bb557052e/id-preview-5e3e921f--8cd2e9a1-3be0-4e9a-bbba-314d8bcb5e19.lovable.app-1784309014317.png",
      },
    ],

    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),

  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html>
      <head>
        <HeadContent />

        {/* Google Analytics */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-XW6KJ22X76"
        />

        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];

              function gtag(){
                dataLayer.push(arguments);
              }

              gtag('js', new Date());

              const params = new URLSearchParams(window.location.search);

              const utmSource = params.get('utm_source');
              const utmMedium = params.get('utm_medium');
              const utmCampaign = params.get('utm_campaign');

              const gaConfig = {
                page_location: window.location.href
              };

              if (utmSource) {
                gaConfig.campaign_source = utmSource;
              }

              if (utmMedium) {
                gaConfig.campaign_medium = utmMedium;
              }

              if (utmCampaign) {
                gaConfig.campaign_name = utmCampaign;
              }

              gtag('config', 'G-XW6KJ22X76', gaConfig);
            `,
          }}
        />
      </head>

      <body>
        {children}

        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } =
    Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        {/* Required: nested routes render here.
            Removing <Outlet /> breaks all child routes. */}
        <Outlet />
      </CartProvider>
    </QueryClientProvider>
  );
}
