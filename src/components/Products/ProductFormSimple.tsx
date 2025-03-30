import React, { useState, useEffect } from 'react';
import { useProductStore } from '../../store/productStore';
import { useCategoryStore } from '../../store/categoryStore';

const ProductFormSimple = () => {
  const { addProduct } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    purchase_price: '',
    retail_price: '',
    pro_price: '',
    weight: '',
    ean: '',
    description: '',
    stock_alert: '',
    current_stock: '',
    location: '',
    category_type: '',
    category_brand: '',
    category_model: ''
  });

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // validation simple
    if (!formData.name || !formData.sku || !formData.purchase_price) return alert('Champs requis manquants');
    await addProduct(formData);
    alert('Produit ajouté');
    setFormData({
      name: '', sku: '', purchase_price: '', retail_price: '', pro_price: '',
      weight: '', ean: '', description: '', stock_alert: '', current_stock: '',
      location: '', category_type: '', category_brand: '', category_model: ''
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="text" name="name" placeholder="Nom du produit" value={formData.name} onChange={handleChange} />
      <input type="text" name="sku" placeholder="SKU" value={formData.sku} onChange={handleChange} />
      <input type="number" name="purchase_price" placeholder="Prix d'achat" value={formData.purchase_price} onChange={handleChange} />
      <input type="number" name="retail_price" placeholder="Prix vente magasin" value={formData.retail_price} onChange={handleChange} />
      <input type="number" name="pro_price" placeholder="Prix vente pro" value={formData.pro_price} onChange={handleChange} />
      <input type="number" name="weight" placeholder="Poids (g)" value={formData.weight} onChange={handleChange} />
      <input type="text" name="ean" placeholder="Code EAN" value={formData.ean} onChange={handleChange} />
      <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} />
      <input type="number" name="stock_alert" placeholder="Alerte stock" value={formData.stock_alert} onChange={handleChange} />
      <input type="number" name="current_stock" placeholder="Stock actuel" value={formData.current_stock} onChange={handleChange} />
      <input type="text" name="location" placeholder="Emplacement" value={formData.location} onChange={handleChange} />

      <select name="category_type" value={formData.category_type} onChange={handleChange}>
        <option value="">Type</option>
        {[...new Set(categories.map(c => c.type))].map(type => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>
      <select name="category_brand" value={formData.category_brand} onChange={handleChange}>
        <option value="">Marque</option>
        {[...new Set(categories.filter(c => c.type === formData.category_type).map(c => c.brand))].map(brand => (
          <option key={brand} value={brand}>{brand}</option>
        ))}
      </select>
      <select name="category_model" value={formData.category_model} onChange={handleChange}>
        <option value="">Modèle</option>
        {[...new Set(categories.filter(c => c.brand === formData.category_brand).map(c => c.model))].map(model => (
          <option key={model} value={model}>{model}</option>
        ))}
      </select>

      <button type="submit">Ajouter produit</button>
    </form>
  );
};

export default ProductFormSimple;