'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabaseBrowser } from '@/lib/supabase';

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
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<(typeof templates)[number]['key'] | 'movies' | 'custom'>('snacks');
  const [visibility, setVisibility] = useState<'link-only' | 'public'>('link-only');
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [mood, setMood] = useState<(typeof moods)[number]['id']>('casual');
  const [itemsText, setItemsText] = useState('');
  const [message, setMessage] = useState('');

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
      };
      if (parsed.title) setTitle(parsed.title);
      if (parsed.category) setCategory(parsed.category);
      if (parsed.visibility) setVisibility(parsed.visibility);
      if (parsed.mood) setMood(parsed.mood);
      if (parsed.itemsText) setItemsText(parsed.itemsText);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem('rankpacks.createPackDraft', JSON.stringify({ title, category, visibility, mood, itemsText }));
    } catch {}
  }, [title, category, visibility, mood, itemsText]);

  const selectedTemplate = useMemo(() => templates.find((t) => t.key === category) ?? templates[0], [category]);

  const submit = async () => {
    setMessage('Creating your pack...');
    const supabase = supabaseBrowser();
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) {
      router.push('/login?next=/packs/new');
      return;
    }

    const items = itemsText
      .split('\n')
      .map((entry) => entry.trim())
      .filter(Boolean);

    const res = await fetch('/api/packs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title, category, visibility, items })
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({ error: 'Could not create pack.' }));
      setMessage(body.error ?? 'Could not create pack.');
      return;
    }

    const body = await res.json();
    window.localStorage.removeItem('rankpacks.createPackDraft');
    router.push(`/p/${body.packId}?created=1`);
  };

  return (
    <div className="space-y-4 rounded-xl border border-neutral-200 bg-white p-4 card-pop offset-shadow dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex items-center justify-between text-xs font-semibold text-indigo-700 dark:text-indigo-300">
        <span>Step {step} of 3</span>
      </div>

      {step === 1 && (
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">Pick your vibe</h2>
          <div className="grid grid-cols-2 gap-2">
            {templates.map((template) => (
              <button type="button" key={template.key} onClick={() => { setCategory(template.key); setTitle((current) => current || `${template.label} Rankings`); setItemsText((current) => current || template.suggestions.join('\n')); }} className={`rounded-xl border p-3 text-left transition hover:-translate-y-0.5 ${category === template.key ? 'border-indigo-600 bg-neutral-50 soft-ring dark:bg-neutral-800' : 'border-neutral-300 dark:border-neutral-700'}`}>
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
          <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">Name your pack</h2>
          <label className="block text-sm font-medium">Pack title
            <Input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Best late-night snacks" className="mt-1" />
          </label>
          <p className="rounded-xl bg-neutral-50 p-3 text-xs">Suggested items: {selectedTemplate.suggestions.join(', ')}</p>
          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={() => setStep(1)}>Back</Button>
            <Button type="button" onClick={() => setStep(3)} disabled={!title.trim()}>Continue</Button>
          </div>
        </section>
      )}

      {step === 3 && (
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">Items + sharing</h2>
          <textarea className="min-h-40 w-full rounded border p-2 text-sm" value={itemsText} onChange={(e) => setItemsText(e.target.value)} placeholder="One item per line" />
          <div className="text-xs text-neutral-600">{itemsText.split('\n').map((e) => e.trim()).filter(Boolean).length} items</div>
          <div className="grid gap-2">
            <button type="button" onClick={() => setVisibility('link-only')} className={`rounded-xl border p-3 text-left ${visibility === 'link-only' ? 'border-indigo-600 bg-neutral-50 soft-ring dark:bg-neutral-800' : 'border-neutral-300 dark:border-neutral-700'}`}>Link-only</button>
            <button type="button" onClick={() => setVisibility('public')} className={`rounded-xl border p-3 text-left ${visibility === 'public' ? 'border-indigo-600 bg-neutral-50 soft-ring dark:bg-neutral-800' : 'border-neutral-300 dark:border-neutral-700'}`}>Public</button>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={() => setStep(2)}>Back</Button>
            <Button type="button" onClick={submit}>Create my pack</Button>
          </div>
          {message ? <p className="text-xs text-neutral-600">{message}</p> : null}
        </section>
      )}
    </div>
  );
}
