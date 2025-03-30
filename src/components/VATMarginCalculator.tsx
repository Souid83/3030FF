import React, { useState, useEffect } from 'react';

interface VATMarginCalculatorProps {
  onValuesChange?: (values: {
    purchasePrice: string;
    sellingPrice: string;
    marginPercent: string;
    marginAmount: string;
  }) => void;
}

export const VATMarginCalculator: React.FC<VATMarginCalculatorProps> = ({
  onValuesChange
}) => {
  const [purchasePrice, setPurchasePrice] = useState<string>('');
  const [sellingPrice, setSellingPrice] = useState<string>('');
  const [marginPercent, setMarginPercent] = useState<string>('');
  const [marginAmount, setMarginAmount] = useState<string>('');

  // Cas 4: Calcul à partir du prix de vente et prix d'achat
  const calculateFromSellingPrice = (newSellingPrice: string, newPurchasePrice: string) => {
    console.log('Calculating from selling price:', { newSellingPrice, newPurchasePrice });
    
    if (!newSellingPrice || !newPurchasePrice) return;

    const selling = parseFloat(newSellingPrice);
    const purchase = parseFloat(newPurchasePrice);

    if (isNaN(selling) || isNaN(purchase)) return;

    // 1. Calculer la marge numéraire nette
    const marginNet = (selling - purchase) / 1.2;
    console.log('Margin net:', marginNet);

    // 2. Calculer la marge en pourcentage
    const marginPct = (marginNet / purchase) * 100;
    console.log('Margin percent:', marginPct);

    setMarginAmount(marginNet.toFixed(2));
    setMarginPercent(marginPct.toFixed(2));

    if (onValuesChange) {
      onValuesChange({
        purchasePrice: newPurchasePrice,
        sellingPrice: newSellingPrice,
        marginPercent: marginPct.toFixed(2),
        marginAmount: marginNet.toFixed(2)
      });
    }
  };

  // Cas 5: Calcul à partir du prix d'achat et de la marge en %
  const calculateFromMarginPercent = (newPurchasePrice: string, newMarginPercent: string) => {
    console.log('Calculating from margin percent:', { newPurchasePrice, newMarginPercent });
    
    if (!newPurchasePrice || !newMarginPercent) return;

    const purchase = parseFloat(newPurchasePrice);
    const margin = parseFloat(newMarginPercent);

    if (isNaN(purchase) || isNaN(margin)) return;

    // 1. Calculer la marge numéraire nette
    const marginNet = (purchase * margin) / 100;
    console.log('Margin net:', marginNet);

    // 2. Calculer le prix de vente
    const selling = purchase + (marginNet * 1.2);
    console.log('Selling price:', selling);

    setMarginAmount(marginNet.toFixed(2));
    setSellingPrice(selling.toFixed(2));

    if (onValuesChange) {
      onValuesChange({
        purchasePrice: newPurchasePrice,
        sellingPrice: selling.toFixed(2),
        marginPercent: newMarginPercent,
        marginAmount: marginNet.toFixed(2)
      });
    }
  };

  const handlePurchasePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPurchasePrice(value);
    
    if (marginPercent) {
      calculateFromMarginPercent(value, marginPercent);
    } else if (sellingPrice) {
      calculateFromSellingPrice(sellingPrice, value);
    }
  };

  const handleSellingPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSellingPrice(value);
    
    if (purchasePrice) {
      calculateFromSellingPrice(value, purchasePrice);
    }
  };

  const handleMarginPercentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMarginPercent(value);
    
    if (purchasePrice) {
      calculateFromMarginPercent(purchasePrice, value);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="relative">
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Prix de vente
        </label>
        <input
          type="text"
          value={sellingPrice}
          onChange={handleSellingPriceChange}
          onBlur={(e) => purchasePrice && calculateFromSellingPrice(e.target.value, purchasePrice)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
          €
        </span>
      </div>
      <div className="relative">
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Marge %
        </label>
        <input
          type="text"
          value={marginPercent}
          onChange={handleMarginPercentChange}
          onBlur={(e) => purchasePrice && calculateFromMarginPercent(purchasePrice, e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-green-600"
        />
        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600">
          %
        </span>
      </div>
      <div className="relative">
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Marge numéraire net
        </label>
        <input
          type="text"
          value={marginAmount}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
          €
        </span>
      </div>
    </div>
  );
};