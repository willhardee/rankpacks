import { AppShell } from '@/components/app-shell';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const templates = {
  snack: ['Potato chips', 'Chocolate bar', 'Gummy candy'],
  wine: ['Cabernet', 'Pinot Noir', 'Sauvignon Blanc'],
  'fast-food': ['Burger', 'Fries', 'Milkshake']
};

export default function NewPackPage() {
  return (
    <AppShell>
      <h1 className="text-2xl font-semibold">Create Pack</h1>
      <form className="mt-4 space-y-3 rounded-lg border bg-white p-4" action="/api/packs" method="post">
        <label className="block text-sm font-medium">Title<Input name="title" required placeholder="Best late-night snacks" /></label>
        <label className="block text-sm font-medium">Category
          <select name="category" className="mt-1 w-full rounded-md border px-3 py-2 text-sm">
            <option value="snacks">Snacks</option>
            <option value="wine">Wine</option>
            <option value="fast-food">Fast Food</option>
            <option value="coffee">Coffee</option>
            <option value="movies">Movies</option>
            <option value="custom">Custom</option>
          </select>
        </label>
        <label className="block text-sm font-medium">Visibility
          <select name="visibility" className="mt-1 w-full rounded-md border px-3 py-2 text-sm">
            <option value="link-only">Link-only</option>
            <option value="public">Public</option>
          </select>
        </label>
        <p className="text-xs text-gray-500">Template ideas: {Object.entries(templates).map(([key, items]) => `${key}: ${items.join(', ')}`).join(' • ')}</p>
        <Button type="submit">Create pack</Button>
      </form>
    </AppShell>
  );
}
