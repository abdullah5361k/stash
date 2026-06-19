import { FormEvent, useState } from "react";
import { Mail } from "lucide-react";

type AuthGateProps = {
  error: string | null;
  onSignIn: (email: string) => Promise<void>;
};

export function AuthGate({ error, onSignIn }: AuthGateProps) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [isSending, setIsSending] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!email.trim() || isSending) {
      return;
    }

    setIsSending(true);
    try {
      await onSignIn(email.trim());
      setSent(true);
    } catch {
      setSent(false);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f5ef] px-4 py-8 text-stone-950 dark:bg-[#181714] dark:text-stone-50">
      <section className="w-full max-w-md rounded-lg border border-stone-200 bg-white p-6 shadow-soft dark:border-stone-800 dark:bg-stone-900">
        <div className="mb-6">
          <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-200">
            <Mail className="h-5 w-5" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-semibold text-stone-950 dark:text-stone-50">
            Sign in to Stash
          </h1>
          <p className="mt-2 text-sm leading-6 text-stone-500 dark:text-stone-400">
            Enter your email and Supabase will send a private magic link.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="space-y-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">
              Email
            </span>
            <input
              type="email"
              autoComplete="email"
              className="h-11 w-full rounded-md border border-stone-200 bg-white px-3 text-sm text-stone-950 shadow-sm transition focus:border-blue-500 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-50"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>

          <button
            type="submit"
            className="inline-flex h-10 w-full items-center justify-center rounded-md bg-stone-950 px-4 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-stone-50 dark:text-stone-950 dark:hover:bg-stone-200"
            disabled={!email.trim() || isSending}
          >
            {isSending ? "Sending..." : "Send magic link"}
          </button>
        </form>

        {sent ? (
          <div className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200">
            Check your email for the sign-in link.
          </div>
        ) : null}

        {error ? (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
            {error}
          </div>
        ) : null}
      </section>
    </main>
  );
}
