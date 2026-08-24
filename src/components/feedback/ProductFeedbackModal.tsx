import { useState } from "react";
import { toast } from "sonner";
import { FiCamera, FiCheck, FiPackage, FiStar, FiTruck, FiX } from "react-icons/fi";
import { cn } from "@/lib/utils";

export interface FeedbackData {
  itemRating: number;
  riderRating: number;
  packagingRating: number;
  tags: string[];
  comment: string;
  photoUrl?: string | undefined;
}

interface ProductFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  productImage?: string | undefined;
  storeName?: string | undefined;
  timeAgo?: string | undefined;
  onSuccess?: ((feedback: FeedbackData) => void) | undefined;
}

const WHAT_STOOD_OUT_TAGS = [
  "Fast",
  "Fresh",
  "Good value",
  "Friendly",
  "Packed well",
  "High Quality",
  "Tasty",
  "Authentic",
];

export function ProductFeedbackModal({
  isOpen,
  onClose,
  productName,
  productImage = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80",
  storeName = "LocoMart Verified Store",
  timeAgo = "Delivered · 20 mins ago",
  onSuccess,
}: ProductFeedbackModalProps) {
  const [itemRating, setItemRating] = useState<number>(0);
  const [riderRating, setRiderRating] = useState<number>(0);
  const [packagingRating, setPackagingRating] = useState<number>(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [photoAdded, setPhotoAdded] = useState(false);

  if (!isOpen) return null;

  function toggleTag(tag: string) {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (itemRating === 0) {
      toast.error("Please provide a rating for the product/item.");
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success("Thank you! Your review and feedback has been submitted. 🎉");
      if (onSuccess) {
        onSuccess({
          itemRating,
          riderRating,
          packagingRating,
          tags: selectedTags,
          comment,
          photoUrl: photoAdded ? productImage : undefined,
        });
      }
      onClose();
    }, 600);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-background border border-border p-4 sm:p-6 shadow-2xl space-y-5 no-scrollbar">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between border-b border-border/50 pb-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <FiX className="size-5" />
          </button>
          <h2 className="text-base font-extrabold text-foreground">Feedback</h2>
          <div className="w-8" />
        </div>

        {/* Product / Order Info Card */}
        <div className="flex items-center gap-3.5 rounded-2xl border border-border/60 bg-card p-3.5 shadow-2xs">
          <img
            src={productImage}
            alt={productName}
            className="size-16 rounded-xl object-cover border border-border shrink-0"
          />
          <div>
            <span className="text-[10px] font-bold text-muted-foreground">{timeAgo}</span>
            <h3 className="text-sm font-black leading-tight text-foreground mt-0.5">
              How was your {productName}?
            </h3>
            <p className="text-[11px] font-semibold text-teal-600 dark:text-teal-400 mt-0.5">
              {storeName}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rate Product / Food */}
          <div className="rounded-2xl border border-border/60 bg-card p-4 text-center space-y-2 shadow-2xs">
            <h4 className="text-xs font-black text-foreground">Rate the Product</h4>
            <StarPicker rating={itemRating} onSelect={setItemRating} />
          </div>

          {/* Rate Rider */}
          <div className="rounded-2xl border border-border/60 bg-card p-4 text-center space-y-2 shadow-2xs">
            <div className="grid size-9 place-items-center rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 mx-auto">
              <FiTruck className="size-4" />
            </div>
            <h4 className="text-xs font-black text-foreground">Rate the Delivery Partner</h4>
            <StarPicker rating={riderRating} onSelect={setRiderRating} />
          </div>

          {/* Rate Packaging */}
          <div className="rounded-2xl border border-border/60 bg-card p-4 text-center space-y-2 shadow-2xs">
            <div className="grid size-9 place-items-center rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 mx-auto">
              <FiPackage className="size-4" />
            </div>
            <h4 className="text-xs font-black text-foreground">Rate the Packaging</h4>
            <StarPicker rating={packagingRating} onSelect={setPackagingRating} />
          </div>

          {/* WHAT STOOD OUT? TAG PILLS */}
          <div className="space-y-2">
            <label className="text-[10px] font-black tracking-wider uppercase text-muted-foreground">
              WHAT STOOD OUT?
            </label>
            <div className="flex flex-wrap gap-2">
              {WHAT_STOOD_OUT_TAGS.map((tag) => {
                const active = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs font-bold transition-all",
                      active
                        ? "border-cyan-500 bg-cyan-500 text-white shadow-2xs"
                        : "border-border bg-card text-muted-foreground hover:border-cyan-500/50 hover:text-foreground"
                    )}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comment Text Area with Photo Upload Icon */}
          <div className="relative">
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us more about your experience..."
              className="w-full rounded-2xl border border-border bg-card p-3.5 pr-12 text-xs outline-none focus:border-cyan-500 transition-colors resize-none"
            />
            <button
              type="button"
              onClick={() => {
                setPhotoAdded(!photoAdded);
                toast.info(photoAdded ? "Photo removed" : "Photo attached to review!");
              }}
              className={cn(
                "absolute right-3 bottom-4 grid size-8 place-items-center rounded-full transition-colors",
                photoAdded ? "bg-cyan-500 text-white" : "bg-muted text-muted-foreground hover:text-foreground"
              )}
              title="Attach Photo"
            >
              {photoAdded ? <FiCheck className="size-4" /> : <FiCamera className="size-4" />}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-2xl bg-cyan-400 dark:bg-cyan-500 py-3.5 text-xs font-black text-slate-950 dark:text-white shadow-md hover:opacity-95 transition-opacity disabled:opacity-60"
          >
            {submitting ? "Submitting Review…" : "Submit Review"}
          </button>
        </form>
      </div>
    </div>
  );
}

// 5-Star Rating Picker Component
function StarPicker({ rating, onSelect }: { rating: number; onSelect: (r: number) => void }) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex justify-center gap-2">
      {[1, 2, 3, 4, 5].map((star) => {
        const active = star <= (hover || rating);
        return (
          <button
            key={star}
            type="button"
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            onClick={() => onSelect(star)}
            className="p-1 transition-transform hover:scale-125 focus:outline-none"
          >
            <FiStar
              className={cn(
                "size-6 transition-colors",
                active ? "fill-amber-400 text-amber-400" : "text-border"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
