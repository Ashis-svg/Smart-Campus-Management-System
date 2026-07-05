import React, { useState } from 'react';

const MEAL_BADGE = {
  Breakfast: 'bg-amber-50 text-amber-700 border-amber-200',
  Lunch:     'bg-emerald-50 text-emerald-700 border-emerald-200',
  Dinner:    'bg-blue-50 text-blue-700 border-blue-200',
};

const inputCls = "w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition";

const MealCard = ({ meal, onEdit }) => {
  const items = [meal.item1, meal.item2, meal.item3, meal.item4, meal.item5].filter(Boolean);
  const badge = MEAL_BADGE[meal.meal] ?? 'bg-slate-100 text-slate-600 border-slate-200';

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 mb-3 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full border ${badge}`}>
          {meal.meal}
        </span>
        <button onClick={() => onEdit(meal)}
          className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-lg hover:bg-blue-100 transition cursor-pointer">
          ✏️ Edit
        </button>
      </div>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />{item}
          </li>
        ))}
      </ul>
    </div>
  );
};

// Edit popup modal
const EditModal = ({ meal, onSave, onClose }) => {
  const [form, setForm] = useState({
    item1: meal.item1 ?? '', item2: meal.item2 ?? '',
    item3: meal.item3 ?? '', item4: meal.item4 ?? '',
    item5: meal.item5 ?? '',
  });

  const handleSave = () => {
    onSave({
      hall_no:  meal.hall_no,
      week_day: meal.week_day,
      meal:     meal.meal,
      ...form,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-[#1e3a5f]">
            Edit {meal.meal} — {meal.week_day}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer text-xl leading-none">×</button>
        </div>

        <div className="space-y-2.5">
          {[1,2,3,4,5].map((n) => (
            <input key={n} className={inputCls}
              placeholder={`Item ${n}`}
              value={form[`item${n}`]}
              onChange={(e) => setForm({ ...form, [`item${n}`]: e.target.value })}
            />
          ))}
        </div>

        <div className="flex gap-2 mt-5">
          <button onClick={onClose}
            className="flex-1 py-2 text-sm font-semibold text-slate-500 bg-slate-100 rounded-lg hover:bg-slate-200 transition cursor-pointer">
            Cancel
          </button>
          <button onClick={handleSave}
            className="flex-1 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition cursor-pointer">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

const MenuSection = ({ todayMenu, tomorrowMenu, onUpdateMenu }) => {
  const [view,    setView]    = useState('today');
  const [editing, setEditing] = useState(null);

  const meals = view === 'today' ? todayMenu : tomorrowMenu;

  return (
    <>
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-5">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Menu</p>
          <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
            {['today', 'tomorrow'].map((v) => (
              <button key={v} onClick={() => setView(v)}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition cursor-pointer
                  ${view === v ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                {v === 'today' ? 'Today' : 'Tomorrow'}
              </button>
            ))}
          </div>
        </div>

        {meals.length === 0 ? (
          <p className="text-center py-8 text-slate-400 text-sm">No menu available.</p>
        ) : (
          meals.map((meal, i) => (
            <MealCard key={i} meal={meal} onEdit={setEditing} />
          ))
        )}
      </div>

      {editing && (
        <EditModal
          meal={editing}
          onSave={onUpdateMenu}
          onClose={() => setEditing(null)}
        />
      )}
    </>
  );
};

export default MenuSection;