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
4. [src/routes/router.tsx](src/routes/router.tsx) define las rutas de la SPA (`BrowserRouter` + `useRoutes`).

Nota: `AuthProvider` está siendo utilizado (wrapping) en [src/main.tsx](src/main.tsx) 

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
- `signIn(credentials: { email; password }): Promise<AuthUser>`
- `signOut(): Promise<void>`

### 4.3) Servicio de auth actual

Archivo: [src/modules/authentication/services/authModuleService.ts](src/modules/authentication/services/authModuleService.ts)

Integración API asociada:

- [src/modules/authentication/services/authApi.ts](src/modules/authentication/services/authApi.ts)
- [src/core/services/httpClient.ts](src/core/services/httpClient.ts)

- `signIn(email, password)`
- `getCurrentUser()`
- `signOut()`

Cómo funciona hoy:

- El login ya no valida contra [src/core/mocks/data.ts](src/core/mocks/data.ts).
- El frontend envía email y password a través de `authApi.signIn()` usando el cliente HTTP centralizado.
- La implementación priorizada actualmente es el flujo staff.
- El endpoint patient está documentado como parte del contrato backend, pero queda reservado para una fase posterior.
- Tras un login exitoso, el frontend construye una sesión local a partir de la respuesta del backend.

### 4.4) Persistencia actual (`localStorage`)

- `meddical:user`: usuario de sesión
- `meddical:token`: token sintético de sesión
- `meddical:password-reset-requests`: solicitudes/token de reset mock
- `meddical:password-overrides`: contraseñas mock reseteadas por email
- `otp-timer`: estado del contador OTP

Manejo actual del token y Authorization Bearer:

- El backend no entrega hoy un token que el frontend use como token oficial de autenticación.
- El frontend sintetiza `meddical:token` como simulación de una sesión autenticada y para mantener una arquitectura consistente.
- [src/core/services/httpClient.ts](src/core/services/httpClient.ts) agrega automáticamente `Authorization: Bearer <token>` en llamadas protegidas.
- Para endpoints públicos, como login, se utiliza `skipAuth: true` para no enviar el header.
- Esta decisión deja abierto el camino para que backend implemente un token real o un mecanismo de sesión distinto más adelante.

### 4.5) Cómo se hace el login hoy

Páginas:

- [src/modules/authentication/pages/AdminLoginPage.tsx](src/modules/authentication/pages/AdminLoginPage.tsx)
- [src/modules/authentication/pages/PacientLoginPage.tsx](src/modules/authentication/pages/PacientLoginPage.tsx)

Ambas:

- usan `useAuth()` o `useSignIn()`
- pasan por `AuthContext` y `authModuleService`
- terminan delegando la llamada HTTP a `authApi.signIn()`
- redirigen según rol al dashboard correspondiente

Alcance actual del sprint:

- Solo se está implementando B2C (aka. login staff) dentro de la integración actual.
- El endpoint `POST /login/patient` existe en el contrato backend, pero queda en reserva y no representa un error en este momento.

### 4.6) Contrato de autenticación con backend (Story 1.1)

El contrato funcional completo y el estado de integración actual de endpoints se documentan en:

- [AUTH_ENDPOINT_INTEGRATION.txt](AUTH_ENDPOINT_INTEGRATION.txt)

Resumen breve:

- Login separado por tipo de usuario: `POST /login/patient` y `POST /login/staff`.
- Actualmente se prioriza solo el flujo staff; el endpoint patient queda reservado.
- Flujos de recuperación/registro: `POST /forgot_password`, `POST /register`, `POST /verify`, `POST /reset_password`, `POST /register_user`.
- Respuesta de login exitosa con `id`, `name` y `role`; errores con `success: false` y `message`.
- Integración frontend con cliente HTTP centralizado, sesión local (`meddical:user`, `meddical:token`) y uso automático de `Authorization: Bearer` para rutas protegidas.

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

1. Si no hay `user` ⇒ redirige a `ROUTE_PATHS.LOGIN` (hoy `/admin-login`) y guarda `state.from`.
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

- `/admin-login` (login admin/doctor)
- `/patient-login`
- `/sign-up`
- `/forgot-password`
- `/reset-password`
- `/otp-verification`
- Grupo protegido con `<ProtectedRoute />`:
  - `/unauthorized`
  - `/admin-dashboard`
  - `/doctor-dashboard`
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
- forgot/reset password mock

---

## 8.1) Flujo Forgot/Reset Password (mock)

Servicios y hooks:

- [src/modules/authentication/services/forgotPasswordService.ts](src/modules/authentication/services/forgotPasswordService.ts)
- [src/modules/authentication/hooks/useForgotPassword.ts](src/modules/authentication/hooks/useForgotPassword.ts)
- [src/modules/authentication/hooks/useResetPassword.ts](src/modules/authentication/hooks/useResetPassword.ts)

Flujo actual:

