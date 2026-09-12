"use client";

import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();
    if (!name || !email || !message) {
      setError("Please fill in your name, email, and message.");
      return;
    }
    setSent(true);
    e.currentTarget.reset();
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 border border-[var(--brand-forest)]/15 bg-[var(--brand-cream)]/60 p-6"
    >
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" placeholder="Your name" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" placeholder="you@example.com" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          rows={5}
          placeholder="Tell us about your group and preferred dates"
        />
      </div>
      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Missing info</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
      {sent ? (
        <Alert>
          <AlertTitle>Message ready</AlertTitle>
          <AlertDescription>
            Thanks—this demo form confirms locally. For a live conversation,
            call or email the lodge directly.
          </AlertDescription>
        </Alert>
      ) : null}
      <Button
        type="submit"
        className="bg-[var(--brand-forest)] text-[var(--brand-cream)] hover:bg-[var(--brand-forest-deep)]"
      >
        Send message
      </Button>
    </form>
  );
}
