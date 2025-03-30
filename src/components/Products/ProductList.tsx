import React, { useState, useEffect, useCallback } from 'react';
import { useProductStore } from '../../store/productStore';
import { Edit, Trash2, AlertCircle, Image as ImageIcon, Plus, Package } from 'lucide-react';
import { ProductForm } from './ProductForm';
import { StockManager } from './StockManager';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../types/supabase';

type Product = Database['public']['Tables']['products']['Row'] & {
  category?: {
    type: string;
    brand: string;
    model: string;
  } | null;
  stocks?: {
    id: string;
    name: string;
    quantite: number;
    group?: {
      name: string;
      synchronizable: boolean;
    };
  }[];
};

interface ProductListProps {
  products: Product[];
}

const TVA_RATE = 0.20;

export const ProductList: React.FC<ProductListProps> = ({ products: initialProducts }) => {
  const { isLoading, error, deleteProduct, fetchProducts } = useProductStore();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [showImageManager, setShowImageManager] = useState(false);
  const [managingStockProduct, setManagingStockProduct] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);

  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  useEffect(() => {
    const subscription = supabase
      .channel('stock_changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'stock_produit'
        },
        async () => {
          const updatedProducts = await fetchProducts();
          if (updatedProducts) {
            setProducts(updatedProducts);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [fetchProducts]);

  const calculateTTC = (priceHT: number) => {
    return priceHT * (1 + TVA_RATE);
  };

  const calculateMargin = (purchasePrice: number, sellingPrice: number) => {
    if (!purchasePrice || !sellingPrice) return 0;
    return ((sellingPrice - purchasePrice) / purchasePrice) * 100;
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      setShowDeleteConfirm(null);
      setSelectedProducts(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleBulkDelete = async () => {
    try {
      for (const id of selectedProducts) {
        await deleteProduct(id);
      }
      setSelectedProducts(new Set());
      setShowBulkDeleteConfirm(false);
    } catch (error) {
      console.error('Error deleting products:', error);
    }
  };

  const handleEditWithImages = (productId: string) => {
    setEditingProduct(productId);
    setShowImageManager(true);
  };

  const handleStockUpdate = async () => {
    const updatedProducts = await fetchProducts();
    if (updatedProducts) {
      setProducts(updatedProducts);
    }
  };

  const handleSelectProduct = (id: string) => {
    setSelectedProducts(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedProducts.size === products.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(products.map(p => p.id)));
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Chargement...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div className="relative">
      <div className="bg-white rounded-lg shadow">
        <div className="max-h-[70vh] overflow-y-auto relative">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="sticky top-0 bg-gray-50 px-6 py-3 text-left">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-start gap-1">
                      <label className="text-xs font-medium text-gray-500">Sélecteur</label>
                      <input
                        type="checkbox"
                        checked={selectedProducts.size === products.length && products.length > 0}
                        onChange={handleSelectAll}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </div>
                    {selectedProducts.size > 0 && (
                      <button
                        onClick={() => setShowBulkDeleteConfirm(true)}
                        className="flex items-center gap-2 px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
                      >
                        <Trash2 size={16} />
                        Supprimer ({selectedProducts.size})
                      </button>
                    )}
                  </div>
                </th>
                <th className="sticky top-0 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="sticky top-0 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="sticky top-0 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th className="sticky top-0 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Catégorie
                </th>
                <th className="sticky top-0 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prix d'achat HT
                </th>
                <th className="sticky top-0 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prix magasin TTC
                </th>
                <th className="sticky top-0 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prix pro TTC
                </th>
                <th className="sticky top-0 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="sticky top-0 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Alerte stock
                </th>
                <th className="sticky top-0 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Emplacement
                </th>
                <th className="sticky top-0 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => {
                const purchasePrice = product.purchase_price_with_fees || 0;
                const retailPrice = product.retail_price || 0;
                const proPrice = product.pro_price || 0;
                const retailMargin = calculateMargin(purchasePrice, retailPrice);
                const proMargin = calculateMargin(purchasePrice, proPrice);
                const isLowStock = product.stock_alert !== null && product.stock_total <= product.stock_alert;
                const totalStock = product.stocks?.reduce((sum, stock) => sum + stock.quantite, 0) || 0;

                return (
                  <tr key={product.id} className={`${isLowStock ? 'bg-red-50' : ''} ${selectedProducts.has(product.id) ? 'bg-blue-50' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedProducts.has(product.id)}
                        onChange={() => handleSelectProduct(product.id)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative group">
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-lg"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://via.placeholder.com/48?text=No+Image';
                            }}
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <ImageIcon size={24} className="text-gray-400" />
                          </div>
                        )}
                        <button
                          onClick={() => handleEditWithImages(product.id)}
                          className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-blue-500 text-white rounded-full p-1 shadow-lg hover:bg-blue-600"
                          title="Modifier les images"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {product.sku}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.category ? `${product.category.type} ${product.category.brand} ${product.category.model}` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {purchasePrice.toFixed(2)} €
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <span>{calculateTTC(retailPrice).toFixed(2)} €</span>
                        <span className="text-green-600">({retailMargin.toFixed(0)}%)</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <span>{calculateTTC(proPrice).toFixed(2)} €</span>
                        <span className="text-green-600">({proMargin.toFixed(0)}%)</span>
                      </div>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${isLowStock ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                      <button
                        onClick={() => setManagingStockProduct(product.id)}
                        className="flex items-center gap-2 hover:text-blue-600"
                      >
                        <Package size={16} />
                        <span>{totalStock}</span>
                      </button>
                      {product.stocks && product.stocks.length > 0 && (
                        <div className="mt-1 space-y-1">
                          {product.stocks.map(stock => (
                            <div key={stock.id} className="text-xs text-gray-500">
                              {stock.name}: {stock.quantite}
                              {stock.group && (
                                <span className="text-gray-400 ml-1">
                                  ({stock.group.name})
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.stock_alert || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.location || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingProduct(product.id)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(product.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Modifier le produit</h2>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setShowImageManager(false);
                }}
                className="text-gray-600 hover:text-gray-800"
              >
                ✕
              </button>
            </div>
            <ProductForm
              initialProduct={products.find(p => p.id === editingProduct)}
              onSubmitSuccess={() => {
                setEditingProduct(null);
                setShowImageManager(false);
              }}
              showImageManager={showImageManager}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center mb-4 text-red-600">
              <AlertCircle size={24} className="mr-2" />
              <h3 className="text-lg font-semibold">Confirmer la suppression</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Annuler
              </button>
              <button
                onClick={() => showDeleteConfirm && handleDelete(showDeleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Modal */}
      {showBulkDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center mb-4 text-red-600">
              <AlertCircle size={24} className="mr-2" />
              <h3 className="text-lg font-semibold">Confirmer la suppression multiple</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer {selectedProducts.size} élément{selectedProducts.size > 1 ? 's' : ''} ? Cette action est irréversible.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowBulkDeleteConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Annuler
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stock Manager Modal */}
      {managingStockProduct && (
        <StockManager
          isOpen={true}
          onClose={() => setManagingStockProduct(null)}
          productId={managingStockProduct}
          onStockUpdate={handleStockUpdate}
        />
      )}
    </div>
  );
};