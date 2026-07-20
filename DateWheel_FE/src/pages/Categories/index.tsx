import { useState, useRef, useEffect, useCallback } from 'react';
import { useProfileStore } from '../../store/profile.store';
import { useCategory } from '../../hooks/useCategory';
import { useFolder } from '../../hooks/useFolder';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import Empty from '../../components/common/Empty';
import { Plus, Edit2, Trash2, Bot, Loader2, Sparkles, Folder as FolderIcon, FolderPlus, ChevronDown, ChevronRight, Check, ExternalLink } from 'lucide-react';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import DeleteDialog from '../../components/common/DeleteDialog';
import Pagination from '../../components/common/Pagination';
import { gsap, useGSAP } from '../../lib/gsap';
import { generateCategoryImageUrl } from '../../services/deepseek.service';

export default function Categories() {
  const { currentProfile } = useProfileStore();
  const owner = currentProfile?._id;
  const { categories, fetchCategories, loading: catLoading, createCategory, editCategory, deleteCategory } = useCategory(owner);
  const { folders, fetchFolders, loading: folderLoading, createFolder, editFolder, deleteFolder } = useFolder(owner);
  
  const loading = catLoading || folderLoading;
  const containerRef = useRef<HTMLDivElement>(null);

  // GSAP: stagger in category cards
  useGSAP(
    () => {
      if (loading || categories.length === 0) return;
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      gsap.from('[data-gsap="cat-card"], [data-gsap="folder-card"]', {
        autoAlpha: 0,
        y: reduceMotion ? 0 : 28,
        scale: reduceMotion ? 1 : 0.94,
        duration: reduceMotion ? 0 : 0.45,
        stagger: { each: 0.05 },
        ease: 'back.out(1.5)',
        clearProps: 'all',
      });
    },
    { scope: containerRef, dependencies: [loading, categories.length, folders.length] }
  );

  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [deleteCatId, setDeleteCatId] = useState<string | null>(null);
  const [catFormData, setCatFormData] = useState({ name: '', icon: '', color: '#7c3aed', purchaseUrl: '' });

  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState<any>(null);
  const [deleteFolderId, setDeleteFolderId] = useState<string | null>(null);
  const [folderFormData, setFolderFormData] = useState({ name: '' });

  const [isAddToFolderModalOpen, setIsAddToFolderModalOpen] = useState(false);
  const [targetCategory, setTargetCategory] = useState<any>(null);

  const [isAddCatToFolderModalOpen, setIsAddCatToFolderModalOpen] = useState(false);
  const [targetFolder, setTargetFolder] = useState<any>(null);
  const [targetFolderForNewCategory, setTargetFolderForNewCategory] = useState<string | null>(null);

  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});

  const [aiLoading, setAiLoading] = useState(false);

  const [catPage, setCatPage] = useState(1);
  const [folderPage, setFolderPage] = useState(1);
  const itemsPerPage = 10;

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const userSetIconRef = useRef(false);

  useEffect(() => {
    if (owner) {
      fetchCategories();
      fetchFolders();
    }
  }, [owner, fetchCategories, fetchFolders]);

  const toggleFolder = (id: string) => {
    setExpandedFolders(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // ---- Category Handlers ----
  const handleCatNameChange = useCallback((newName: string) => {
    setCatFormData((prev) => ({ ...prev, name: newName }));

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    if (!newName.trim() || userSetIconRef.current) return;

    debounceTimerRef.current = setTimeout(async () => {
      setAiLoading(true);
      try {
        const imageUrl = await generateCategoryImageUrl(newName.trim());
        if (imageUrl) {
          setCatFormData((prev) => {
            if (!prev.icon || !userSetIconRef.current) {
              return { ...prev, icon: imageUrl };
            }
            return prev;
          });
        }
      } finally {
        setAiLoading(false);
      }
    }, 1500);
  }, []);

  const handleIconChange = (newIcon: string) => {
    userSetIconRef.current = newIcon.length > 0;
    setCatFormData((prev) => ({ ...prev, icon: newIcon }));
  };

  const handleGenerateAI = async () => {
    if (!catFormData.name.trim()) return;
    setAiLoading(true);
    try {
      const imageUrl = await generateCategoryImageUrl(catFormData.name.trim());
      if (imageUrl) {
        setCatFormData((prev) => ({ ...prev, icon: imageUrl }));
        userSetIconRef.current = true;
      }
    } finally {
      setAiLoading(false);
    }
  };

  const handleOpenCatModal = (cat?: any, folderId?: string) => {
    userSetIconRef.current = false;
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    setTargetFolderForNewCategory(folderId || null);

    if (cat) {
      setEditingCategory(cat);
      setCatFormData({ name: cat.name, icon: cat.icon, color: cat.color, purchaseUrl: cat.purchaseUrl || '' });
      userSetIconRef.current = true;
    } else {
      setEditingCategory(null);
      setCatFormData({ name: '', icon: '', color: '#e11d48', purchaseUrl: '' });
    }
    setIsCatModalOpen(true);
  };

  const handleCatSubmit = async () => {
    if (!catFormData.name || !catFormData.icon) return;
    if (editingCategory) {
      await editCategory(editingCategory._id, catFormData);
    } else {
      const newCat = await createCategory({ ...catFormData, owner: owner! });
      if (newCat && targetFolderForNewCategory) {
        const folder = folders.find(f => f._id === targetFolderForNewCategory);
        if (folder) {
          const newCategories = [...(folder.categories.map((c: any) => c._id || c)), newCat._id];
          await editFolder(folder._id, { categories: newCategories });
        }
      }
    }
    setIsCatModalOpen(false);
    setTargetFolderForNewCategory(null);
  };

  // ---- Folder Handlers ----
  const handleOpenFolderModal = (folder?: any) => {
    if (folder) {
      setEditingFolder(folder);
      setFolderFormData({ name: folder.name });
    } else {
      setEditingFolder(null);
      setFolderFormData({ name: '' });
    }
    setIsFolderModalOpen(true);
  };

  const handleFolderSubmit = async () => {
    if (!folderFormData.name) return;
    if (editingFolder) {
      await editFolder(editingFolder._id, { name: folderFormData.name });
    } else {
      await createFolder({ name: folderFormData.name, owner: owner! });
    }
    setIsFolderModalOpen(false);
  };

  const toggleCategoryInFolder = async (folderId: string) => {
    const folder = folders.find(f => f._id === folderId);
    if (!folder || !targetCategory) return;
    
    // Check if category is already in folder
    const categoriesList = folder.categories.map((c: any) => c._id || c);
    const isIncluded = categoriesList.includes(targetCategory._id);
    
    let newCategories = [];
    if (isIncluded) {
      newCategories = categoriesList.filter((id: string) => id !== targetCategory._id);
    } else {
      newCategories = [...categoriesList, targetCategory._id];
    }
    
    await editFolder(folderId, { categories: newCategories });
  };

  const toggleCategoryForTargetFolder = async (categoryId: string) => {
    if (!targetFolder) return;
    
    const categoriesList = targetFolder.categories.map((c: any) => c._id || c);
    const isIncluded = categoriesList.includes(categoryId);
    
    let newCategories = [];
    if (isIncluded) {
      newCategories = categoriesList.filter((id: string) => id !== categoryId);
    } else {
      newCategories = [...categoriesList, categoryId];
    }
    
    // Update local state for immediate feedback
    setTargetFolder({ ...targetFolder, categories: newCategories });
    await editFolder(targetFolder._id, { categories: newCategories });
  };

  const renderCategoryCard = (cat: any, onRemoveFromFolder?: () => void) => (
    <Card key={cat._id} hover data-gsap="cat-card" className="">
      <div className="flex items-start justify-between mb-4">
        <div className="w-16 h-16 rounded-[1rem] flex items-center justify-center text-2xl border-[3px] border-white/50 bg-white shadow-inner overflow-hidden">
          <img src={cat.icon || `https://ui-avatars.com/api/?name=${encodeURIComponent(cat.name)}&background=random`} alt={cat.name} className="w-10 h-10 object-contain" onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(cat.name)}&background=random` }} />
        </div>
        <div className="flex gap-1">
          {onRemoveFromFolder ? (
            <button onClick={onRemoveFromFolder} className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors" title="Remove from folder">
              <Trash2 size={16} />
            </button>
          ) : (
            <>
              <button onClick={() => {
                setTargetCategory(cat);
                setIsAddToFolderModalOpen(true);
              }} className="p-1.5 text-muted-foreground hover:text-blue-500 transition-colors" title="Add to folder">
                <FolderPlus size={16} />
              </button>
              <button onClick={() => handleOpenCatModal(cat)} className="p-1.5 text-muted-foreground hover:text-primary transition-colors">
                <Edit2 size={16} />
              </button>
              <button onClick={() => setDeleteCatId(cat._id)} className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors">
                <Trash2 size={16} />
              </button>
            </>
          )}
        </div>
      </div>
      <h3 className="text-lg font-bold">{cat.name}</h3>
      {cat.purchaseUrl && (
        <a
          href={cat.purchaseUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 dark:text-blue-400 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 rounded-lg transition-colors"
        >
          <ExternalLink size={12} />
          Mua hàng
        </a>
      )}
    </Card>
  );

  const totalFolderPages = Math.ceil(folders.length / itemsPerPage);
  const currentFolders = folders.slice((folderPage - 1) * itemsPerPage, folderPage * itemsPerPage);

  const totalCatPages = Math.ceil(categories.length / itemsPerPage);
  const currentCategories = categories.slice((catPage - 1) * itemsPerPage, catPage * itemsPerPage);

  return (
    <div ref={containerRef} className="page-container">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <h1 className="section-title mb-0">Categories</h1>
        <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
          <Button variant="outline" onClick={() => handleOpenFolderModal()} className="gap-2 flex-1 sm:flex-none text-sm sm:text-base"><FolderPlus size={18} /> New Folder</Button>
          <Button onClick={() => handleOpenCatModal()} className="gap-2 flex-1 sm:flex-none text-sm sm:text-base"><Plus size={18} /> New Category</Button>
        </div>
      </div>

      {loading ? (
        <div className="py-20"><Loading /></div>
      ) : (
        <div className="space-y-10">
          
          {/* FOLDERS SECTION */}
          {folders.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4 text-muted-foreground font-medium">
                <FolderIcon size={18} />
                <h2>Thư mục ({folders.length})</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {currentFolders.map(folder => (
                  <div key={folder._id} data-gsap="folder-card" className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                    <div 
                      className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => toggleFolder(folder._id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 text-primary rounded-xl">
                          <FolderIcon size={20} />
                        </div>
                        <div>
                          <h3 className="font-semibold">{folder.name}</h3>
                          <p className="text-xs text-muted-foreground">{folder.categories?.length || 0} items</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <button onClick={(e) => { e.stopPropagation(); handleOpenCatModal(undefined, folder._id); }} className="p-1.5 text-muted-foreground hover:text-blue-500 transition-colors" title="Tạo Category mới vào Thư mục này">
                          <Plus size={16} />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handleOpenFolderModal(folder); }} className="p-1.5 text-muted-foreground hover:text-primary transition-colors" title="Sửa Thư mục">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); setDeleteFolderId(folder._id); }} className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors" title="Xóa Thư mục">
                          <Trash2 size={16} />
                        </button>
                        <div className="ml-1 sm:ml-2 text-muted-foreground">
                          {expandedFolders[folder._id] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                        </div>
                      </div>
                    </div>
                    
                    {expandedFolders[folder._id] && (
                      <div className="p-4 pt-0 border-t border-border/50 bg-muted/20">
                        {folder.categories?.length === 0 ? (
                          <div className="text-center py-6 text-sm text-muted-foreground">Thư mục trống</div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                            {folder.categories.map((catAny: any) => {
                              // Backend populates categories, we find the full object
                              const catId = typeof catAny === 'string' ? catAny : catAny._id;
                              const fullCat = categories.find(c => c._id === catId);
                              if (!fullCat) return null;
                              
                              return renderCategoryCard(fullCat, async () => {
                                const newCats = folder.categories.map((c:any) => c._id || c).filter((id:string) => id !== fullCat._id);
                                await editFolder(folder._id, { categories: newCats });
                              });
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="mb-8">
                <Pagination currentPage={folderPage} totalPages={totalFolderPages} onPageChange={setFolderPage} />
              </div>
            </div>
          )}

          {/* ALL CATEGORIES SECTION */}
          <div>
            <div className="flex items-center gap-2 mb-4 text-muted-foreground font-medium">
              <h2>Tất cả Categories ({categories.length})</h2>
            </div>
            {categories.length === 0 ? (
              <Empty title="No Categories" description="Create a category to get started." />
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                  {currentCategories.map(cat => renderCategoryCard(cat))}
                </div>
                <Pagination currentPage={catPage} totalPages={totalCatPages} onPageChange={setCatPage} />
              </>
            )}
          </div>
        </div>
      )}

      {/* Category Modal */}
      <Modal open={isCatModalOpen} onClose={() => { setIsCatModalOpen(false); setTargetFolderForNewCategory(null); }} size="sm" title={editingCategory ? 'Edit Category' : 'New Category'}>
        <div className="space-y-4">
          <Input label="Name" value={catFormData.name} onChange={(e) => handleCatNameChange(e.target.value)} placeholder="e.g. Cafe, Xem phim..." />

          {/* Image URL with AI status indicator */}
          <div className="space-y-1.5">
            <Input
              label="Image URL"
              value={catFormData.icon}
              onChange={(e) => handleIconChange(e.target.value)}
              placeholder="https://..."
            />
            {aiLoading && (
              <div className="flex items-center gap-2 text-xs text-blue-500 animate-pulse">
                <Loader2 size={12} className="animate-spin" />
                <span>🤖 AI đang tìm ảnh phù hợp...</span>
              </div>
            )}
            {!aiLoading && catFormData.icon && !editingCategory && (
              <div className="flex items-center gap-2 text-xs text-green-500">
                <Bot size={12} />
                <span>✅ AI đã tự động điền ảnh</span>
              </div>
            )}
          </div>

          {/* Purchase URL */}
          <Input
            label="Link mua hàng"
            value={catFormData.purchaseUrl}
            onChange={(e) => setCatFormData((prev) => ({ ...prev, purchaseUrl: e.target.value }))}
            placeholder="https://shopee.vn/..."
          />

          {/* Image preview */}
          {catFormData.icon && (
            <div className="flex justify-center p-4 bg-muted/50 rounded-xl border border-border">
              <img
                src={catFormData.icon}
                alt="Preview"
                className="w-24 h-24 object-contain rounded-lg"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
          )}

          <div className="pt-4 flex justify-end gap-3">
            <Button variant="ghost" onClick={() => { setIsCatModalOpen(false); setTargetFolderForNewCategory(null); }}>Cancel</Button>
            <Button variant="outline" onClick={handleGenerateAI} disabled={aiLoading || !catFormData.name.trim()} className="gap-2 border-primary text-primary hover:bg-primary/10">
              <Sparkles size={16} /> Lấy ảnh AI
            </Button>
            <Button onClick={handleCatSubmit} disabled={aiLoading || !catFormData.icon}>Save</Button>
          </div>
        </div>
      </Modal>

      {/* Folder Modal */}
      <Modal open={isFolderModalOpen} onClose={() => setIsFolderModalOpen(false)} size="sm" title={editingFolder ? 'Edit Folder' : 'New Folder'}>
        <div className="space-y-4">
          <Input label="Name" value={folderFormData.name} onChange={(e) => setFolderFormData({ name: e.target.value })} placeholder="e.g. Đồ ăn, Địa điểm..." />
          <div className="pt-4 flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setIsFolderModalOpen(false)}>Cancel</Button>
            <Button onClick={handleFolderSubmit} disabled={!folderFormData.name.trim()}>Save</Button>
          </div>
        </div>
      </Modal>

      {/* Add Category to Folder Modal */}
      <Modal open={isAddToFolderModalOpen} onClose={() => setIsAddToFolderModalOpen(false)} size="sm" title="Thêm vào Thư mục">
        <div className="space-y-2 mb-6">
          <p className="text-sm text-muted-foreground mb-4">Chọn các thư mục chứa mục <strong>{targetCategory?.name}</strong>:</p>
          {folders.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-4 bg-muted/30 rounded-lg">Bạn chưa có thư mục nào.</div>
          ) : (
            folders.map(folder => {
              const isIncluded = folder.categories?.some((c: any) => (c._id || c) === targetCategory?._id);
              return (
                <div 
                  key={folder._id} 
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${isIncluded ? 'bg-primary/10 border-primary/30' : 'bg-card border-border hover:bg-muted/50'}`}
                  onClick={() => toggleCategoryInFolder(folder._id)}
                >
                  <div className="flex items-center gap-3">
                    <FolderIcon size={18} className={isIncluded ? 'text-primary' : 'text-muted-foreground'} />
                    <span className="font-medium">{folder.name}</span>
                  </div>
                  {isIncluded && <Check size={18} className="text-primary" />}
                </div>
              );
            })
          )}
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" onClick={() => setIsAddToFolderModalOpen(false)}>Xong</Button>
        </div>
      </Modal>

      {/* Add Categories to Target Folder Modal */}
      <Modal open={isAddCatToFolderModalOpen} onClose={() => setIsAddCatToFolderModalOpen(false)} size="md" title={`Thêm vào ${targetFolder?.name}`}>
        <div className="space-y-2 mb-6 max-h-[60vh] overflow-y-auto pr-2">
          <p className="text-sm text-muted-foreground mb-4">Chọn các category để thêm vào thư mục <strong>{targetFolder?.name}</strong>:</p>
          {categories.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-4 bg-muted/30 rounded-lg">Bạn chưa có category nào.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categories.map(cat => {
                const isIncluded = targetFolder?.categories?.some((c: any) => (c._id || c) === cat._id);
                return (
                  <div 
                    key={cat._id} 
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${isIncluded ? 'bg-primary/10 border-primary/30' : 'bg-card border-border hover:bg-muted/50'}`}
                    onClick={() => toggleCategoryForTargetFolder(cat._id)}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <img src={cat.icon || `https://ui-avatars.com/api/?name=${encodeURIComponent(cat.name)}&background=random`} alt={cat.name} className="w-8 h-8 object-contain rounded shadow-sm border border-border" onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(cat.name)}&background=random` }} />
                      <span className="font-medium truncate">{cat.name}</span>
                    </div>
                    {isIncluded && <Check size={18} className="text-primary flex-shrink-0" />}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button variant="ghost" onClick={() => setIsAddCatToFolderModalOpen(false)}>Xong</Button>
        </div>
      </Modal>

      {/* Delete Dialogs */}
      <DeleteDialog open={!!deleteCatId} onClose={() => setDeleteCatId(null)} onConfirm={async () => {
        if (deleteCatId) {
          await deleteCategory(deleteCatId);
          setDeleteCatId(null);
        }
      }} />
      
      <DeleteDialog open={!!deleteFolderId} onClose={() => setDeleteFolderId(null)} onConfirm={async () => {
        if (deleteFolderId) {
          await deleteFolder(deleteFolderId);
          setDeleteFolderId(null);
        }
      }} />
    </div>
  );
}
