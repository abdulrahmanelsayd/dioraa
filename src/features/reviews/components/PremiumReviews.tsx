"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star, ThumbsUp, CheckCircle2, Image as ImageIcon, ChevronDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getProductReviews, getReviewSummary } from "@/lib/api";
import { cn } from "@/shared/lib/utils";
import type { Review } from "@/lib/api";

interface PremiumReviewsProps {
  productId: string;
  productRating: number;
  reviewCount: number;
}

type SortOption = "newest" | "highest" | "lowest" | "helpful";
type FilterRating = "all" | 5 | 4 | 3 | 2 | 1;

export function PremiumReviews({ productId, productRating, reviewCount }: PremiumReviewsProps) {
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [filterRating, setFilterRating] = useState<FilterRating>("all");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [expandedReview, setExpandedReview] = useState<string | null>(null);

  const { data: summary } = useQuery({
    queryKey: ["review-summary", productId],
    queryFn: () => getReviewSummary(productId),
  });

  const { data: reviews } = useQuery({
    queryKey: ["reviews", productId, sortBy, filterRating, verifiedOnly],
    queryFn: () =>
      getProductReviews(productId, {
        sortBy,
        rating: filterRating === "all" ? undefined : (filterRating as 1 | 2 | 3 | 4 | 5),
        verifiedOnly,
      }),
  });

  const ratingDistribution = summary?.distribution || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  const totalReviews = summary?.totalReviews || reviewCount;

  return (
    <section className="py-12 border-t border-brand-rose/10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 mb-10">
        {/* Rating Summary */}
        <div className="flex items-start gap-8">
          <div className="text-center">
            <div className="text-6xl font-serif text-brand-ink">{productRating.toFixed(1)}</div>
            <div className="flex items-center justify-center gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    "w-4 h-4",
                    star <= Math.round(productRating)
                      ? "fill-brand-rose text-brand-rose"
                      : "text-brand-rose/20"
                  )}
                />
              ))}
            </div>
            <p className="text-sm text-brand-ink/50 mt-2">{totalReviews.toLocaleString()} Reviews</p>
          </div>

          {/* Rating Bars */}
          <div className="space-y-2 flex-1 min-w-[200px]">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = ratingDistribution[rating as 1 | 2 | 3 | 4 | 5] || 0;
              const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
              const isActive = filterRating === rating;

              return (
                <button
                  key={rating}
                  onClick={() => setFilterRating(filterRating === rating ? "all" : (rating as 5 | 4 | 3 | 2 | 1))}
                  className={cn(
                    "flex items-center gap-3 w-full group transition-all",
                    isActive && "opacity-100"
                  )}
                >
                  <span className="text-sm font-medium w-3">{rating}</span>
                  <Star className="w-3 h-3 text-brand-rose fill-brand-rose" />
                  <div className="flex-1 h-2 bg-brand-blush/30 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className={cn(
                        "h-full rounded-full transition-colors",
                        isActive ? "bg-brand-rose" : "bg-brand-rose/40 group-hover:bg-brand-rose/60"
                      )}
                    />
                  </div>
                  <span className="text-xs text-brand-ink/40 w-8 text-right">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setVerifiedOnly(!verifiedOnly)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all",
              verifiedOnly
                ? "bg-brand-ink text-white"
                : "bg-brand-offWhite text-brand-ink/70 hover:bg-brand-blush/30"
            )}
          >
            <CheckCircle2 className="w-4 h-4" />
            Verified Only
          </button>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="appearance-none px-4 py-2 pr-10 rounded-full bg-brand-offWhite text-brand-ink/70 text-sm hover:bg-brand-blush/30 transition-colors cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="highest">Highest Rated</option>
              <option value="lowest">Lowest Rated</option>
              <option value="helpful">Most Helpful</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-ink/40 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews?.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            isExpanded={expandedReview === review.id}
            onToggle={() =>
              setExpandedReview(expandedReview === review.id ? null : review.id)
            }
          />
        ))}
      </div>

      {reviews?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-brand-ink/50">No reviews match your filters</p>
        </div>
      )}
    </section>
  );
}

function ReviewCard({
  review,
  isExpanded,
  onToggle,
}: {
  review: Review;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const [helpful, setHelpful] = useState(review.helpful);
  const [hasVoted, setHasVoted] = useState(false);

  const handleHelpful = () => {
    if (!hasVoted) {
      setHelpful(helpful + 1);
      setHasVoted(true);
    }
  };

  return (
    <motion.div
      layout
      className="bg-white rounded-2xl p-6 border border-brand-rose/10 hover:border-brand-rose/20 transition-colors"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-rose/30 to-brand-blush/50 flex items-center justify-center text-brand-ink font-medium">
            {review.userName.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-brand-ink">{review.userName}</p>
            <div className="flex items-center gap-2 text-xs text-brand-ink/50">
              {review.verified && (
                <span className="flex items-center gap-1 text-brand-rose">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified Purchase
                </span>
              )}
              <span>•</span>
              <span>{new Date(review.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={cn(
                "w-4 h-4",
                star <= review.rating ? "fill-brand-rose text-brand-rose" : "text-brand-rose/20"
              )}
            />
          ))}
        </div>
      </div>

      {/* Title & Comment */}
      <h4 className="font-medium text-brand-ink mb-2">{review.title}</h4>
      <div className="relative">
        <p
          className={cn(
            "text-brand-ink/70 leading-relaxed",
            !isExpanded && "line-clamp-3"
          )}
        >
          {review.comment}
        </p>
        {review.comment.length > 200 && (
          <button
            onClick={onToggle}
            className="text-brand-rose text-sm mt-2 hover:underline"
          >
            {isExpanded ? "Show Less" : "Read More"}
          </button>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-brand-rose/10">
        <button
          onClick={handleHelpful}
          disabled={hasVoted}
          className={cn(
            "flex items-center gap-2 text-sm transition-colors",
            hasVoted ? "text-brand-rose" : "text-brand-ink/50 hover:text-brand-rose"
          )}
        >
          <ThumbsUp className={cn("w-4 h-4", hasVoted && "fill-current")} />
          Helpful ({helpful})
        </button>

        {/* Photo indicator - placeholder for future photo reviews feature */}
        <div className="flex items-center gap-2 text-brand-ink/30 text-sm">
          <ImageIcon className="w-4 h-4" />
          <span className="text-xs">Photo Reviews Coming Soon</span>
        </div>
      </div>
    </motion.div>
  );
}
