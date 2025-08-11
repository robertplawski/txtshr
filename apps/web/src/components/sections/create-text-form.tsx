import { useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";
import { trpc } from "@/utils/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function CreateTextForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState<
    "public" | "unlisted" | "private"
  >("public");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const createText = useMutation({
    ...trpc.texts.create.mutationOptions(),
    onSuccess: (data: any) => {
      toast.success("Text created successfully!");
      router.navigate({ to: "/$id", params: { id: data.id } });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create text");
    },
  });

  const createAnonymousText = useMutation({
    ...trpc.texts.createAnonymous.mutationOptions(),
    onSuccess: (data: any) => {
      toast.success("Text created successfully!");
      router.navigate({ to: "/$id", params: { id: data.id } });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create text");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);

    try {
      if (session) {
        await createText.mutateAsync({ title, content, visibility });
      } else {
        await createAnonymousText.mutateAsync({ title, content });
      }
    } finally {
      queryClient.invalidateQueries(
        trpc.texts.getAll.queryOptions({ limit: 5 })
      );
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full flex-1">
      <CardHeader>
        <CardTitle>Create New Text</CardTitle>
        <CardDescription>
          {session
            ? "Share your text with the world"
            : "Share your text anonymously"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTitle(e.target.value)
            }
            placeholder="Enter a title for your text"
            maxLength={255}
          />

          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setContent(e.target.value)
            }
            placeholder="Enter your text content here..."
            className="min-h-[200px]"
          />

          {session && (
            <>
              <Label htmlFor="visibility">Visibility</Label>
              <Select
                value={visibility}
                onValueChange={(value: string) =>
                  setVisibility(value as "public" | "unlisted" | "private")
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">
                    Public - Visible to everyone
                  </SelectItem>
                  <SelectItem value="unlisted">
                    Unlisted - Only accessible with direct link
                  </SelectItem>
                  <SelectItem value="private">
                    Private - Only you can see it
                  </SelectItem>
                </SelectContent>
              </Select>
            </>
          )}

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Creating..." : "Create Text"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
