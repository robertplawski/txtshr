import { createFileRoute } from "@tanstack/react-router";
import { trpc } from "@/utils/trpc";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { useRouter } from "@tanstack/react-router";
import { ArrowLeft, Copy, Share2, Trash } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { useMemo } from "react";

export const Route = createFileRoute("/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const textQuery = useQuery(trpc.texts.getById.queryOptions({ id }));

  const deleteMutation = useMutation({
    ...trpc.texts.delete.mutationOptions(),
    onSuccess: () => {
      toast.success("Text deleted successfully");
      queryClient.invalidateQueries(
        trpc.texts.getAll.queryOptions({ limit: 5 })
      );
      router.navigate({ to: "/" });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete text");
    },
  });

  const handleCopy = async () => {
    if (textQuery.data?.content) {
      try {
        await navigator.clipboard.writeText(textQuery.data.content);
        toast.success("Text copied to clipboard");
      } catch (err) {
        toast.error("Failed to copy text");
      }
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this text?")) {
      deleteMutation.mutate({ id });
    }
  };
  const { data: session } = authClient.useSession();

  const text = textQuery.data;
  const canDelete = useMemo(
    () => session && text && session?.user.id == text.userId,
    [session, text]
  );

  if (textQuery.isLoading) {
    return (
      <div className="col-span-2  h-full flex flex-col p-0 break-all container mx-auto max-w-4xl">
        <Card className="flex-1">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="h-15">
                <CardTitle className="text-2xl"></CardTitle>
                <div className="flex items-center gap-2  text-sm text-muted-foreground mt-2"></div>
              </div>
              <Button variant="outline" size="sm">
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap font-mono text-sm bg-muted p-4 rounded-md  overflow-scroll h-[500px] max-h-[500px]">
              <Loader />
            </pre>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (textQuery.error) {
    return (
      <div className="container  col-span-2 mx-auto max-w-4xl px-4 ">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Text Not Found</h2>
            <p className="text-muted-foreground mb-4">
              {textQuery.error.message ||
                "The text you're looking for doesn't exist or is not accessible."}
            </p>
            <Button onClick={() => router.navigate({ to: "/" })}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!text) {
    return null;
  }

  return (
    <div className="col-span-2  h-full flex flex-col p-0 break-all container mx-auto max-w-4xl">
      <Card className="flex-1">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{text.title}</CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                <span>by {text.username || "Anonymous"}</span>
                <span>•</span>
                <span>
                  {formatDistanceToNow(new Date(text.createdAt), {
                    addSuffix: true,
                  })}
                </span>
                {text.visibility !== "public" && (
                  <>
                    <span>•</span>
                    <span className="capitalize">{text.visibility}</span>
                  </>
                )}
              </div>
            </div>
            <div className="flex flex-row gap-2">
              {canDelete && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                >
                  <Trash className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" onClick={handleCopy}>
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <pre className="whitespace-pre-wrap font-mono text-sm bg-muted p-4 rounded-md  overflow-scroll h-[500px] max-h-[500px]">
            {text.content}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
