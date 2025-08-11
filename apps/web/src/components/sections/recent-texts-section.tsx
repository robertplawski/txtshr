import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { trpc } from "@/utils/trpc";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ITEMS_PER_PAGE = 5;

function RecentTextsSection() {
  const [page, setPage] = useState(0);
  const publicTexts = useQuery({
    ...trpc.texts.getAll.queryOptions({
      limit: ITEMS_PER_PAGE,
      offset: page * ITEMS_PER_PAGE,
    }),
  });

  const router = useRouter();

  const handleNextPage = () => {
    if (publicTexts.data?.hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 0) {
      setPage((prev) => prev - 1);
    }
  };

  return (
    <>
      {publicTexts.isLoading ? (
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : publicTexts.data?.texts.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">
              No public texts yet. Be the first to share!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-1 flex-col justify-between">
          <div className="grid gap-4 ">
            {publicTexts.data?.texts.map((text) => (
              <Card
                key={text.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() =>
                  router.navigate({ to: "/$id", params: { id: text.id } })
                }
              >
                <CardHeader>
                  <CardTitle className="text-lg">{text.title}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>by {text.username || "Anonymous"}</span>
                    <span>•</span>
                    <span>
                      {formatDistanceToNow(new Date(text.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>

          {/* Pagination Controls */}
          {publicTexts.data && publicTexts.data.totalCount > ITEMS_PER_PAGE && (
            <div className="flex items-center justify-between mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevPage}
                disabled={page === 0}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              <span className="text-sm text-muted-foreground">
                Page {page + 1} of{" "}
                {Math.ceil(publicTexts.data.totalCount / ITEMS_PER_PAGE)}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={!publicTexts.data.hasMore}
                className="flex items-center gap-2"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default RecentTextsSection;
