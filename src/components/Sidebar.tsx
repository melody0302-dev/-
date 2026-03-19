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
  { id: 'dashboard', label: '实时监控', icon: LayoutDashboard },
  { id: 'admission', label: '型号准入', icon: ShieldCheck },
  { id: 'priority', label: '优先级管理', icon: Zap },
  { id: 'reservation', label: '卡时预留', icon: CalendarDays },
  { id: 'kill-config', label: '查杀配置', icon: Settings2 },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <aside className="w-64 h-screen border-r border-white/10 flex flex-col bg-black/40 backdrop-blur-md sticky top-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center shadow-lg shadow-brand-primary/20">
          <Cpu className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-tight text-white">弹性算力运营系统</h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">9N-Computing power</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group",
              activeTab === item.id 
                ? "bg-brand-primary/10 text-brand-primary border border-brand-primary/20 shadow-[0_0_15px_rgba(0,242,255,0.1)]" 
                : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
            )}
          >
            <item.icon className={cn(
              "w-5 h-5 transition-transform duration-300 group-hover:scale-110",
              activeTab === item.id ? "text-brand-primary" : "text-slate-500"
            )} />
            <span className="font-medium">{item.label}</span>
            {activeTab === item.id && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-primary shadow-[0_0_8px_rgba(0,242,255,1)]" />
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-brand-secondary/20 to-transparent border border-brand-secondary/20 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-brand-secondary" />
            <span className="text-xs font-semibold text-slate-300">集群健康度</span>
          </div>
          <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
            <div className="h-full w-[94%] bg-gradient-to-r from-brand-secondary to-brand-primary" />
          </div>
          <p className="text-[10px] text-slate-500 mt-2">系统运行正常，当前负载 82%</p>
        </div>
        
        <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-400 transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">退出系统</span>
        </button>
      </div>
    </aside>
  );
};
