import Header from "@/components/header";
import Loader from "@/components/loader";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { Breadcrumbs } from "@/components/breadcrumbs";
import type { trpc } from "@/utils/trpc";
import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  HeadContent,
  Outlet,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import "../index.css";
import { CreateTextForm } from "@/components/sections/create-text-form";
import RecentTextsSection from "@/components/sections/recent-texts-section";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export interface RouterAppContext {
  trpc: typeof trpc;
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  component: RootComponent,
  head: () => ({
    meta: [
      {
        title: "txtshr",
      },
      {
        name: "description",
        content: "txtshr is a web application",
      },
    ],
    links: [
      {
        rel: "icon",
        href: "/favicon.ico",
      },
    ],
  }),
});

function RootComponent() {
  const isFetching = useRouterState({
    select: (s) => s.isLoading,
  });

  return (
    <>
      <HeadContent />
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        disableTransitionOnChange
        storageKey="vite-ui-theme"
      >
        <div className="min-h-screen w-screen flex justify-center">
          <div className="w-full h-full max-w-7xl  p-4 ">
            <Header />

            <div className="container mx-auto max-w-7xl h-full mt-4 ">
              <div className="h-full grid  items-stretch overflow-hidden justify-items-stretch  lg:grid-cols-3 gap-8 ">
                <div className="  col-span-3 lg:col-span-2  flex flex-col">
                  <Breadcrumbs />
                  <div className="flex flex-col flex-1   justify-center">
                    {isFetching ? <Loader /> : <Outlet />}
                  </div>
                </div>
                <div className="h-[700px] flex-col flex  col-span-3 lg:col-span-1 w-full">
                  <h2 className="text-2xl font-bold mb-4">recent txts</h2>

                  <RecentTextsSection />
                </div>
              </div>
            </div>
          </div>
        </div>

        <Toaster />
      </ThemeProvider>
      <TanStackRouterDevtools position="bottom-left" />
      <ReactQueryDevtools position="bottom" buttonPosition="bottom-right" />
    </>
  );
}
