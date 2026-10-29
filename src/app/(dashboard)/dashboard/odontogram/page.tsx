import React from "react";
import { InteractiveOdontogram } from "@/components/odontogram/interactive-odontogram";

export default function OdontogramPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-on-surface">
            Módulo de Odontograma Clínico
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
            Registro visual anatómico de afecciones dentales, restauraciones y tratamientos planificados
          </p>
        </div>
      </div>

      <InteractiveOdontogram />
    </div>
  );
}

