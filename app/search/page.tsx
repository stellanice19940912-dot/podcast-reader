import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchForm, SearchResults } from "@/app/search/SearchResults";
import { BackLink } from "@/components/BackLink";

export const metadata: Metadata = {
  title: "搜索",
  description: "在全部播客文字稿里搜索。",
};

export default function SearchPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-20 pt-10">
      <BackLink fallback="/" />
      <h1 className="mt-3 font-display text-3xl">搜索文字稿</h1>
      <Suspense fallback={<SearchForm query="" />}>
        <SearchResults />
      </Suspense>
    </main>
  );
}
