import React from 'react';
import AttendanceRow from './AttendanceRow';

const MEAL_COLORS = {
  Breakfast: 'bg-amber-50 text-amber-700 border-amber-200',
  Lunch:     'bg-emerald-50 text-emerald-700 border-emerald-200',
  Dinner:    'bg-blue-50 text-blue-700 border-blue-200',
};

const MealCard = ({ meal, showAttendance, onAttendance }) => {
  const items = [meal.item1, meal.item2, meal.item3, meal.item4, meal.item5].filter(Boolean);
  const badgeCls = MEAL_COLORS[meal.meal] ?? 'bg-slate-100 text-slate-600 border-slate-200';

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 mb-4 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <span className={`text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full border ${badgeCls}`}>
          {meal.meal}
        </span>
      </div>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
            {item}
          </li>
        ))}
      </ul>
      {showAttendance && (
        <AttendanceRow meal={meal.meal} onAttendance={onAttendance} />
      )}
    </div>
  );
};

const MenuSection = ({ title, meals, showAttendance = false, onAttendance }) => (
  <section>
    <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-4">{title}</p>
    {meals.length === 0 ? (
      <div className="text-center py-12 text-slate-400 text-sm">No menu available.</div>
    ) : (
      meals.map((meal) => (
        <MealCard
          key={meal.id}
          meal={meal}
          showAttendance={showAttendance}
          onAttendance={onAttendance}
        />
      ))
    )}
  </section>
);

export default MenuSection;