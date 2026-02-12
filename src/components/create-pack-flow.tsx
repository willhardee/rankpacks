'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const templates = [
  { key: 'snacks', label: 'Snack Showdown', suggestions: ['Chips', 'Cookies', 'Pretzels'], energy: 'high' },
  { key: 'wine', label: 'Wine Night', suggestions: ['Cabernet', 'Rose', 'Riesling'], energy: 'chill' },
  { key: 'fast-food', label: 'Fast Food Faceoff', suggestions: ['Burger', 'Fries', 'Shake'], energy: 'chaotic' },
  { key: 'coffee', label: 'Coffee Crawl', suggestions: ['Latte', 'Cold Brew', 'Mocha'], energy: 'focused' }
] as const;

const moods = [
  { id: 'casual', label: 'Casual' },
  { id: 'competitive', label: 'Competitive' },
  { id: 'chaotic', label: 'Chaotic' }
] as const;

export function CreatePackFlow() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<(typeof templates)[number]['key'] | 'movies' | 'custom'>('snacks');
  const [visibility, setVisibility] = useState<'link-only' | 'public'>('link-only');
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [mood, setMood] = useState<(typeof moods)[number]['id']>('casual');

  useEffect(() => {
    try {
      const draft = window.localStorage.getItem('rankpacks.createPackDraft');
      if (!draft) return;
      const parsed = JSON.parse(draft) as {
        title?: string;
        category?: typeof category;
        visibility?: typeof visibility;
        mood?: typeof mood;
      };
      if (parsed.title) setTitle(parsed.title);
      if (parsed.category) setCategory(parsed.category);
      if (parsed.visibility) setVisibility(parsed.visibility);
      if (parsed.mood) setMood(parsed.mood);
    } catch {
      // ignore malformed draft
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem('rankpacks.createPackDraft', JSON.stringify({ title, category, visibility, mood }));
    } catch {
      // ignore storage failures
    }
  }, [title, category, visibility, mood]);

  const selectedTemplate = useMemo(
    () => templates.find((t) => t.key === category) ?? templates[0],
    [category]
  );

  return (
    <form className="space-y-4 rounded-xl border border-neutral-200 bg-white p-4 card-pop" action="/api/packs" method="post">
      <input type="hidden" name="title" value={title} />
      <input type="hidden" name="category" value={category} />
      <input type="hidden" name="visibility" value={visibility} />

      <div className="flex items-center justify-between text-xs font-semibold text-indigo-700">
        <span>Step {step} of 3</span>
        <div className="flex gap-1" aria-hidden>
          {[1, 2, 3].map((s) => (
            <span key={s} className={`h-1.5 w-8 rounded-full transition ${step >= s ? 'bg-indigo-600' : 'bg-neutral-200'}`} />
          ))}
        </div>
      </div>

      {step === 1 && (
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-neutral-900">Pick your vibe</h2>
          <div className="grid grid-cols-2 gap-2">
            {templates.map((template) => (
              <button
                type="button"
                key={template.key}
                onClick={() => {
                  setCategory(template.key);
                  setTitle((current) => current || `${template.label} Rankings`);
                }}
                className={`rounded-xl border p-3 text-left transition hover:-translate-y-0.5 ${category === template.key ? 'border-indigo-600 bg-neutral-50 soft-ring' : 'border-gray-200'}`}
              >
<p className="text-sm font-semibold">{template.label}</p>
                <p className="text-xs text-gray-500">Energy: {template.energy}</p>
              </button>
            ))}
          </div>
          <div className="rounded-xl bg-neutral-50 p-3">
            <p className="text-xs font-semibold text-indigo-700">Choose a room mood</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {moods.map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => setMood(entry.id)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${mood === entry.id ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-700 border border-neutral-300'}`}
                >
                  {entry.label}
                </button>
              ))}
            </div>
          </div>
          <Button type="button" onClick={() => setStep(2)}>Continue</Button>
        </section>
      )}

      {step === 2 && (
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-neutral-900">Name your pack</h2>
          <label className="block text-sm font-medium text-gray-700">
            Pack title
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Best late-night snacks"
              className="mt-1"
            />
          </label>
          <p className="rounded-xl bg-neutral-50 p-3 text-xs text-gray-600">Suggested items: {selectedTemplate.suggestions.join(', ')}</p>
          <div className="rounded-xl border border-neutral-200 bg-white p-3 text-xs text-neutral-900">
            Mood: <span className="font-semibold">{moods.find((entry) => entry.id === mood)?.label}</span>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={() => setStep(1)}>Back</Button>
            <Button type="button" onClick={() => setStep(3)} disabled={!title.trim()}>Continue</Button>
          </div>
        </section>
      )}

      {step === 3 && (
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-neutral-900">Choose sharing mode</h2>
          <div className="grid gap-2">
            <button
              type="button"
              onClick={() => setVisibility('link-only')}
              className={`rounded-xl border p-3 text-left ${visibility === 'link-only' ? 'border-indigo-600 bg-neutral-50 soft-ring' : 'border-gray-200'}`}
            >
              <p className="font-semibold">Link-only</p>
              <p className="text-xs text-gray-600">Only people with your invite link can access.</p>
            </button>
            <button
              type="button"
              onClick={() => setVisibility('public')}
              className={`rounded-xl border p-3 text-left ${visibility === 'public' ? 'border-indigo-600 bg-neutral-50 soft-ring' : 'border-gray-200'}`}
            >
              <p className="font-semibold">Public</p>
              <p className="text-xs text-gray-600">Shows up in Explore and can be shared openly.</p>
            </button>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-sm text-neutral-900">
            <p className="font-semibold">Ready to launch</p>
            <p>{title || 'Untitled pack'} • {category} • {visibility}</p>
            <p className="text-xs text-indigo-700">Mood: {moods.find((entry) => entry.id === mood)?.label}</p>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={() => setStep(2)}>Back</Button>
            <Button type="submit">Create my pack</Button>
          </div>
        </section>
      )}
    </form>
  );
}
