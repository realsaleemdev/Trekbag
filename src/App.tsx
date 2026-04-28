import React, { useState, useMemo } from "react";

interface Item {
  id: number;
  text: string;
  packed: boolean;
}

const INITIAL_ITEMS: Item[] = [
  { id: 1, text: "good mood", packed: true },
  { id: 2, text: "passport", packed: false },
  { id: 3, text: "phone charger", packed: false },
];

const App: React.FC = () => {
  const [items, setItems] = useState<Item[]>(INITIAL_ITEMS);
  const [inputValue, setInputValue] = useState("");
  const [sortBy, setSortBy] = useState("default");

  const totalItems = items.length;
  const packedItems = items.filter((item) => item.packed).length;

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newItem: Item = {
      id: Date.now(),
      text: inputValue.trim(),
      packed: false,
    };

    setItems((prev) => [...prev, newItem]);
    setInputValue("");
  };

  const toggleItem = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  };

  const deleteItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const markAllAsComplete = () => {
    setItems((prev) => prev.map((item) => ({ ...item, packed: true })));
  };

  const markAllAsIncomplete = () => {
    setItems((prev) => prev.map((item) => ({ ...item, packed: false })));
  };

  const resetToInitial = () => {
    setItems(INITIAL_ITEMS);
  };

  const removeAllItems = () => {
    setItems([]);
  };

  const sortedItems = useMemo(() => {
    const itemsCopy = [...items];
    if (sortBy === "packed") {
      return itemsCopy.sort((a, b) => Number(a.packed) - Number(b.packed));
    }
    if (sortBy === "unpacked") {
       return itemsCopy.sort((a, b) => Number(b.packed) - Number(a.packed));
    }
    return itemsCopy;
  }, [items, sortBy]);

  return (
    <div className="min-h-screen bg-[#EAD8C3] flex flex-col items-center justify-center p-4 relative font-sans">
      {/* Watermark */}
      <div className="absolute top-10 left-0 right-0 pointer-events-none select-none overflow-hidden">
        <h1 className="text-[15rem] font-bold text-black opacity-[0.03] text-center tracking-tighter">
          TREKBAG
        </h1>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-[800px] bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col z-10 min-h-[500px]">
        {/* Top Bar */}
        <div className="bg-[#F1F1F1] px-4 py-3 flex items-center justify-between border-b border-gray-200">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-gray-300"></div>
            <div className="w-3 h-3 rounded-full bg-gray-300"></div>
            <div className="w-3 h-3 rounded-full bg-gray-300"></div>
          </div>
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
            {packedItems} / {totalItems} items packed
          </p>
        </div>

        {/* Content Area */}
        <div className="flex flex-1 flex-col md:flex-row">
          {/* Left Column (List Area) */}
          <div className="flex-[1.5] flex flex-col min-h-[400px]">
            <div className="p-4 border-b border-gray-100">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none"
              >
                <option value="default">Sort by default</option>
                <option value="packed">Sort by packed</option>
                <option value="unpacked">Sort by unpacked</option>
              </select>
            </div>

            <div className="flex-1 overflow-y-auto max-h-[400px]">
              {sortedItems.length === 0 ? (
                <p className="text-center text-gray-400 mt-10 italic">Your list is empty...</p>
              ) : (
                <ul className="divide-y divide-gray-50">
                  {sortedItems.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group"
                    >
                      <div className="flex items-center gap-3 flex-1 cursor-pointer" onClick={() => toggleItem(item.id)}>
                        <div
                          className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all ${
                            item.packed ? "bg-[#4A3B32] border-[#4A3B32]" : "border-gray-300 bg-white"
                          }`}
                        >
                          {item.packed && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className={`text-sm text-gray-700 ${item.packed ? "line-through text-gray-400" : ""}`}>
                          {item.text}
                        </span>
                      </div>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="text-red-400 hover:text-red-600 font-bold px-2 transition-colors"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Right Column (Controls Area) */}
          <div className="flex-1 bg-[#F9F9F9] border-l border-gray-100 p-6 flex flex-col justify-between gap-8">
            {/* Add Item Section */}
            <div>
              <h2 className="text-xs font-bold text-gray-800 uppercase tracking-widest mb-3">Add an item</h2>
              <form onSubmit={handleAddItem} className="space-y-3">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Toothbrush..."
                  className="w-full bg-white border border-gray-200 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all shadow-sm"
                  autoFocus
                />
                <button
                  type="submit"
                  className="w-full bg-[#4A3B32] text-white py-2.5 rounded-md text-sm font-medium hover:bg-[#3d312a] transition-colors shadow-md active:transform active:scale-[0.98]"
                >
                  Add to list
                </button>
              </form>
            </div>

            {/* Bulk Actions Section */}
            <div className="flex flex-col gap-2">
              <button
                onClick={markAllAsComplete}
                className="w-full bg-[#6B5A52] text-white py-2 rounded-md text-xs font-semibold hover:bg-[#5e4e47] transition-colors"
              >
                Mark all as complete
              </button>
              <button
                onClick={markAllAsIncomplete}
                className="w-full bg-[#6B5A52] text-white py-2 rounded-md text-xs font-semibold hover:bg-[#5e4e47] transition-colors"
              >
                Mark all as incomplete
              </button>
              <button
                onClick={resetToInitial}
                className="w-full bg-[#6B5A52] text-white py-2 rounded-md text-xs font-semibold hover:bg-[#5e4e47] transition-colors"
              >
                Reset to initial
              </button>
              <button
                onClick={removeAllItems}
                className="w-full bg-[#6B5A52] text-white py-2 rounded-md text-xs font-semibold hover:bg-[#5e4e47] transition-colors"
              >
                Remove all items
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full max-w-[800px] mt-4 flex justify-between items-center px-2">
        <p className="text-[10px] text-gray-500 font-medium">© 2050. Copyright by ByteGrad.</p>
        <p className="text-[10px] text-gray-500 font-medium">Version 1.5</p>
      </footer>
    </div>
  );
};

export default App;
