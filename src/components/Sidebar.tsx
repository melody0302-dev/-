import React from 'react';
import { 
  LayoutDashboard, 
  Activity, 
  ShieldCheck, 
  Settings2, 
  Zap, 
  Cpu,
  BarChart3,
  LogOut,
  CalendarDays
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: '数据看板', icon: LayoutDashboard },
  { id: 'priority', label: '队列管理', icon: Zap },
  { id: 'reservation', label: '卡时预留', icon: CalendarDays },
  { id: 'admission', label: '型号准入', icon: ShieldCheck },
  { id: 'kill-config', label: '查杀配置', icon: Settings2 },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <aside className="w-64 h-screen border-r border-slate-200 flex flex-col bg-white sticky top-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-brand-primary flex items-center justify-center">
          <Cpu className="text-white w-5 h-5" />
        </div>
        <h1 className="font-bold text-xl tracking-tight text-slate-900">弹性算力管理</h1>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group",
              activeTab === item.id 
                ? "bg-brand-primary/10 text-brand-primary font-semibold" 
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            <item.icon className={cn(
              "w-5 h-5",
              activeTab === item.id ? "text-brand-primary" : "text-slate-400 group-hover:text-slate-600"
            )} />
            <span className="text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <button className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-500 hover:text-brand-primary transition-colors text-sm">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">退出系统</span>
        </button>
      </div>
    </aside>
  );
};
