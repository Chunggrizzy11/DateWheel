import { useEffect, useRef } from 'react';
import { useProfileStore } from '../../store/profile.store';
import { useCategory } from '../../hooks/useCategory';
import { useHistory } from '../../hooks/useHistory';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import { Hand } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { gsap, useGSAP } from '../../lib/gsap';

export default function Dashboard() {
  const { currentProfile } = useProfileStore();
  const owner = currentProfile?._id;
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { categories, fetchCategories, loading: catLoading } = useCategory(owner);
  const { histories, fetchHistories, loading: histLoading } = useHistory(owner);

  useEffect(() => {
    if (owner) {
      fetchCategories();
      fetchHistories();
    }
  }, [owner, fetchCategories, fetchHistories]);

  // GSAP: stagger in stat cards then charts when data is ready
  useGSAP(
    () => {
      if (catLoading || histLoading) return;
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const tl = gsap.timeline();
      tl.from('[data-gsap="stat"]', {
        autoAlpha: 0,
        y: reduceMotion ? 0 : 24,
        scale: reduceMotion ? 1 : 0.93,
        duration: reduceMotion ? 0 : 0.45,
        stagger: { each: 0.06 },
        ease: 'back.out(1.4)',
        clearProps: 'all',
      }).from(
        '[data-gsap="chart"]',
        {
          autoAlpha: 0,
          y: reduceMotion ? 0 : 30,
          duration: reduceMotion ? 0 : 0.5,
          stagger: { each: 0.1 },
          ease: 'power2.out',
          clearProps: 'all',
        },
        '-=0.2'
      );
    },
    { scope: containerRef, dependencies: [catLoading, histLoading] }
  );

  if (catLoading || histLoading) {
    return <div className="page-container flex justify-center py-20"><Loading size="lg" /></div>;
  }

  const totalSpins = histories.length;
  const lastWinner = histories.length > 0 ? (histories[0].category?.name || 'Unknown') : 'None';

  // Bar Chart Data (Spins per Category)
  const barData = categories.map(cat => {
    const count = histories.filter(h => h.category?._id === cat._id).length;
    return { name: cat.name, count, color: cat.color };
  });

  return (
    <div ref={containerRef} className="page-container space-y-8">
      <h1 className="section-title flex items-center gap-2">
        Hello, {currentProfile?.name}! 
        <Hand className="text-amber-500 mb-1" size={28} />
      </h1>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card data-gsap="stat" className="text-center p-4"><div className="text-3xl font-bold text-brand">{categories.length}</div><div className="text-sm text-body-subtle">Categories</div></Card>
        <Card data-gsap="stat" className="text-center p-4"><div className="text-3xl font-bold text-brand">{totalSpins}</div><div className="text-sm text-body-subtle">Total Spins</div></Card>
        <Card data-gsap="stat" className="text-center p-4"><div className="text-xl font-bold truncate px-2 text-heading">{lastWinner}</div><div className="text-sm text-body-subtle">Last Winner</div></Card>
      </div>

      {/* Charts & Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <Card data-gsap="chart" className="col-span-1">
          <h3 className="font-semibold mb-4 text-center">Spins by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip cursor={{ fill: 'rgba(255, 255, 255, 0.2)' }} />
                <Bar dataKey="count" fill="var(--brand)" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Recent Winners */}
      <Card>
        <h3 className="font-semibold mb-4">Recent Winners</h3>
        {histories.length === 0 ? (
          <p className="text-body-subtle">No spins yet.</p>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {histories.slice(0, 5).map((history) => (
              <div key={history._id} className="flex-shrink-0 w-48 p-4 rounded-base border border-glass-border bg-glass-bg hover:bg-glass-bg-hover transition-colors">
                <div className="w-12 h-12 mb-3 bg-neutral-primary-soft rounded-base shadow-inner flex items-center justify-center overflow-hidden border border-border-default-subtle">
                  <img src={history.category?.icon || `https://ui-avatars.com/api/?name=${encodeURIComponent(history.category?.name || 'U')}&background=random`} alt={history.category?.name || 'Unknown'} className="w-8 h-8 object-contain rounded-lg" onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(history.category?.name || 'U')}&background=random` }} />
                </div>
                <div className="font-semibold truncate text-heading">{history.category?.name || 'Unknown'}</div>
                <div className="text-xs text-body-subtle mt-1">{new Date(history.createdAt).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
