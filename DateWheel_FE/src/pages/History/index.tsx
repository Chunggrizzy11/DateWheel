import { useEffect, useState } from 'react';
import { useProfileStore } from '../../store/profile.store';
import { useHistory } from '../../hooks/useHistory';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import Empty from '../../components/common/Empty';
import Search from '../../components/common/Search';
import { Trash2 } from 'lucide-react';
import DeleteDialog from '../../components/common/DeleteDialog';
import { gsap, useGSAP } from '../../lib/gsap';
import { useRef } from 'react';

export default function History() {
  const { currentProfile } = useProfileStore();
  const owner = currentProfile?._id;
  const { histories, fetchHistories, loading, deleteHistory } = useHistory(owner);

  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => { if (owner) fetchHistories(); }, [owner, fetchHistories]);

  const containerRef = useRef<HTMLDivElement>(null);
  const filtered = histories.filter(h => (h.category?.name || '').toLowerCase().includes(search.toLowerCase()));

  // GSAP: stagger in table rows
  useGSAP(
    () => {
      if (loading || filtered.length === 0) return;
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      gsap.from('[data-gsap="history-row"]', {
        autoAlpha: 0,
        x: reduceMotion ? 0 : -20,
        duration: reduceMotion ? 0 : 0.4,
        stagger: { each: 0.05 },
        ease: 'power2.out',
        clearProps: 'all',
      });
    },
    { scope: containerRef, dependencies: [loading, filtered.length] }
  );

  return (
    <div ref={containerRef} className="page-container">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="section-title mb-0">Spin History</h1>
        <Search value={search} onChange={setSearch} placeholder="Search winner..." className="w-full md:w-64" />
      </div>

      {loading ? <div className="py-20"><Loading /></div> : filtered.length === 0 ? <Empty title="No history found" description="Go spin the wheel to create some history!" /> : (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-primary-soft border-b border-border-default">
                  <th className="p-4 font-medium text-sm text-heading">Date</th>
                  <th className="p-4 font-medium text-sm text-heading">Winner</th>
                  <th className="p-4 font-medium text-sm text-heading">Mode</th>
                  <th className="p-4 font-medium text-sm text-heading text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(history => {
                  return (
                    <tr key={history._id} data-gsap="history-row" className="border-b border-border-default last:border-0 hover:bg-glass-bg-hover transition-colors">
                      <td className="p-4 text-sm text-body-subtle whitespace-nowrap">{new Date(history.createdAt).toLocaleString()}</td>
                      <td className="p-4 font-semibold flex items-center gap-3 text-heading">
                        <img src={history.category?.icon || `https://ui-avatars.com/api/?name=${encodeURIComponent(history.category?.name || 'U')}&background=random`} alt={history.category?.name || 'Unknown'} className="w-8 h-8 object-contain drop-shadow-sm rounded-md" onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(history.category?.name || 'U')}&background=random` }} />
                        {history.category?.name || 'Unknown'}
                      </td>
                      <td className="p-4 text-sm"><span className="px-2 py-1 bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300 rounded text-xs capitalize">{history.mode.replace('_', ' ')}</span></td>
                      <td className="p-4 text-right">
                        <button onClick={() => setDeleteId(history._id)} className="text-body-subtle hover:text-danger p-2"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <DeleteDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={async () => {
        if (deleteId) {
          await deleteHistory(deleteId);
          setDeleteId(null);
        }
      }} />
    </div>
  );
}
