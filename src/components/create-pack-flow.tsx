'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const templates = [
  { key: 'snacks', label: 'Snack Showdown', suggestions: ['Chips', 'Cookies', 'Pretzels'], energy: 'high' },
  { key: 'wine', label: 'Wine Night', suggestions: ['Cabernet', 'Rose', 'Riesling'], energy: 'chill' },
  { key: 'fast-food', label: 'Fast Food Faceoff', suggestions: ['Burger', 'Fries', 'Shake'], energy: 'chaotic' },
  { key: 'coffee', label: 'Coffee Crawl', suggestions: ['Latte', 'Cold Brew', 'Mocha'], energy: 'focused' },
  { key: 'custom', label: 'Custom Pack', suggestions: ['Item one', 'Item two', 'Item three'], energy: 'flexible' }
] as const;

const moods = [
  { id: 'casual', label: 'Casual' },
  { id: 'competitive', label: 'Competitive' },
  { id: 'chaotic', label: 'Chaotic' }
] as const;

export function CreatePackFlow() {
  const [title, setTitle] = useState('');
  const [creatorName, setCreatorName] = useState('');
  const [category, setCategory] = useState<(typeof templates)[number]['key'] | 'movies'>('snacks');
  const [visibility, setVisibility] = useState<'link-only' | 'public'>('link-only');
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [mood, setMood] = useState<(typeof moods)[number]['id']>('casual');
  const [itemsText, setItemsText] = useState('Chips\nCookies\nPretzels');

  useEffect(() => {
    try {
      const draft = window.localStorage.getItem('rankpacks.createPackDraft');
      if (!draft) return;
      const parsed = JSON.parse(draft) as {
        title?: string;
        category?: typeof category;
        visibility?: typeof visibility;
        mood?: typeof mood;
        itemsText?: string;
        creatorName?: string;
      };
      if (parsed.title) setTitle(parsed.title);
      if (parsed.category) setCategory(parsed.category);
      if (parsed.visibility) setVisibility(parsed.visibility);
      if (parsed.mood) setMood(parsed.mood);
      if (parsed.itemsText) setItemsText(parsed.itemsText);
      if (parsed.creatorName) setCreatorName(parsed.creatorName);
    } catch {
      // ignore malformed draft
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem('rankpacks.createPackDraft', JSON.stringify({ title, category, visibility, mood, itemsText, creatorName }));
    } catch {
      // ignore storage failures
    }
  }, [title, category, visibility, mood, itemsText, creatorName]);

  const selectedTemplate = useMemo(
    () => templates.find((t) => t.key === category) ?? templates[0],
    [category]
  );

  const validItems = itemsText.split('\n').map((item) => item.trim()).filter(Boolean);

  return (
    <form className="space-y-4 rounded-xl border border-neutral-200 bg-white p-4 card-pop offset-shadow dark:border-neutral-800 dark:bg-neutral-900" action="/api/packs" method="post">
      <input type="hidden" name="title" value={title} />
      <input type="hidden" name="category" value={category} />
      <input type="hidden" name="visibility" value={visibility} />
      <input type="hidden" name="itemsText" value={itemsText} />
      <input type="hidden" name="creatorName" value={creatorName} />

      <div className="flex items-center justify-between text-xs font-semibold text-indigo-700 dark:text-indigo-300">
        <span>Step {step} of 3</span>
        <div className="flex gap-1" aria-hidden>
          {[1, 2, 3].map((s) => (
            <span key={s} className={`h-1.5 w-8 rounded-full transition ${step >= s ? 'bg-indigo-600' : 'bg-neutral-200 dark:bg-neutral-700'}`} />
          ))}
        </div>
      </div>

      {step === 1 && (
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">Choose a starting point</h2>
          <div className="grid grid-cols-2 gap-2">
            {templates.map((template) => (
              <button
                type="button"
                key={template.key}
                onClick={() => {
                  setCategory(template.key);
                  setTitle((current) => current || `${template.label} Rankings`);
                  setItemsText(template.suggestions.join('\n'));
                }}
                className={`rounded-xl border p-3 text-left transition hover:-translate-y-0.5 ${category === template.key ? 'border-indigo-600 bg-neutral-50 soft-ring dark:bg-neutral-800' : 'border-neutral-300 dark:border-neutral-700'}`}
              >
                <p className="text-sm font-semibold">{template.label}</p>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">Energy: {template.energy}</p>
              </button>
            ))}
          </div>
          <Button type="button" onClick={() => setStep(2)}>Continue</Button>
        </section>
      )}

      {step === 2 && (
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">Pack details</h2>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Pack title
            <Input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Best late-night snacks" className="mt-1" />
          </label>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Your display name (optional)
            <Input value={creatorName} onChange={(e) => setCreatorName(e.target.value)} placeholder="Alex" className="mt-1" />
          </label>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Items to rank (one per line)
            <textarea value={itemsText} onChange={(e) => setItemsText(e.target.value)} rows={6} className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900" />
          </label>
          <p className="text-xs text-neutral-600 dark:text-neutral-400">{validItems.length} item(s) ready. Minimum 2 required.</p>
          <div className="rounded-xl bg-neutral-50 p-3 dark:bg-neutral-800">
            <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">Room mood</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {moods.map((entry) => (
                <button key={entry.id} type="button" onClick={() => setMood(entry.id)} className={`rounded-full px-3 py-1 text-xs font-semibold transition ${mood === entry.id ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-700 border border-neutral-300 dark:text-indigo-300 dark:border-neutral-600'}`}>
                  {entry.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={() => setStep(1)}>Back</Button>
            <Button type="button" onClick={() => setStep(3)} disabled={!title.trim() || validItems.length < 2}>Continue</Button>
          </div>
        </section>
      )}

      {step === 3 && (
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">Choose sharing mode</h2>
          <div className="grid gap-2">
            <button type="button" onClick={() => setVisibility('link-only')} className={`rounded-xl border p-3 text-left ${visibility === 'link-only' ? 'border-indigo-600 bg-neutral-50 soft-ring dark:bg-neutral-800' : 'border-neutral-300 dark:border-neutral-700'}`}>
              <p className="font-semibold">Link-only</p>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">Only people with your invite link can access.</p>
            </button>
            <button type="button" onClick={() => setVisibility('public')} className={`rounded-xl border p-3 text-left ${visibility === 'public' ? 'border-indigo-600 bg-neutral-50 soft-ring dark:bg-neutral-800' : 'border-neutral-300 dark:border-neutral-700'}`}>
              <p className="font-semibold">Public</p>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">Shows up in Explore and can be shared openly.</p>
            </button>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-sm text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100">
            <p className="font-semibold">Ready to launch</p>
            <p>{title || 'Untitled pack'} • {category} • {visibility}</p>
            <p className="text-xs text-indigo-700">{validItems.length} ranked item(s)</p>
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
