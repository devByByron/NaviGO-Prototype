import React, { useState, useEffect, useRef } from 'react';
import { Icons, Button, IconButton, Card, Input, Badge, SectionTitle, CategoryPill } from './components/DesignSystem';
import { StoreMap } from './components/StoreMap';
import { parseShoppingList } from './services/ai';
import { findProduct, PRODUCTS, AISLES, getProductById } from './services/mockData';
import { ShoppingItem, AppState, ViewState, Product } from './types';

// --- Main App Component ---

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    view: 'HOME',
    shoppingList: [],
    history: [],
    searchQuery: '',
    selectedProduct: null,
    isProcessing: false,
  });
  
  const [inputValue, setInputValue] = useState('');

  // --- Actions ---

  const handleAIParse = async () => {
    if (!inputValue.trim()) return;
    
    setState(prev => ({ ...prev, isProcessing: true }));
    
    try {
      const result = await parseShoppingList(inputValue);
      
      const newItems: ShoppingItem[] = result.items.map((p, idx) => {
        const dbProduct = findProduct(p.name);
        
        if (dbProduct) {
          return {
            ...dbProduct,
            uniqueId: `${dbProduct.id}-${Date.now()}-${idx}`,
            checked: false,
            quantity: 1,
            isSuggestion: p.suggested
          };
        } else {
          return {
            id: `gen-${Date.now()}-${idx}`,
            name: p.name,
            category: p.category || 'Uncategorized',
            aisle: 99,
            price: 0,
            image: '📦',
            coordinates: { x: 50, y: 50 },
            uniqueId: `gen-${Date.now()}-${idx}`,
            checked: false,
            quantity: 1,
            isSuggestion: p.suggested
          };
        }
      });
      
      setState(prev => ({
        ...prev,
        shoppingList: [...prev.shoppingList, ...newItems],
        view: 'LIST', // Go directly to list for flow
        isProcessing: false
      }));
      setInputValue(''); 
      
    } catch (e) {
      console.error(e);
      setState(prev => ({ ...prev, isProcessing: false }));
    }
  };

  const addItemToCart = (item: ShoppingItem) => {
    setState(prev => ({
      ...prev,
      shoppingList: [...prev.shoppingList, item]
    }));
  };

  const toggleCheck = (uniqueId: string) => {
    setState(prev => ({
      ...prev,
      shoppingList: prev.shoppingList.map(item => 
        item.uniqueId === uniqueId ? { ...item, checked: !item.checked } : item
      )
    }));
  };

  const removeItem = (uniqueId: string) => {
    setState(prev => ({
      ...prev,
      shoppingList: prev.shoppingList.filter(item => item.uniqueId !== uniqueId)
    }));
  };

  const handleProductSearch = (query: string) => {
    setState(prev => ({ ...prev, searchQuery: query }));
  };

  const getFilteredProducts = () => {
    if (!state.searchQuery) return PRODUCTS.slice(0, 10);
    const q = state.searchQuery.toLowerCase();
    return PRODUCTS.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.category.toLowerCase().includes(q)
    );
  };

  // --- View Renderers ---

  const renderHome = () => (
    <div className="flex flex-col h-full bg-surface">
      {/* Header */}
      <div className="px-6 pt-12 pb-6 bg-white rounded-b-[2.5rem] shadow-soft z-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-1 text-slate-400 text-xs font-medium mb-1">
              <Icons.Location className="w-3 h-3" />
              <span>Current Store</span>
            </div>
            <button className="flex items-center gap-1 font-bold text-slate-800 text-lg">
              Metro Market <Icons.ChevronDown className="w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-2">
            <IconButton><Icons.MessageSquare className="w-5 h-5" /></IconButton>
            <div className="relative">
              <IconButton><Icons.User className="w-5 h-5" /></IconButton>
              <span className="absolute top-0 right-0 w-3 h-3 bg-primary rounded-full border-2 border-white"></span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Good afternoon, Rachel</h1>
          <p className="text-slate-500 text-sm">What can we help you find today?</p>
        </div>

        {/* Search / AI Input */}
        <div 
          className="relative bg-slate-50 rounded-2xl p-4 border border-slate-100 shadow-inner mb-2 cursor-pointer transition-all hover:bg-slate-100"
        >
          <div className="flex items-center gap-3 mb-3">
             <Icons.Search className="text-slate-400" />
             <input 
              className="bg-transparent w-full focus:outline-none text-slate-800 placeholder:text-slate-400 font-medium"
              placeholder="Search for a product..."
              onFocus={() => setState(s => ({...s, view: 'SEARCH'}))}
             />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8 animate-slide-up">
        {/* Categories */}
        <div className="space-y-4">
          <SectionTitle action>Search by category</SectionTitle>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-6 px-6">
            <CategoryPill icon="🥦" label="Fruits & veg" onClick={() => { setState(s => ({...s, view: 'SEARCH', searchQuery: 'veg'})) }} />
            <CategoryPill icon="🥩" label="Meat & seafood" onClick={() => { setState(s => ({...s, view: 'SEARCH', searchQuery: 'meat'})) }} />
            <CategoryPill icon="🥖" label="Bakery" onClick={() => { setState(s => ({...s, view: 'SEARCH', searchQuery: 'bread'})) }} />
            <CategoryPill icon="🧀" label="Dairy" onClick={() => { setState(s => ({...s, view: 'SEARCH', searchQuery: 'dairy'})) }} />
          </div>
        </div>

        {/* Active Route Card or AI Prompt */}
        {state.shoppingList.length > 0 ? (
          <div>
            <SectionTitle>Current route</SectionTitle>
            <div className="relative rounded-3xl overflow-hidden bg-white shadow-soft h-48 border border-slate-100">
               <div className="absolute inset-0 opacity-60 pointer-events-none">
                  <StoreMap items={state.shoppingList} showRoute={true} />
               </div>
               <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-white via-white/90 to-transparent p-5 pt-12 flex justify-between items-end">
                  <div>
                    <p className="font-bold text-slate-800 text-lg">{state.shoppingList.filter(i => !i.checked).length} items remaining</p>
                    <p className="text-xs text-slate-500 font-medium">Estimated time: 15 min</p>
                  </div>
                  <Button onClick={() => setState(s => ({...s, view: 'MAP'}))}>View route</Button>
               </div>
            </div>
          </div>
        ) : (
          <div>
             <SectionTitle>Quick Plan</SectionTitle>
             <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-none shadow-glow">
                <div className="flex items-start gap-4">
                  <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                    <Icons.Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">Create a smart list</h3>
                    <p className="text-white/80 text-sm mb-4 leading-relaxed">Tell me what you're cooking or paste a recipe, and I'll organize the trip.</p>
                    <div className="bg-white/10 rounded-xl p-1 flex items-center backdrop-blur-md border border-white/20">
                      <input 
                        className="bg-transparent flex-1 px-3 py-2 text-white placeholder:text-white/60 text-sm focus:outline-none"
                        placeholder='e.g. "Tacos for 4 people"'
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAIParse()}
                      />
                      <button 
                        onClick={handleAIParse}
                        disabled={state.isProcessing}
                        className="p-2 bg-white text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors"
                      >
                         {state.isProcessing ? <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"/> : <Icons.ChevronRight className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
             </Card>
          </div>
        )}

        {/* Recent Searches */}
        <div>
          <SectionTitle>Recent searches</SectionTitle>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
             {[
               {name: "Pasta Sauce", img: "🍝", aisle: 7},
               {name: "Almond Milk", img: "🥛", aisle: 12},
               {name: "Sourdough", img: "🍞", aisle: 2}
             ].map((item, i) => (
               <div key={i} className="min-w-[140px] bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center">
                  <span className="text-3xl mb-3">{item.img}</span>
                  <p className="font-semibold text-slate-800 text-sm">{item.name}</p>
                  <p className="text-xs text-slate-400 mt-1">Aisle {item.aisle}</p>
               </div>
             ))}
          </div>
        </div>
        
        {/* Bottom spacer for nav */}
        <div className="h-20" />
      </div>
    </div>
  );

  const renderList = () => {
    // Sort items by aisle
    const groupedItems: Record<number, ShoppingItem[]> = {};
    state.shoppingList.forEach(item => {
      if (!groupedItems[item.aisle]) groupedItems[item.aisle] = [];
      groupedItems[item.aisle].push(item);
    });

    const aisleOrder = Object.keys(groupedItems).map(Number).sort((a, b) => a - b);
    const checkedCount = state.shoppingList.filter(i => i.checked).length;

    return (
      <div className="flex flex-col h-full bg-surface">
        <div className="px-6 py-6 bg-white shadow-sm z-10 sticky top-0 rounded-b-3xl">
           <SectionTitle className="!mb-1">Weekly shopping</SectionTitle>
           <p className="text-slate-400 text-sm mb-4">{state.shoppingList.length} items • {checkedCount} checked</p>
           
           <div className="flex gap-3">
             <Button className="flex-1" onClick={() => setState(s => ({...s, view: 'MAP'}))}>
                Start Route
             </Button>
             <IconButton onClick={() => setState(s => ({...s, view: 'SEARCH'}))}>
               <Icons.Plus />
             </IconButton>
           </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 pb-28">
           {state.shoppingList.length === 0 ? (
             <div className="text-center py-20 text-slate-400">
               <Icons.List className="w-12 h-12 mx-auto mb-4 opacity-50" />
               <p>Your list is empty.</p>
               <Button variant="ghost" onClick={() => setState(s => ({...s, view: 'HOME'}))} className="mt-4">Go Home</Button>
             </div>
           ) : (
             aisleOrder.map(aisleId => {
               const aisleName = AISLES.find(a => a.id === aisleId)?.name;
               const items = groupedItems[aisleId];
               
               return (
                 <div key={aisleId} className="animate-slide-up">
                   <div className="flex items-center justify-between mb-3 px-1">
                      <div className="flex items-center gap-2">
                         <Badge type="aisle">Aisle {aisleId}</Badge>
                         {aisleName && <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{aisleName}</span>}
                      </div>
                   </div>
                   <div className="space-y-3">
                     {items.map(item => (
                       <div 
                         key={item.uniqueId}
                         onClick={() => toggleCheck(item.uniqueId)}
                         className={`relative group bg-white rounded-2xl p-3 flex items-center gap-4 transition-all duration-300 border ${item.checked ? 'border-transparent bg-slate-50 opacity-60' : 'border-slate-100 shadow-sm'}`}
                       >
                          <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-2xl">
                            {item.image}
                          </div>
                          <div className="flex-1">
                            <h4 className={`font-semibold text-slate-800 ${item.checked ? 'line-through text-slate-400' : ''}`}>{item.name}</h4>
                            <p className="text-xs text-slate-400">{item.category}</p>
                          </div>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${item.checked ? 'bg-primary border-primary' : 'border-slate-300 group-hover:border-primary'}`}>
                             {item.checked && <Icons.Check className="w-3.5 h-3.5 text-white" />}
                          </div>
                       </div>
                     ))}
                   </div>
                 </div>
               );
             })
           )}
        </div>
      </div>
    );
  };

  const renderSearch = () => {
    const results = getFilteredProducts();

    return (
      <div className="flex flex-col h-full bg-surface">
        <div className="px-6 py-6 bg-white shadow-sm z-10 sticky top-0 rounded-b-3xl">
          <div className="flex items-center gap-4 mb-4">
             <button onClick={() => setState(s => ({...s, view: 'HOME', searchQuery: ''}))} className="p-2 -ml-2 rounded-full hover:bg-slate-50">
               <Icons.ArrowLeft className="w-6 h-6 text-slate-600" />
             </button>
             <h2 className="text-xl font-bold text-slate-800">Add Items</h2>
          </div>
          <Input 
            autoFocus
            icon={<Icons.Search />}
            placeholder="Search for apples, milk, bread..." 
            value={state.searchQuery}
            onChange={(e: any) => handleProductSearch(e.target.value)}
            className="shadow-sm"
          />
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 pb-24">
           {/* Grid Layout */}
           <div className="grid grid-cols-2 gap-4">
              {results.map(product => (
                <div key={product.id} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center text-center relative group">
                   <div className="absolute top-3 right-3">
                      <button 
                        onClick={() => {
                          addItemToCart({ ...product, uniqueId: `add-${Date.now()}`, checked: false, quantity: 1, isSuggestion: false });
                          // Optional: Show toast
                        }}
                        className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center shadow-lg hover:scale-110 hover:bg-emerald-600 transition-all"
                      >
                        <Icons.Plus className="w-5 h-5" />
                      </button>
                   </div>
                   <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center text-5xl mb-4 mt-2">
                     {product.image}
                   </div>
                   <h3 className="font-bold text-slate-800 mb-1">{product.name}</h3>
                   <p className="text-xs text-slate-500 font-medium">${product.price.toFixed(2)} • {product.shelf ? 'Shelf ' + product.shelf : 'Aisle ' + product.aisle}</p>
                </div>
              ))}
           </div>
        </div>
      </div>
    );
  };

  const renderMap = () => {
    const nextItem = state.shoppingList.find(i => !i.checked);

    return (
      <div className="flex flex-col h-full bg-white">
         <div className="absolute top-0 left-0 right-0 p-6 pt-12 z-20 pointer-events-none">
            <div className="flex justify-between items-start pointer-events-auto">
              <button 
                onClick={() => setState(s => ({...s, view: 'LIST'}))} 
                className="w-10 h-10 bg-white rounded-full shadow-soft flex items-center justify-center text-slate-700"
              >
                <Icons.ArrowLeft />
              </button>
              <div className="flex flex-col gap-2">
                <button className="w-10 h-10 bg-white rounded-full shadow-soft flex items-center justify-center text-slate-700">
                  <Icons.Search className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 bg-white rounded-full shadow-soft flex items-center justify-center text-slate-700">
                  <Icons.MessageSquare className="w-5 h-5" />
                </button>
              </div>
            </div>
         </div>

         {/* Full screen map */}
         <div className="flex-1 bg-slate-100 relative">
            <StoreMap items={state.shoppingList} activeItem={nextItem} />
         </div>

         {/* Bottom Sheet for Route */}
         <div className="bg-white rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] p-8 pb-10 z-20">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6" />
            
            {nextItem ? (
              <div className="animate-slide-up">
                 <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-800 mb-1">{nextItem.name}</h2>
                      <div className="flex items-center gap-2">
                         <Badge type="aisle">Aisle {nextItem.aisle}</Badge>
                         <span className="text-sm text-slate-500 font-medium">Shelf {nextItem.shelf || '?' } • Section 3</span>
                      </div>
                    </div>
                    <div className="text-4xl">{nextItem.image}</div>
                 </div>
                 
                 <div className="space-y-3">
                   <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <Icons.Sparkles className="w-5 h-5" />
                      </div>
                      <p className="text-xs text-slate-600 font-medium">This item is 50% off if you buy 2 today!</p>
                   </div>
                   
                   <Button className="w-full text-lg" onClick={() => toggleCheck(nextItem.uniqueId)}>
                     Mark as found
                   </Button>
                 </div>
              </div>
            ) : (
              <div className="text-center">
                <h2 className="text-xl font-bold text-slate-800 mb-2">You're all set!</h2>
                <p className="text-slate-500 mb-6">You've collected everything on your list.</p>
                <Button onClick={() => setState(s => ({...s, view: 'HOME', shoppingList: []}))}>Finish Trip</Button>
              </div>
            )}
         </div>
      </div>
    );
  };

  // --- Bottom Navigation ---
  const BottomNav = () => {
    if (state.view === 'MAP') return null; // Hide nav on map view for immersion
    
    const tabs: {id: ViewState, icon: any, label: string}[] = [
      { id: 'HOME', icon: Icons.Home, label: 'Home' },
      { id: 'LIST', icon: Icons.List, label: 'Lists' },
      { id: 'HISTORY', icon: Icons.Heart, label: 'Saved' },
      { id: 'SEARCH', icon: Icons.User, label: 'Profile' }, // Placeholder for profile
    ];

    return (
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-100 pb-safe pt-3 px-8 flex justify-between items-center z-40 rounded-t-[2rem] shadow-[0_-5px_20px_rgba(0,0,0,0.03)]">
        {tabs.map(tab => {
          const isActive = state.view === tab.id || (tab.id === 'LIST' && state.view === 'REVIEW');
          return (
            <button
              key={tab.id}
              onClick={() => setState(s => ({...s, view: tab.id}))}
              className={`flex flex-col items-center gap-1.5 p-2 transition-all duration-300 ${isActive ? 'text-primary transform -translate-y-1' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <tab.icon className={`w-6 h-6 ${isActive ? 'fill-current' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[10px] font-bold tracking-wide ${isActive ? 'opacity-100' : 'opacity-0 hidden'}`}>{tab.label}</span>
              {!isActive && <span className="w-1 h-1 rounded-full bg-transparent mb-1" />}
            </button>
          )
        })}
      </div>
    );
  };

  return (
    <div className="h-screen w-full bg-surface text-text font-sans overflow-hidden flex flex-col safe-bottom">
      <div className="flex-1 overflow-hidden relative">
        {state.view === 'HOME' && renderHome()}
        {(state.view === 'LIST' || state.view === 'REVIEW') && renderList()}
        {state.view === 'MAP' && renderMap()}
        {(state.view === 'SEARCH' || state.view === 'HISTORY') && renderSearch()}
      </div>
      <BottomNav />
    </div>
  );
};

export default App;