1. `ForgotPasswordPage` valida email y llama `requestPasswordReset(email, from)`
2. Si el email existe en mock, se genera token temporal (TTL 15 min) y se guarda en `meddical:password-reset-requests`
3. UI muestra botón de test `Go Set New Password` (placeholder del link por gmail real)
4. `ResetPasswordPage` valida token con `validateResetToken(token)`
5. Si es válido, permite setear nueva contraseña
6. `completePasswordReset(token, password)` guarda override en `meddical:password-overrides` y marca token como usado
7. Redirección automática al login correspondiente tras éxito

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
  - pages:
    - [src/modules/authentication/pages/AdminLoginPage.tsx](src/modules/authentication/pages/AdminLoginPage.tsx)
    - [src/modules/authentication/pages/PacientLoginPage.tsx](src/modules/authentication/pages/PacientLoginPage.tsx)
    - [src/modules/authentication/pages/SignUpPage.tsx](src/modules/authentication/pages/SignUpPage.tsx)
    - [src/modules/authentication/pages/ForgotPasswordPage.tsx](src/modules/authentication/pages/ForgotPasswordPage.tsx)
    - [src/modules/authentication/pages/ResetPasswordPage.tsx](src/modules/authentication/pages/ResetPasswordPage.tsx)
    - [src/modules/authentication/pages/OtpVerification.tsx](src/modules/authentication/pages/OtpVerification.tsx)
    - [src/modules/authentication/pages/AdminDashboard.tsx](src/modules/authentication/pages/AdminDashboard.tsx)
    - [src/modules/authentication/pages/DoctorDashboard.tsx](src/modules/authentication/pages/DoctorDashboard.tsx)
  - components:
    - [src/modules/authentication/components/LoginCard.tsx](src/modules/authentication/components/LoginCard.tsx)
    - [src/modules/authentication/components/PasswordInputWithEye.tsx](src/modules/authentication/components/PasswordInputWithEye.tsx)
    - [src/modules/authentication/components/themed-container.tsx](src/modules/authentication/components/themed-container.tsx)
    - [src/modules/authentication/components/BlurredBackground.tsx](src/modules/authentication/components/BlurredBackground.tsx)
  - hooks:
    - [src/modules/authentication/hooks/useSignIn.ts](src/modules/authentication/hooks/useSignIn.ts)
    - [src/modules/authentication/hooks/useSignOut.ts](src/modules/authentication/hooks/useSignOut.ts)
    - [src/modules/authentication/hooks/useForgotPassword.ts](src/modules/authentication/hooks/useForgotPassword.ts)
    - [src/modules/authentication/hooks/useResetPassword.ts](src/modules/authentication/hooks/useResetPassword.ts)
  - services:
    - [src/modules/authentication/services/authModuleService.ts](src/modules/authentication/services/authModuleService.ts)
    - [src/modules/authentication/services/forgotPasswordService.ts](src/modules/authentication/services/forgotPasswordService.ts)
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
│  │  ├─ assets/
│  │  │  ├─ auth_bg_image.png
│  │  │  ├─ auth_eyeIcon_image.png
│  │  │  └─ auth_side_image.png
│  │  ├─ components/
│  │  │  ├─ BlurredBackground.tsx
│  │  │  ├─ LoginCard.tsx
│  │  │  ├─ PasswordInputWithEye.tsx
│  │  │  └─ themed-container.tsx
│  │  ├─ hooks/
│  │  │  ├─ useForgotPassword.ts
│  │  │  ├─ useResetPassword.ts
│  │  │  ├─ useSignIn.ts
│  │  │  └─ useSignOut.ts
│  │  ├─ pages/
│  │  │  ├─ AdminDashboard.tsx
│  │  │  ├─ AdminLoginPage.tsx
│  │  │  ├─ Auth_TestPage.tsx
│  │  │  ├─ DoctorDashboard.tsx
│  │  │  ├─ ForgotPasswordPage.tsx
│  │  │  ├─ OtpVerification.tsx
│  │  │  ├─ PacientLoginPage.tsx
│  │  │  ├─ ResetPasswordPage.tsx
│  │  │  └─ SignUpPage.tsx
│  │  └─ services/
│  │     ├─ authModuleService.ts
│  │     └─ forgotPasswordService.ts
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
- Reemplazar llamadas mock en:
  - [src/modules/authentication/services/authModuleService.ts](src/modules/authentication/services/authModuleService.ts)
  - [src/modules/authentication/services/forgotPasswordService.ts](src/modules/authentication/services/forgotPasswordService.ts)
- Mantener las firmas actuales del contexto:
  - `signIn({ email, password })`
  - `signOut()`

Ejemplo orientativo:

```tsx
const response = await api.post("/auth/login", credentials);
localStorage.setItem("meddical:token", response.token);
localStorage.setItem("meddical:user", JSON.stringify(response.user));
```

En JWT real, la validación/refresh del token y recuperación de sesión debe venir del backend, no de `mockEmployees`/`localStorage` como fuente de verdad principal.

---

## 17) Troubleshooting común

- “Siempre me manda a `/admin-login`”
  - Verificá `localStorage['meddical:user']`.
  - Revisá que `AuthContext` termine de cargar (`loading === false`) antes de evaluar guards.

- “Me manda a `/unauthorized` aunque estoy logueado”
  - Revisá si la ruta existe en `ROLE_ROUTE_ACCESS` para tu rol.
  - Recordá que el sistema valida por prefijo (rutas hijas también cuentan).

- “Reseteé contraseña pero no puedo loguear”
  - Verificá `localStorage['meddical:password-overrides']`.
  - Confirmá que el email del login coincide con el email del reset (normalizado en minúsculas).

- “No se aplican estilos”
  - Confirmá que [src/styles/index.css](src/styles/index.css) se importa en [src/main.tsx](src/main.tsx).

---

## 18) Documentación

La documentación oficial del frontend vive en este archivo: `README.md`.

...
