import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export async function GET(_: Request, { params }: { params: Promise<{ packId: string }> }) {
  const { packId } = await params;
  return new ImageResponse(
    (
      <div style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 60,
        background: '#5b21b6',
        color: 'white'
      }}>
        <div style={{ fontSize: 38, fontWeight: 700 }}>RankPacks Results</div>
        <div style={{ fontSize: 24, marginTop: 20 }}>Pack {packId}</div>
        <div style={{ fontSize: 20, marginTop: 30 }}>Top 3: 1) Item A 2) Item B 3) Item C</div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
