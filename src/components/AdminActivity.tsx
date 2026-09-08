import React, { useMemo, useState } from 'react';
import { Activity, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AdminActivity: React.FC = () => {
  const { activities } = useApp();
  const [query, setQuery] = useState('');
  const filteredActivities = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return activities.filter(item => !normalizedQuery || [item.userName, item.userEmail, item.action, item.description].some(value => value.toLowerCase().includes(normalizedQuery)));
  }, [activities, query]);

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2"><Activity className="h-5 w-5 text-indigo-600" /><h1 className="text-2xl font-black tracking-tight">Customer Activity</h1></div>
          <p className="text-xs text-neutral-500 mt-1">Live actions recorded across customer accounts.</p>
        </div>
        <div className="relative w-full sm:w-72"><Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search activity" className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-[#111] border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs focus:outline-none focus:border-indigo-500" /></div>
      </div>
      {filteredActivities.length === 0 ? <div className="border border-dashed border-neutral-300 dark:border-neutral-700 p-12 text-center text-sm text-neutral-500">No customer activity recorded yet.</div> : <div className="bg-white dark:bg-[#111] border border-neutral-200 dark:border-neutral-800 rounded-2xl divide-y divide-neutral-100 dark:divide-neutral-800">{filteredActivities.map(item => <div key={item.id} className="p-4 flex gap-3"><div className="h-8 w-8 shrink-0 rounded-full bg-indigo-500/10 text-indigo-600 flex items-center justify-center"><Activity className="h-4 w-4" /></div><div className="min-w-0 flex-1"><div className="flex flex-wrap justify-between gap-2"><p className="text-xs font-bold">{item.userName} <span className="font-normal text-neutral-500">({item.userEmail})</span></p><time className="text-[10px] text-neutral-400">{new Date(item.createdAt).toLocaleString()}</time></div><p className="text-xs text-neutral-600 dark:text-neutral-300 mt-1">{item.description}</p><p className="text-[10px] uppercase tracking-wider text-neutral-400 mt-1">{item.action.replaceAll('_', ' ')}</p></div></div>)}</div>}
    </div>
  );
};
