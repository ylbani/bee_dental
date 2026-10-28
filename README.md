# 🦷 Bee Dental — Sistema Integral de Gestión Clínica & Web Oficial

Sistema integral para la administración clínica, odontogramas interactivos, agenda y facturación de **Bee Dental** (Sede Plaza Balón, Santo Domingo), desarrollado con **Next.js 14 (App Router)**, **TypeScript estricto**, **Tailwind CSS**, **Prisma ORM**, **Supabase PostgreSQL** y arquitectura serverless lista para desplegar en **Vercel**.

Incluye tanto la **web oficial de alta conversión** para pacientes como el **Portal Clínico Administrativo** y una **API REST v1** documentada para conectar un agente de WhatsApp Business.

---

## 🌟 Módulos y Funcionalidades del Sistema

### 1. Portal Web Público (Landing & Reserva)
- **Diseño Médico de Alta Precisión:** Paleta esmeralda (`#00685f`), contenedores en azul suave (`#f8f9ff`) y acentos dorados/ámbar. Tipografías *Playfair Display* y *Plus Jakarta Sans*.
- **Agendamiento Inteligente:** Formulario interactivo que consulta y envía solicitudes directamente a `/api/v1/appointments`.
- **Botón Flotante de WhatsApp:** Conexión directa al número oficial **849-632-3258** con mensaje predeterminado.
- **Ubicación & Google Maps:** Plaza Balón Ave, Av. Charles de Gaulle 10, Santo Domingo 11404.

### 2. Panel Principal (Dashboard Clínico)
- Indicadores en tiempo real: Citas del día, pacientes atendidos vs en espera, ocupación de sillones (88%), ingresos del día y mes en Pesos Dominicanos (DOP) y saldos por cobrar.
- Flujo de pacientes en vivo con estados de atención y filtros por periodo (Hoy, Semana, Mes).

### 3. Pacientes y Expediente Clínico Longitudinal
- Búsqueda predictiva por nombre, cédula dominicana (`402-XXXXXXX-X`), expediente (`EXP-XXXX`) o teléfono.
- Detección de duplicados y ficha integral del paciente.
- Historial médico con alertas clínicas: hipertensión, diabetes, alergias a anestesia y medicaciones.
- Consultas odontológicas con notas y adendas inmutables con autor y fecha.

### 4. Odontograma Gráfico Interactivo (SVG Nativo FDI)
- Representación anatómica en vector SVG de dentición permanente (piezas 11 a 48) y temporal (51 a 85).
- Desglose por 5 superficies dentales: Oclusal/Incisal, Mesial, Distal, Vestibular y Lingual/Palatina.
- Registro modal de afecciones: Caries, Restauración, Endodoncia, Corona, Implante, Ausencia, Fractura, Sellante.
- Diferenciación visual entre procedimientos planificados (pendiente) y realizados, con historial fechado e impresión.

### 5. Calendario y Agenda Dinámica
- Vistas por Día, Semana, Mes y Agenda.
- Filtro por profesional (Dr. Michael Chen, Dra. Elena Ruiz, Dr. Carlos Morales) y consultorios/sillones.
- Prevención de solapamientos con validación serverless en zona horaria `America/Santo_Domingo`.

### 6. Catálogo de Servicios y Procedimientos
- Catálogo administrable con tarifas base en RD$ (DOP), duración estimada en minutos y requerimiento de cita.
- Categorías: Estética Dental (DSD), Ortodoncia, Cirugía e Implantes, Prevención, Urgencias, Pediatría.

### 7. Facturación, Cobros y Cuentas por Cobrar
- Emisión de facturas correlativas (`FAC-XXXXX`) con desglose de servicios, descuentos y copagos.
- Registro de cobros (Efectivo, Tarjeta, Transferencia) con soporte para abonos parciales y saldo restante.

### 8. Módulo de Seguros Médicos (ARS Dominicanas)
- Interruptor general en configuración para habilitar o deshabilitar el módulo según la política de la clínica.
- Soporte para ARS dominicanas: ARS Senasa, Primera ARS, Mapfre Salud, con cálculo de copagos y reclamaciones.

### 9. Usuarios, Roles y Permisos (RBAC)
- Roles predefinidos: Administrador, Recepcionista, Odontólogo, Asistente Dental, Caja y Auditor.
- Aislamiento multi-tenant por clínica y validación estricta de permisos en el servidor.

### 10. Auditoría Inmutable
- Trazabilidad criptográfica de accesos, creación de expedientes, cambios en odontogramas y cobros con usuario, fecha e IP.

---

## 🤖 API REST v1 para Agente de WhatsApp y Web

La API está versionada bajo `/api/v1` y protegida con validación Zod:

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `GET` | `/api/v1/availability?date=YYYY-MM-DD` | Devuelve horarios disponibles reales sin filtrar datos privados de otros pacientes. |
| `POST` | `/api/v1/appointments` | Reserva transaccional con soporte para cabecera `x-idempotency-key` para evitar duplicados. |
| `GET` | `/api/v1/services` | Catálogo de servicios activos con tarifas y duraciones en DOP para el bot conversacional. |

---

## 🛠️ Desarrollo Local

1. Clona el repositorio:
   ```bash
   git clone https://github.com/ylbani/bee_dental.git
   cd bee_dental
   ```

2. Instala dependencias:
   ```bash
   npm install
   ```

3. Configura las variables de entorno:
   ```bash
   cp .env.example .env
   ```

4. Genera el cliente de Prisma:
   ```bash
   npx prisma generate
   ```

5. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
   Abre [http://localhost:3000](http://localhost:3000) para la Web pública o [http://localhost:3000/dashboard](http://localhost:3000/dashboard) para el Portal Clínico.

6. Ejecuta la suite de pruebas automatizadas:
   ```bash
   npm test
   ```

---

## 🚀 Despliegue en Vercel (Producción)

1. Ve a [Vercel](https://vercel.com) e importa el repositorio `ylbani/bee_dental`.
2. Configura las variables de entorno en Vercel (`Project Settings` → `Environment Variables`):
   - `DATABASE_URL`: URL del pooler de Supabase (`postgresql://...`).
   - `DIRECT_URL`: URL directa de Supabase (`postgresql://...`).
   - `NEXT_PUBLIC_SUPABASE_URL`: URL de tu proyecto Supabase.
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Clave pública anon de Supabase.
   - `SUPABASE_SERVICE_ROLE_KEY`: Clave privada service_role.
   - `INTEGRATION_API_KEY_SECRET`: Clave secreta para autorizar bots de WhatsApp.
3. Haz clic en **Deploy**. El comando `prisma generate && next build` se ejecutará automáticamente optimizando las 20 rutas serverless.

---

## 📞 Contacto de la Clínica

- **Sede:** Plaza Balón Ave, Av. Charles de Gaulle 10, Santo Domingo 11404
- **Teléfono y WhatsApp:** 849-632-3258 (`+1 849 632 3258`)
- **Correo:** contacto@beedental.es

© 2025 Bee Dental S.L. Todos los derechos reservados.
