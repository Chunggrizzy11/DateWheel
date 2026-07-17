import { useState, useCallback } from 'react';
import { categoryApi } from '../api/category.api';
import { useCategoryStore } from '../store/category.store';
import { CreateCategoryDto, UpdateCategoryDto } from '../types/category';
import { toast } from 'sonner';

export function useCategory(owner?: string) {
  const { categories, setCategories, addCategory, updateCategory, removeCategory } =
    useCategoryStore();
  const [loading, setLoading] = useState(false);

  const fetchCategories = useCallback(async () => {
    if (!owner) return;
    setLoading(true);
    try {
      const res = await categoryApi.getAll(owner);
      setCategories(res.data);
    } catch {
      toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  }, [owner]);

  const createCategory = async (data: CreateCategoryDto) => {
    try {
      const res = await categoryApi.create(data);
      addCategory(res.data);
      toast.success('Category created!');
      return res.data;
    } catch {
      toast.error('Failed to create category');
    }
  };

  const editCategory = async (id: string, data: UpdateCategoryDto) => {
    try {
      const res = await categoryApi.update(id, data);
      updateCategory(id, res.data);
      toast.success('Category updated!');
      return res.data;
    } catch {
      toast.error('Failed to update category');
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await categoryApi.delete(id);
      removeCategory(id);
      toast.success('Category deleted!');
    } catch {
      toast.error('Failed to delete category');
    }
  };

  return { categories, loading, fetchCategories, createCategory, editCategory, deleteCategory };
}
