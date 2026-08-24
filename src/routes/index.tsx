import { createFileRoute } from "@tanstack/react-router";
import { FoodHubView } from "@/components/food/FoodHubView";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LocoMart — Food, Shop, Rides & Parcel Delivered" },
      {
        name: "description",
        content:
          "Order food, shop essentials, book rides and send parcels fast on LocoMart super app.",
      },
      { property: "og:title", content: "LocoMart — Food, Shop, Rides & Parcel" },
      {
        property: "og:description",
        content: "Fresh food, groceries, fashion, electronics, pharmacy, rides & parcel courier in one app.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return <FoodHubView />;
}
