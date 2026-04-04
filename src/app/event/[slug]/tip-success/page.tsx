"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { ChevronUp, Loader2 } from "lucide-react";
import { Suspense } from "react";

function TipSuccessContent() {
  const { slug } = useParams<{ slug: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      return;
    }

    fetch(`/api/stripe/verify-session?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.paymentStatus === "paid" || data.status === "complete") {
          setStatus("success");
          setTimeout(() => {
            router.push(`/event/${slug}`);
          }, 2500);
        } else {
          setStatus("error");
        }
      })
      .catch(() => setStatus("error"));
  }, [sessionId, slug, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-dark-bg">
        <Loader2 className="h-8 w-8 animate-spin text-muted" />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-dark-bg px-4">
        <div className="text-center">
          <h2 className="mb-2 text-xl font-bold text-text-white">Something went wrong</h2>
          <p className="text-muted">Your payment may still be processing.</p>
          <button
            onClick={() => router.push(`/event/${slug}`)}
            className="mt-4 text-primary hover:underline"
          >
            Back to event
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-dark-bg px-4">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-success/20">
          <ChevronUp className="h-10 w-10 text-success" />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-text-white">Tip Sent!</h2>
        <p className="text-muted">
          Your song is moving up in the queue
        </p>
      </div>
    </div>
  );
}

export default function TipSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-dark-bg">
          <Loader2 className="h-8 w-8 animate-spin text-muted" />
        </div>
      }
    >
      <TipSuccessContent />
    </Suspense>
  );
}
