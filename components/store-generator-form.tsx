'use client';

import { type FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { WandSparkles } from 'lucide-react';

const presets = [
  'Create a clothing store for Kathmandu',
  'Create a sneaker store for Nepal',
  'Create an organic grocery store for Pokhara',
];

export function StoreGeneratorForm() {
  const [prompt, setPrompt] = useState(presets[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      setError('Unable to generate your Nepal-ready store right now.');
      setIsLoading(false);
      return;
    }

    const payload = await response.json();
    const encodedPrompt = encodeURIComponent(prompt);
    router.push(`/stores/${payload.store.slug}?prompt=${encodedPrompt}`);
  };

  return (
    <form className="card space-y-4 p-6" onSubmit={onSubmit}>
      <div className="flex items-center gap-3 text-orange-300">
        <WandSparkles className="h-5 w-5" />
        <span className="text-sm font-semibold uppercase tracking-[0.2em]">AI Store Builder</span>
      </div>
      <div className="space-y-2">
        <label className="text-sm text-slate-300" htmlFor="prompt">
          Describe the store you want to launch in Nepal
        </label>
        <textarea
          id="prompt"
          className="min-h-28 w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {presets.map((preset) => (
          <button
            key={preset}
            type="button"
            className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300 transition hover:border-orange-400"
            onClick={() => setPrompt(preset)}
          >
            {preset}
          </button>
        ))}
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-2xl bg-orange-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-orange-400 disabled:opacity-60"
      >
        {isLoading ? 'Generating…' : 'Generate production-ready store'}
      </button>
      {error ? <p className="text-sm text-red-300">{error}</p> : null}
    </form>
  );
}
