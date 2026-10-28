"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  Calendar,
  Layers,
  Receipt,
  Shield,
  UserCog,
  BarChart3,
  Settings,
  History,
  ChevronLeft,
  ChevronRight,
  Stethoscope,
  Smile,
  LogOut,
} from "lucide-react";

interface SidebarProps {
  userRole?: string;
}

export function Sidebar({ userRole = "ADMIN" }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: "Panel Principal", href: "/dashboard", icon: LayoutDashboard },
    { name: "Pacientes", href: "/dashboard/patients", icon: Users },
    { name: "Expedientes Clínicos", href: "/dashboard/records", icon: FileText },
    { name: "Odontogramas", href: "/dashboard/odontogram", icon: Smile },
    { name: "Calendario y Citas", href: "/dashboard/calendar", icon: Calendar },
    { name: "Servicios Clínicos", href: "/dashboard/services", icon: Stethoscope },
    { name: "Facturación y Cobros", href: "/dashboard/billing", icon: Receipt },
    { name: "Seguros Médicos", href: "/dashboard/insurance", icon: Shield },
    { name: "Usuarios y Roles", href: "/dashboard/users", icon: UserCog },
    { name: "Reportes Clínicos", href: "/dashboard/reports", icon: BarChart3 },
    { name: "Configuración", href: "/dashboard/settings", icon: Settings },
    { name: "Auditoría", href: "/dashboard/audit", icon: History },
  ];

  return (
    <aside
      className={`relative flex flex-col border-r border-surface-container-high bg-surface-container-lowest transition-all duration-300 z-30 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-surface-container-high">
        <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-[20px]">dentistry</span>
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-display font-bold text-base text-on-surface leading-tight tracking-tight">
                Bee Dental
              </span>
              <span className="text-[10px] uppercase font-bold text-primary tracking-wider">
                Gestión Clínica
              </span>
            </div>
          )}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-7 h-7 rounded-lg bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors"
          title={collapsed ? "Expandir menú" : "Colapsar menú"}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all group ${
                isActive
                  ? "bg-primary text-white shadow-sm font-semibold"
                  : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              }`}
              title={collapsed ? item.name : undefined}
            >
              <Icon
                size={18}
                className={`shrink-0 ${
                  isActive ? "text-white" : "text-primary group-hover:scale-110 transition-transform"
                }`}
              />
              {!collapsed && <span className="truncate">{item.name}</span>}
            </Link>
          );
        })}
      </div>

      {/* Clinic & User footer badge */}
      <div className="p-3 border-t border-surface-container-high bg-surface-container-low/50">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold text-xs shrink-0 ring-2 ring-primary">
            MC
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-bold text-on-surface truncate">
                Dr. Michael Chen
              </span>
              <span className="text-[10px] text-primary font-semibold truncate">
                Director Médico (Admin)
              </span>
            </div>
          )}
          <Link
            href="/"
            className="text-on-surface-variant hover:text-error transition-colors p-1"
            title="Volver a la Web pública"
          >
            <LogOut size={16} />
          </Link>
        </div>
      </div>
    </aside>
  );
}

