# 🏥 MEDDICAL ERP – Frontend

SPA (Single Page Application) del ERP hospitalario **MEDDICAL**.

Este documento está escrito para que devs **junior** puedan:

- entender la arquitectura actual,
- ubicar rápidamente cada archivo,
- y extender el sistema (roles/rutas/módulos/UI) sin romper lo existente.

> Nota importante: esta documentación refleja el **código actual del repo**. Hoy existen **solo 2 roles** (`admin`, `doctor`) y el login es **mock** (no hay JWT real todavía).

---

## 1) Stack y herramientas

- **React 18** + **TypeScript**
- **Vite 6**
- **React Router DOM 7** (rutas con `useRoutes`)
- **TailwindCSS v4** (tokens vía CSS variables en `src/styles/theme.css`)
- **Radix UI** (componentes “headless” en `src/ui/*`)
- Utilidades:
  - `class-variance-authority` (variantes de UI)
  - `clsx` + `tailwind-merge` (helper `cn()`)
  - `lucide-react` (íconos)
  - `date-fns` + `react-day-picker` (DatePicker)

---

## 2) Comandos

Requisitos: Node.js + npm.

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
```

---

## 2.1) Configuración del proyecto (Vite/TS)

- Alias de imports: en [vite.config.ts](vite.config.ts) existe el alias `@` ⇒ `./src`.
  - Ejemplo (si decidís adoptarlo): `import { Button } from "@/core/components"`.
- TypeScript está en modo `strict` ([tsconfig.json](tsconfig.json)).

> Nota: el repo hoy usa principalmente imports relativos. Si querés que el editor/TS reconozca el alias `@` sin warnings, normalmente se agrega `compilerOptions.paths` en `tsconfig.json`.

---

## 3) Cómo arranca la app (entrypoints)

1. El navegador carga [index.html](index.html) y monta el root.
2. [src/main.tsx](src/main.tsx) renderiza `<App />` envuelto en `<AuthProvider />`.
3. [src/app/App.tsx](src/app/App.tsx) renderiza el router: `<AppRouter />`.
4. [src/routes/router.tsx](src/routes/router.tsx) define las rutas de la SPA.

---

## 4) Autenticación (AuthContext) – cómo funciona hoy

Archivo central: [src/context/AuthContext.tsx](src/context/AuthContext.tsx)

### 4.1) Modelo `AuthUser`

La sesión se representa con:

- `id`, `name`, `email`
- `role` (tipo `UserRole`)
- `profilePicture` (string | null)

### 4.2) `AuthProvider`

Expone el contexto:

- `user: AuthUser | null`
- `loading: boolean`
- `signIn(token: string): Promise<void>`
- `signOut(): void`

### 4.3) `AuthService` (patrón de servicio)

El provider acepta opcionalmente `authService`.

Interfaz:

- `getCurrentUser()`
- `signIn(token)`
- `signOut()`

Implementación actual: **mock** (`createMockAuthService`).

**Persistencia:** usa `localStorage` con la key `meddical:user`.

**Detalle clave:** en modo mock, el “token” que recibe `signIn(token)` se interpreta como **JSON string** de un `AuthUser`.

### 4.4) Cómo se hace el login hoy

Página: [src/modules/authentication/pages/LoginPage.tsx](src/modules/authentication/pages/LoginPage.tsx)

- Muestra botones “quick login”
- Toma un empleado de `mockEmployees`
- Construye un `authUser`
- Ejecuta `signIn(JSON.stringify(authUser))`
- Redirige a `from` (si venías de una ruta protegida) o `/`

---

## 5) Roles y control de acceso

Roles centralizados en: [src/core/constants/roles.ts](src/core/constants/roles.ts)

Hoy existen:

- `admin`
- `doctor`

Reglas de acceso a rutas:

- [src/routes/routes.ts](src/routes/routes.ts) define:
  - `ROUTE_PATHS` (todas las rutas)
  - `ROLE_ROUTE_ACCESS` (qué rutas puede ver cada rol)
  - `ALWAYS_ALLOWED_ROUTES` (excepciones)

### 5.1) ProtectedRoute (la “puerta”)

Archivo: [src/routes/ProtectedRoute.tsx](src/routes/ProtectedRoute.tsx)

Qué hace:

1. Si no hay `user` ⇒ redirige a `/login` y guarda `state.from`.
2. Normaliza el path actual (quita trailing slash).
3. Si la ruta está en `ALWAYS_ALLOWED_ROUTES` ⇒ permite.
4. Si la ruta no está permitida para el rol ⇒ redirige a `/unauthorized`.
5. Si está permitida ⇒ renderiza `<Outlet />`.

**Importante:** el chequeo de permisos acepta prefijos:

- si permitís `/admin/staff-directory`, también quedan permitidas rutas hijas como `/admin/staff-directory/123`.

---

## 6) Router (React Router v7)

Archivo: [src/routes/router.tsx](src/routes/router.tsx)

Estructura (alto nivel):

- `/login` (lazy-loaded)
- Grupo protegido con `<ProtectedRoute />`:
  - `/unauthorized`
  - `<MainLayout />` + children:
    - `/` (Home)
    - rutas admin (staff-directory, vacation manager, etc.)
    - rutas doctor (vacations/doctor, agenda, etc.)
    - placeholders: agenda/patients/appointments/billing/inventory/pathology-results
- `*` ⇒ NotFound

---

## 7) Layouts y navegación

### 7.1) Layout dinámico por rol

Archivo: [src/core/components/layout/MainLayout.tsx](src/core/components/layout/MainLayout.tsx)

- Si `loading` ⇒ retorna `null` (no muestra UI todavía)
- Si no hay `user` ⇒ usa `PublicLayout`
- Si hay `user` ⇒ elige layout según `ROLE_LAYOUT_MAP`:
  - `admin` ⇒ `AdminLayout`
  - `doctor` ⇒ `DoctorLayout`

### 7.2) Layouts concretos

- `AdminLayout`: [src/core/components/layout/AdminLayout.tsx](src/core/components/layout/AdminLayout.tsx)
  - `TopInfoBar` + `AdminNavbar` + `MainContainer` + `Footer`
- `DoctorLayout`: [src/core/components/layout/DoctorLayout.tsx](src/core/components/layout/DoctorLayout.tsx)
  - `TopInfoBar` + `DoctorNavbar` + `MainContainer` + `Footer`
- `PublicLayout`: [src/core/components/layout/PublicLayout.tsx](src/core/components/layout/PublicLayout.tsx)
  - wrapper “vacío” (renderiza children sin chrome)

### 7.3) Navbars

- `AdminNavbar`: [src/core/components/layout/AdminNavbar.tsx](src/core/components/layout/AdminNavbar.tsx)
- `DoctorNavbar`: [src/core/components/layout/DoctorNavbar.tsx](src/core/components/layout/DoctorNavbar.tsx)
- Navbar base: [src/core/components/layout/Navbar.tsx](src/core/components/layout/Navbar.tsx)

Detalles del navbar base:

- Recibe `role`, `userName`, `userAvatar`, `links`
- Marca activo por `location.pathname === link.href`
- Si el label es “Human Resources” activa un dropdown (Staff Directory / Vacation Manager)
- Menú de perfil abre `ProfileDropdown`

### 7.4) ProfileDropdown

Archivo: [src/core/components/layout/ProfileDropdown.tsx](src/core/components/layout/ProfileDropdown.tsx)

- Botón “Request Vacations” navega por rol:
  - `doctor` ⇒ `/vacations/doctor`
  - `admin` ⇒ `/vacations/admin`
  - otros ⇒ `/unauthorized`
- “Sign out” ejecuta `signOut()`

---

## 8) Datos mock (para demo/desarrollo)

Archivo: [src/core/mocks/data.ts](src/core/mocks/data.ts)

Incluye:

- `mockEmployees` (y su `role`)
- `mockPatients`
- `mockAppointments`
- `mockVacationRequests`
- `mockDashboardStats`

Estos datos alimentan:

- login demo (elige un empleado)
- dashboard (Home)

---

## 9) Core UI (componentes semánticos del ERP)

Punto de entrada/export: [src/core/components/index.ts](src/core/components/index.ts)

La idea es que la app y módulos importen desde `core/components` (capa estable), no directamente desde `src/ui/*`.

### 9.1) Layout components (core)

- `MainLayout`, `AdminLayout`, `DoctorLayout`, `PublicLayout`
- `Navbar` + navbars por rol
- `TopInfoBar` (logo + info)
- `Footer`
- `MainContainer` (wrapper del `<main>`)
- `PageHeader` (título + breadcrumbs + imagen)

### 9.2) Feedback components

- `Loader`: [src/core/components/feedback/Loader.tsx](src/core/components/feedback/Loader.tsx)
- `EmptyState`: [src/core/components/feedback/EmptyState.tsx](src/core/components/feedback/EmptyState.tsx)
- `ErrorMessage`: [src/core/components/feedback/ErrorMessage.tsx](src/core/components/feedback/ErrorMessage.tsx)

---

## 10) Módulos (dominios de negocio)

Los módulos viven en `src/modules/<modulo>`.

Cada módulo hoy es principalmente una **página placeholder** para escalar más adelante.

Módulos actuales:

- `authentication`
  - [src/modules/authentication/pages/LoginPage.tsx](src/modules/authentication/pages/LoginPage.tsx)
- `home`
  - [src/modules/home/pages/HomePage.tsx](src/modules/home/pages/HomePage.tsx)
- `staff-directory`
  - [src/modules/staff-directory/pages/StaffDirectoryPage.tsx](src/modules/staff-directory/pages/StaffDirectoryPage.tsx)
- `vacation-admin`
  - [src/modules/vacation-admin/pages/AdminVacationPage.tsx](src/modules/vacation-admin/pages/AdminVacationPage.tsx)
- `vacation-doctor`
  - [src/modules/vacation-doctor/pages/DoctorVacationPage.tsx](src/modules/vacation-doctor/pages/DoctorVacationPage.tsx)
- `vacation-management`
  - [src/modules/vacation-management/pages/VacationManagementPage.tsx](src/modules/vacation-management/pages/VacationManagementPage.tsx)

---

## 11) Estilos (Tailwind v4 + tokens)

Entrada CSS: [src/styles/index.css](src/styles/index.css)

Importa:

- [src/styles/tailwind.css](src/styles/tailwind.css) (`@import "tailwindcss";`)
- [src/styles/theme.css](src/styles/theme.css) (CSS variables/tokens y `@layer base`)
- [src/styles/fonts.css](src/styles/fonts.css) (familias tipográficas y `.font-heading`)

### 11.1) Tokens

`theme.css` define variables como:

- `--primary`, `--background`, `--border`, etc.

Y luego las expone a Tailwind con `@theme inline`.

---

## 12) Librería de UI (src/ui) vs UI “core” (src/ui/core)

En este repo hay dos capas:

### 12.1) `src/ui/*` (primitivos / wrappers Radix)

Estos archivos suelen ser componentes genéricos (estilo design-system “base”).

Listado actual:

- `accordion.tsx`, `alert-dialog.tsx`, `alert.tsx`, `aspect-ratio.tsx`, `avatar.tsx`, `badge.tsx`, `breadcrumb.tsx`, `button.tsx`
- `calendar.tsx`, `card.tsx`, `carousel.tsx`, `chart.tsx`, `checkbox.tsx`, `collapsible.tsx`, `command.tsx`, `context-menu.tsx`
- `dialog.tsx`, `drawer.tsx`, `dropdown-menu.tsx`, `form.tsx`, `hover-card.tsx`, `input-otp.tsx`, `input.tsx`, `label.tsx`
- `menubar.tsx`, `navigation-menu.tsx`, `pagination.tsx`, `popover.tsx`, `progress.tsx`, `radio-group.tsx`, `resizable.tsx`, `scroll-area.tsx`
- `select.tsx`, `separator.tsx`, `sheet.tsx`, `sidebar.tsx`, `skeleton.tsx`, `slider.tsx`, `sonner.tsx`, `switch.tsx`
- `table.tsx`, `tabs.tsx`, `textarea.tsx`, `toggle-group.tsx`, `toggle.tsx`, `tooltip.tsx`
- `use-mobile.ts` (hook), `utils.ts` (helper `cn`)

### 12.2) `src/ui/core/*` (componentes “opinados” del proyecto)

Son componentes con clases/variantes ajustadas al look&feel del ERP:

- `Avatar.tsx`
- `Badge.tsx` (status variants)
- `Button.tsx` (variants `primary|secondary|outline|ghost|light`)
- `Card.tsx`
- `DatePicker.tsx`
- `Divider.tsx`
- `IconButton.tsx`
- `Input.tsx` (soporta `error`)
- `Modal.tsx`
- `SearchInput.tsx`
- `Select.tsx`
- `Table.tsx`
- `Textarea.tsx`

### 12.3) ¿Desde dónde importo como junior?

Regla práctica:

- En páginas y módulos, importá desde `src/core/components`.
  - ejemplo: `import { Button, PageHeader } from "@/core/components";`

Eso mantiene una **API interna estable** y evita dependencias directas a `src/ui/*`.

---

## 13) Hooks

Ubicación: `src/core/hooks/*`

- [src/core/hooks/useDebounce.ts](src/core/hooks/useDebounce.ts): debounce genérico
- [src/core/hooks/useLocalStorage.ts](src/core/hooks/useLocalStorage.ts): estado persistido en localStorage
- [src/core/hooks/index.ts](src/core/hooks/index.ts): barrel exports

---

## 13.1) Constantes y “contractos” del frontend

Ubicación: [src/core/constants/index.ts](src/core/constants/index.ts)

Incluye constantes pensadas para estandarizar el frontend y evitar “strings sueltos”:

- Status enums (empleados, turnos, vacaciones, pacientes)
- `API_ENDPOINTS` (rutas sugeridas del backend; hoy no se consumen todavía)
- `PAGINATION` (defaults)
- `DATE_FORMATS` (formatos display/API)

Roles (tipo base para permisos/layout/navbar): [src/core/constants/roles.ts](src/core/constants/roles.ts)

## 13.2) Theme (tokens en TypeScript)

Ubicación: [src/core/theme/index.ts](src/core/theme/index.ts)

- Exporta un objeto `theme` con colores/typography/spacing.
- Se usa como “fuente” conceptual de tokens; los tokens efectivos en UI están en CSS variables (ver [src/styles/theme.css](src/styles/theme.css)).

## 13.3) Barrel exports del core

Archivo: [src/core/index.ts](src/core/index.ts)

Reexporta theme/components/constants/hooks/mocks para que puedas importar desde `@/core` si lo necesitás.

---

## 14) Páginas del core (errores / demo)

- [src/core/pages/NotFoundPage.tsx](src/core/pages/NotFoundPage.tsx) (404)
- [src/core/pages/UnauthorizedPage.tsx](src/core/pages/UnauthorizedPage.tsx) (403)
- [src/core/pages/ComponentsDemoPage.tsx](src/core/pages/ComponentsDemoPage.tsx) (catálogo visual del design system)

---

## 15) Estructura del proyecto (árbol completo)

### 15.1) Raíz

```text
.
├─ index.html
├─ package.json
├─ package-lock.json
├─ postcss.config.mjs
├─ tsconfig.json
├─ vite.config.ts
├─ README.md
├─ dist/                 (salida de build)
├─ node_modules/         (deps instaladas)
└─ src/
```

### 15.2) `src/`

```text
src/
├─ main.tsx
├─ app/
│  ├─ App.tsx
│  └─ components/
│     └─ figma/
│        └─ ImageWithFallback.tsx
├─ context/
│  └─ AuthContext.tsx
├─ routes/
│  ├─ ProtectedRoute.tsx
│  ├─ router.tsx
│  └─ routes.ts
├─ core/
│  ├─ index.ts
│  ├─ assets/
│  │  └─ Page-Header.jpg
│  ├─ components/
│  │  ├─ index.ts
│  │  ├─ feedback/
│  │  │  ├─ EmptyState.tsx
│  │  │  ├─ ErrorMessage.tsx
│  │  │  └─ Loader.tsx
│  │  └─ layout/
│  │     ├─ AdminLayout.tsx
│  │     ├─ AdminNavbar.tsx
│  │     ├─ DoctorLayout.tsx
│  │     ├─ DoctorNavbar.tsx
│  │     ├─ Footer.tsx
│  │     ├─ MainContainer.tsx
│  │     ├─ MainLayout.tsx
│  │     ├─ Navbar.tsx
│  │     ├─ PageHeader.tsx
│  │     ├─ ProfileDropdown.tsx
│  │     ├─ PublicLayout.tsx
│  │     └─ TopInfoBar.tsx
│  ├─ constants/
│  │  ├─ index.ts
│  │  └─ roles.ts
│  ├─ hooks/
│  │  ├─ index.ts
│  │  ├─ useDebounce.ts
│  │  └─ useLocalStorage.ts
│  ├─ mocks/
│  │  └─ data.ts
│  ├─ pages/
│  │  ├─ ComponentsDemoPage.tsx
│  │  ├─ NotFoundPage.tsx
│  │  └─ UnauthorizedPage.tsx
│  ├─ services/          (vacío hoy; reservado para API clients)
│  ├─ theme/
│  │  └─ index.ts
│  └─ utils/             (vacío hoy)
├─ modules/
│  ├─ authentication/
│  │  └─ pages/
│  │     └─ LoginPage.tsx
│  ├─ home/
│  │  └─ pages/
│  │     └─ HomePage.tsx
│  ├─ staff-directory/
│  │  └─ pages/
│  │     └─ StaffDirectoryPage.tsx
│  ├─ vacation-admin/
│  │  └─ pages/
│  │     └─ AdminVacationPage.tsx
│  ├─ vacation-doctor/
│  │  └─ pages/
│  │     └─ DoctorVacationPage.tsx
│  └─ vacation-management/
│     └─ pages/
│        └─ VacationManagementPage.tsx
├─ shared/
│  └─ utils/             (vacío hoy; reservado para helpers cross-modules)
├─ styles/
│  ├─ fonts.css
│  ├─ index.css
│  ├─ tailwind.css
│  └─ theme.css
└─ ui/
   ├─ (primitivos Radix: *.tsx)
   ├─ core/
   │  ├─ Avatar.tsx
   │  ├─ Badge.tsx
   │  ├─ Button.tsx
   │  ├─ Card.tsx
   │  ├─ DatePicker.tsx
   │  ├─ Divider.tsx
   │  ├─ IconButton.tsx
   │  ├─ Input.tsx
   │  ├─ Modal.tsx
   │  ├─ SearchInput.tsx
   │  ├─ Select.tsx
   │  ├─ Table.tsx
   │  └─ Textarea.tsx
   ├─ use-mobile.ts
   └─ utils.ts
```

---

## 16) Guía para juniors: cómo extender el sistema

### 16.1) Agregar un nuevo módulo

Ejemplo: `patients`.

1. Crear carpeta:

```text
src/modules/patients/pages/PatientsPage.tsx
```

2. Crear la página usando `MainContainer` + `PageHeader`.
3. Agregar ruta en [src/routes/router.tsx](src/routes/router.tsx).
4. Agregar path constante en [src/routes/routes.ts](src/routes/routes.ts).
5. Dar permisos por rol en `ROLE_ROUTE_ACCESS`.
6. (Opcional) agregar link en navbar correspondiente.

### 16.2) Agregar una nueva ruta protegida

Checklist mínima:

- `ROUTE_PATHS`: agregar constante.
- `router.tsx`: agregar `element`.
- `ROLE_ROUTE_ACCESS`: permitir por rol.

### 16.3) Agregar un nuevo rol

Checklist (código actual):

1. Agregar en [src/core/constants/roles.ts](src/core/constants/roles.ts)
2. Actualizar:
   - [src/routes/routes.ts](src/routes/routes.ts) (`ROLE_ROUTE_ACCESS`)
   - [src/core/components/layout/MainLayout.tsx](src/core/components/layout/MainLayout.tsx) (`ROLE_LAYOUT_MAP`)
   - [src/core/components/layout/Navbar.tsx](src/core/components/layout/Navbar.tsx) (`roleConfig`)
3. Si querés quick-login, agregar un empleado con ese rol en [src/core/mocks/data.ts](src/core/mocks/data.ts)

### 16.4) Reemplazar Mock Auth por JWT real

Sugerencia de implementación (sin refactor grande):

- Mantener `AuthContext` como API estable.
- Crear un `JwtAuthService` que implemente `AuthService`.
- Pasarlo al provider:

```tsx
<AuthProvider authService={jwtAuthService}>
  <App />
</AuthProvider>
```

En JWT real, `token` ya no sería JSON: sería el token del backend.

---

## 17) Troubleshooting común

- “Siempre me manda a `/login`”
  - Verificá `localStorage['meddical:user']`.
  - En mock, `signIn()` espera un JSON válido.

- “Me manda a `/unauthorized` aunque estoy logueado”
  - Revisá si la ruta existe en `ROLE_ROUTE_ACCESS` para tu rol.
  - Recordá que el sistema valida por prefijo (rutas hijas también cuentan).

- “No se aplican estilos”
  - Confirmá que [src/styles/index.css](src/styles/index.css) se importa en [src/main.tsx](src/main.tsx).

---

## 18) Documentación

La documentación oficial del frontend vive en este archivo: `README.md`.
