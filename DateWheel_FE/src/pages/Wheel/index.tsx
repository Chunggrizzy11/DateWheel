import { useEffect, useState, useMemo, useRef } from 'react';
import { useProfileStore } from '../../store/profile.store';
import { useCategory } from '../../hooks/useCategory';
import { useFolder } from '../../hooks/useFolder';
import { useWheel } from '../../hooks/useWheel';
import { useHistoryStore } from '../../store/history.store';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import Search from '../../components/common/Search';
import Select from '../../components/common/Select';
import WheelCanvas from '../../components/wheel/WheelCanvas';
import WinnerDialog from '../../components/wheel/WinnerDialog';
import { CheckSquare, Square, Settings2, Folder as FolderIcon } from 'lucide-react';
import { gsap, useGSAP } from '../../lib/gsap';
import { Category } from '../../types/category';

export default function Wheel() {
  const { currentProfile } = useProfileStore();
  const owner = currentProfile?._id;
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { categories, fetchCategories, loading: catLoading } = useCategory(owner);
  const { folders, fetchFolders, loading: folderLoading } = useFolder(owner);
  const { addHistory } = useHistoryStore();
  
  const { 
    selectedCategories, toggleCategory, mode, setMode, 
    isSpinning, setSpinning, winner, setWinner, 
    spin, excludedCategories, addExcluded, setSelectedCategories 
  } = useWheel();

  const [keyword, setKeyword] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState('');
  const [showWinner, setShowWinner] = useState(false);
  const [winnerIndex, setWinnerIndex] = useState(0);
  const [activeCategories, setActiveCategories] = useState<any[]>([]);

  const loading = catLoading || folderLoading;

  useEffect(() => { 
    if (owner) {
      fetchCategories();
      fetchFolders();
    }
    // Reset spinning state on mount in case user navigated away during a spin
    setSpinning(false);
  }, [owner, fetchCategories, fetchFolders, setSpinning]);

  // Initial selection
  useEffect(() => {
    if (categories.length > 0 && selectedCategories.length === 0) {
      setSelectedCategories(categories.slice(0, 8));
    }
  }, [categories.length]); // eslint-disable-line react-hooks/exhaustive-deps

  // Update active categories for wheel (excluding used ones)
  useEffect(() => {
    setActiveCategories(selectedCategories.filter(c => !excludedCategories.includes(c._id)));
  }, [selectedCategories, excludedCategories]);

  const filteredCategories = useMemo(() => {
    let list = categories;
    
    // If a folder is selected, only show categories in that folder
    if (selectedFolderId) {
      const folder = folders.find(f => f._id === selectedFolderId);
      if (folder) {
        const folderCatIds = folder.categories.map((c: any) => typeof c === 'string' ? c : c._id);
        list = list.filter(c => folderCatIds.includes(c._id));
      }
    }
    
    if (keyword) {
      list = list.filter(c => c.name.toLowerCase().includes(keyword.toLowerCase()));
    }
    return list;
  }, [categories, keyword, selectedFolderId, folders]);

  const handleFolderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const folderId = e.target.value;
    setSelectedFolderId(folderId);
    
    if (!folderId) {
      // Manual mode selected
      return;
    }
    
    const folder = folders.find(f => f._id === folderId);
    if (folder) {
      const folderCats = folder.categories.map((c: any) => {
        const id = typeof c === 'string' ? c : c._id;
        return categories.find(cat => cat._id === id);
      }).filter(Boolean) as Category[];
      
      setSelectedCategories(folderCats);
    }
  };

  const handleSpinClick = async () => {
    if (activeCategories.length < 2) return;
    
    // Call API to get winner
    const result = await spin(owner!);
    if (result) {
      // Find winner index in active categories for canvas animation
      const idx = activeCategories.findIndex(c => c._id === result.winner._id);
      setWinnerIndex(idx !== -1 ? idx : 0);
      setWinner(result.winner);
      
      // Save to local history store so dashboard updates
      addHistory({
        _id: result.historyId,
        category: result.winner,
        mode: result.mode,
        owner: owner!,
        candidates: result.candidates,
        createdAt: new Date().toISOString()
      });
    }
  };

  const handleSpinEnd = (wonCategory: any) => {
    setSpinning(false);
    setShowWinner(true);
    if (mode === 'no_repeat') {
      addExcluded(wonCategory._id);
    }
  };

  // GSAP: sidebar from left, canvas from center on mount
  useGSAP(
    () => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const tl = gsap.timeline();
      tl.from('[data-gsap="wheel-sidebar"]', {
        autoAlpha: 0,
        x: reduceMotion ? 0 : -50,
        duration: reduceMotion ? 0 : 0.5,
        ease: 'power3.out',
        clearProps: 'all',
      }).from(
        '[data-gsap="wheel-canvas"]',
        {
          autoAlpha: 0,
          scale: reduceMotion ? 1 : 0.85,
          duration: reduceMotion ? 0 : 0.6,
          ease: 'back.out(1.2)',
          clearProps: 'all',
        },
        '-=0.3'
      );
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="page-container max-w-6xl">
      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-8">
        
        {/* Left: Filters & Selection (4 cols) */}
        <div data-gsap="wheel-sidebar" className="lg:col-span-4 flex flex-col order-2 lg:order-1 max-h-[50vh] lg:max-h-none lg:h-[calc(100vh-8rem)]">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Settings2 size={20} /> Configure Wheel</h2>
          
          <Card className="mb-4 p-4 space-y-3 shrink-0">
            <div className="flex items-center gap-2 mb-2 text-sm font-medium text-body-subtle">
              <FolderIcon size={16} /> Load from Folder
            </div>
            <Select 
              value={selectedFolderId}
              onChange={handleFolderChange}
              options={folders.map(f => ({ label: f.name, value: f._id }))}
              placeholder="-- Manual Selection --"
            />
            <div className="pt-2 border-t border-glass-border mt-3">
              <Search value={keyword} onChange={setKeyword} placeholder="Filter categories..." />
            </div>
          </Card>

          <Card className="flex-1 overflow-hidden p-0 flex flex-col min-h-0">
            <div className="p-3 border-b border-glass-border bg-glass-bg flex justify-between items-center text-sm font-medium">
              <span className="text-body">{selectedCategories.length} selected</span>
              <button onClick={() => setSelectedCategories([])} className="text-danger hover:underline">Clear all</button>
            </div>
            
            <div className="overflow-y-auto flex-1 p-2">
              {loading ? <Loading className="py-10" /> : filteredCategories.length === 0 ? <p className="text-center py-4 text-body-subtle">No categories found.</p> : (
                filteredCategories.map(cat => {
                  const isSelected = selectedCategories.some(c => c._id === cat._id);
                  const isExcluded = excludedCategories.includes(cat._id);
                  return (
                    <div 
                      key={cat._id} 
                      onClick={() => !isSpinning && toggleCategory(cat)}
                      className={`flex items-center gap-3 p-2 rounded-base cursor-pointer transition-colors ${isSelected ? 'bg-glass-bg-hover shadow-glint' : 'hover:bg-glass-bg-hover'} ${isExcluded ? 'opacity-50 line-through' : ''} ${isSpinning ? 'pointer-events-none' : ''}`}
                    >
                      {isSelected ? <CheckSquare size={18} className="text-brand flex-shrink-0" /> : <Square size={18} className="text-body-subtle flex-shrink-0" />}
                      <div className="w-8 h-8 rounded-lg border-2 border-white/50 bg-white shadow-inner flex items-center justify-center overflow-hidden flex-shrink-0" style={{ borderColor: cat.color }}>
                        <img loading="lazy" src={cat.icon || `https://ui-avatars.com/api/?name=${encodeURIComponent(cat.name)}&background=random`} alt={cat.name} className="w-6 h-6 object-contain rounded-md" onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(cat.name)}&background=random` }} />
                      </div>
                      <span className="font-semibold text-foreground truncate flex-1">{cat.name}</span>
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        </div>

        {/* Right: Wheel Canvas & Controls (8 cols) */}
        <div data-gsap="wheel-canvas" className="lg:col-span-8 flex flex-col items-center justify-center order-1 lg:order-2">
          
          <div className="w-full mb-8">
            <WheelCanvas 
              categories={activeCategories} 
              isSpinning={isSpinning} 
              onSpinEnd={handleSpinEnd} 
              winnerIndex={winnerIndex} 
              onSpinClick={handleSpinClick}
            />
          </div>
          
          <div className="flex flex-col items-center w-full max-w-xs sm:max-w-sm gap-3 sm:gap-4 px-2">
            <div className="flex bg-neutral-primary-soft border border-glass-border p-1 rounded-base w-full">
              {(['random', 'weighted', 'no_repeat'] as const).map((m) => (
                <button
                  key={m}
                  disabled={isSpinning}
                  onClick={() => setMode(m)}
                  className={`flex-1 py-2 text-sm font-medium capitalize rounded-base transition-colors ${mode === m ? 'bg-glass-bg shadow-glass text-brand' : 'text-body-subtle hover:text-heading'}`}
                >
                  {m.replace('_', ' ')}
                </button>
              ))}
            </div>
            
            <Button

              size="lg" 
              className="w-full text-xl py-6 rounded-2xl shadow-xl shadow-primary/30" 
              onClick={handleSpinClick}
              disabled={isSpinning || activeCategories.length < 2}
              loading={isSpinning}
            >
              SPIN THE WHEEL
            </Button>
            
            {activeCategories.length < 2 && (
              <p className="text-danger text-sm font-medium">Please select at least 2 active categories.</p>
            )}
          </div>

        </div>
      </div>

      <WinnerDialog 
        open={showWinner} 
        onClose={() => setShowWinner(false)} 
        winner={winner} 
        onDelete={() => {
          if (winner) addExcluded(winner._id);
        }}
      />
    </div>
  );
}
