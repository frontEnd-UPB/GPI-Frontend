# Documentacion de Implementacion de Stories

Este documento describe el estado actual de la rama para las funcionalidades:

- FE-140
- FE-164
- FE-215
- FE-319

Tambien agrega referencias a otras stories relacionadas cuando ayudan a entender la implementacion real de esta rama, especialmente:

- FE-141: Authentication State Management Implementation. Manages auth state via AuthContext. FE-140 depends on it to persist and restore the logged-in user.
- FE-143: Logout Flow Implementation. Implements logout. Complements FE-140 by clearing user state and storage.
- FE-212: Forgot Password UI. Designed the Forgot Password screen layout. FE-319 built on top of it functionally.
- FE-214: OTP Verification UI. Designed the OTP Verification screen layout. FE-319 wired it into the recovery flow.
- FE-165: Implement Form Container with Welcome Image. Subtask that produced ThemedContainer (the two-column layout with welcome image). Directly consumed by FE-164.
- FE-135: Authentication UI Implementation. Epic covering the overall authentication UI. Parent context for FE-164, FE-212, FE-214, FE-215.
- FE-139: Authentication Functional Flow. Epic covering the authentication functional flow. Parent context for FE-140, FE-141, FE-143.

## Configuracion del entorno

### 1. Instalar Mockoon y enviroment

Mockoon se utiliza en esta rama para simular el backend HTTP del flujo de autenticacion de staff. No existe un archivo .md en documentation/Jira Issues dedicado exclusivamente a Mockoon; en la practica, esta integracion extiende principalmente FE-140 y se relaciona con FE-141.

Pasos:

1. Ir a https://mockoon.com.
2. Descargar la version para Windows.
3. Instalar la aplicacion.
4. Abrir Mockoon.
5. Seleccionar File > Open environment.
6. Abrir src/core/mocks/mockoon.json.
7. Verificar que el environment cargado tenga puerto 3001.

### 2. Ejecutar el backend simulado
Pasos:

1. Presionar Start server en Mockoon.
2. Confirmar que el servidor quede levantado en http://localhost:3001.
3. Verificar alguno de estos endpoints:

- POST /api/auth/login
- GET /api/employees/:id

### 3. Aclaracion importante sobre esta rama (Sprint 4 Front end - 16/03/26)

En esta rama no todo el modulo de autenticacion usa Mockoon.

- El login de staff y la recuperacion del usuario actual usan authApi + httpClient + endpoints HTTP mockeados en Mockoon. Esto cae dentro de FE-140 y se apoya en FE-141.
- El flujo Forgot Password, OTP y Reset Password sigue usando mockBackendAuth + localStorage/sessionStorage. Eso afecta FE-319, FE-214 y FE-215.
- PacientLoginPage sigue siendo una demo visual y todavia no consume authApi ni Mockoon. **Tampoco se planea todavía implementarlo.**

## Mapa general de stories y relacion entre ellas

### FE-140 - Auth Service Integration

Stories relacionadas:

- FE-141: manejo de estado global con AuthContext
- FE-143: cierre de sesion
- FE-139: flujo funcional de autenticacion

Descripcion actualizada:

La story original hablaba de un authService mockeado sin fetch real a backend. En esta rama la implementacion evoluciono: se mantiene la arquitectura por capas, pero el servicio ya hace llamadas HTTP a traves de authApi y httpClient contra un backend simulado con Mockoon.

- src/modules/authentication/services/authModuleService.ts
- src/context/AuthContext.tsx

Como el codigo cumple los Acceptance Criteria:

1. Existe un servicio dentro del modulo: authModuleService sigue siendo la capa de orquestacion principal.
2. La UI no contiene logica directa de autenticacion: AdminLoginPage usa useSignIn y AuthContext; no llama fetch directamente. (ver cambios)
3. Se respeta la separacion por capas:

UI
-> useSignIn / useAuth
-> authModuleService
-> authApi (ver cambios)
-> httpClient (ver cambios)
-> Mockoon

4. La sesion se persiste en localStorage mediante AUTH_STORAGE_KEYS.USER y AUTH_STORAGE_KEYS.TOKEN.
5. getCurrentUser refresca el usuario desde /api/employees/:id y conserva fallback local ante errores transitorios.

Notas sobre cambios respecto a la story original:

- Cambio 1: ya no se cumple literalmente el criterio de no usar fetch real. Ahora si hay fetch, pero contra un backend mockeado en Mockoon. La intencion funcional de la story se conserva, pero la implementacion cambio.
- Cambio 2: authModuleService ya no depende de mockBackendAuth para login. Ahora usa authApi.signIn y luego authApi.getCurrentUserById para enriquecer el perfil.
- Cambio 3: el token sigue siendo sintetico, pero ahora se genera desde el resultado HTTP y se usa como Authorization Bearer a traves de httpClient.

Flujo actual:

1. AdminLoginPage envia email y password.
2. useSignIn delega en AuthContext.
3. AuthContext llama authModuleService.signIn.
4. authModuleService llama authApi.signIn a POST /api/auth/login.
5. Si login es valido, intenta authApi.getCurrentUserById en GET /api/employees/:id.
6. Guarda usuario y token en localStorage.

Observaciones de esta rama:

- LoginPage no es el flujo principal de FE-140 en esta rama. Es una pantalla demo separada y ademas hoy llama signIn con una firma desalineada respecto a AuthContext.
- El flujo real y consistente de FE-140 esta en AdminLoginPage + useSignIn + AuthContext + authModuleService + authApi.

### FE-164 - Shared Authentication Components

Stories relacionadas:

- FE-165: reutilizacion del contenedor con imagen lateral
- FE-212: Forgot Password UI 
- FE-214: OTP Verification UI
- FE-215: Reset Password UI
- FE-135: epic de UI de autenticacion

Descripcion actualizada:

La story pide componentes compartidos reutilizables en varias pantallas del modulo authentication. En esta rama eso si se cumple, aunque el conjunto real de consumidores es mas preciso que en el documento anterior.

Archivos involucrados:

- src/modules/authentication/components/BlurredBackground.tsx
- src/modules/authentication/components/Container.tsx
- src/modules/authentication/components/PasswordInputWithEye.tsx
- src/modules/authentication/components/LoginCard.tsx
- src/modules/authentication/pages/AdminLoginPage.tsx
- src/modules/authentication/pages/ForgotPasswordPage.tsx
- src/modules/authentication/pages/OtpVerification.tsx
- src/modules/authentication/pages/ResetPasswordPage.tsx
- src/modules/authentication/pages/PacientLoginPage.tsx
- src/modules/authentication/pages/SignUpPage.tsx

Como el codigo cumple los Acceptance Criteria:

1. BlurredBackground se reutiliza en AdminLoginPage, ForgotPasswordPage, OtpVerification, ResetPasswordPage, PacientLoginPage y SignUpPage.
2. ThemedContainer se reutiliza en esas mismas pantallas y centraliza el layout visual.
3. PasswordInputWithEye se reutiliza en AdminLoginPage, PacientLoginPage, ResetPasswordPage y SignUpPage.
4. LoginCard se reutiliza en AdminLoginPage como selector rapido de credenciales demo.

Notas sobre cambios respecto a la story original:

- Cambio 1: el componente Container se llama ThemedContainer y concentra la solucion que FE-165 pedia como contenedor reutilizable con imagen.
- Cambio 2: LoginCard no es transversal a todas las pantallas de login. En esta rama su uso real esta concentrado en AdminLoginPage.
- Cambio 3: PasswordInputWithEye ya no pertenece solo a reset o signup; tambien se usa en pantallas de login del modulo.

Resumen por componente:

- BlurredBackground: base visual compartida del modulo. Relacionado con FE-212, FE-214 y FE-215.
- ThemedContainer: contenedor reutilizable con imagen lateral. Relacionado directamente con FE-165.
- PasswordInputWithEye: input reusable para password con toggle. Relacionado con FE-215 y tambien con formularios de login.
- LoginCard: selector de usuarios mock para acelerar pruebas en AdminLoginPage. Relacionado operativamente con FE-140.

### FE-319 - Authentication Forgot Password implementation

Stories relacionadas:

- FE-212: maquetacion base de la pantalla Forgot Password
- FE-214: maquetacion base de OTP Verification
- FE-215: pantalla de Reset Password
- FE-164: componentes compartidos usados en todo el flujo

Descripcion actualizada:

La story FE-319 ya no es solo un formulario. En esta rama cubre un flujo completo de recuperacion de password, pero sigue funcionando con mockBackendAuth en lugar de Mockoon.

Archivos involucrados:

- src/modules/authentication/pages/ForgotPasswordPage.tsx
- src/modules/authentication/pages/OtpVerification.tsx
- src/modules/authentication/pages/ResetPasswordPage.tsx
- src/modules/authentication/hooks/useForgotPassword.ts
- src/modules/authentication/hooks/useResetPassword.ts
- src/modules/authentication/services/forgotPasswordService.ts
- src/core/services/mockBackendAuth.ts
- src/core/mocks/data.ts

Como el codigo cumple los Acceptance Criteria:

1. ForgotPasswordPage valida que el email no este vacio y tenga formato basico.
2. requestReset delega en forgotPasswordService.
3. forgotPasswordService delega en mockBackendAuth.requestPasswordReset.
4. Si existe token, la UI navega a OTP Verification y marca el flujo activo en sessionStorage.
5. OtpVerification valida codigo numerico de 4 digitos y navega a ResetPasswordPage si coincide con mockOtpCode.
6. ResetPasswordPage valida token, valida password nueva y confirma el cambio.

Notas sobre cambios respecto a la story original:

- Cambio 1: la story original hablaba de datos mock y de una confirmacion simple. La implementacion actual agrega OTP y reset real dentro del mock backend local.
- Cambio 2: no usa Mockoon. Aunque el proyecto ya tiene Mockoon para login de staff, FE-319 sigue apoyandose en mockBackendAuth.
- Cambio 3: la respuesta para correo inexistente es neutra por seguridad, no un error visible que revele existencia de cuenta.

Flujo actual:

1. ForgotPasswordPage envia email.
2. useForgotPassword llama forgotPasswordService.
3. forgotPasswordService usa mockBackendAuth.requestPasswordReset.
4. Si se obtiene token, se navega a OtpVerification.
5. OtpVerification valida mockOtpCode.
6. ResetPasswordPage llama useResetPassword.
7. useResetPassword usa forgotPasswordService.completePasswordReset.

### FE-215 - Reset Password UI

Stories relacionadas:

- FE-319: implementacion funcional del recovery flow completo
- FE-164: uso de componentes compartidos
- FE-214: la pantalla OTP anterior dentro del flujo

Descripcion actualizada:

FE-215 sigue cumpliendo como story de UI, pero en esta rama la pantalla ya no esta aislada: esta conectada al flujo funcional de recuperacion y depende de validacion de token y de submit real al mock backend local.

- src/modules/authentication/pages/ResetPasswordPage.tsx

Como el codigo cumple los Acceptance Criteria:

1. Mantiene la estructura TopInfoBar + Footer + BlurredBackground + ThemedContainer.
2. Muestra titulo y subtitulo de reset.
3. Usa dos campos de password con PasswordInputWithEye.
4. Mantiene consistencia visual con el resto del modulo.
5. Agrega validaciones funcionales reales:

- password requerida
- confirmacion requerida
- coincidencia entre ambos campos
- largo minimo de 12 caracteres

Notas sobre cambios respecto a la story original:

- Cambio 1: FE-215 ya no es solo maquetacion. La pantalla valida token y dispara cambio real de password dentro del mock backend local.
- Cambio 2: depende directamente de FE-319 para su valor funcional.
- Cambio 3: no usa Mockoon en esta rama; usa forgotPasswordService + mockBackendAuth.

### FE-141 - Authentication State Management Implementation

Relacion con las stories de QA:

- FE-140 depende de FE-141 para mantener usuario autenticado.
- FE-143 depende de FE-141 para limpiar el contexto correctamente.

Archivos involucrados:

- src/context/AuthContext.tsx
- src/modules/authentication/services/authModuleService.ts
- src/core/types/auth.ts

Resumen:

AuthContext restaura sesion al montar la app mediante authModuleService.getCurrentUser, expone signIn y signOut, y mantiene el estado user/loading para el resto de la UI.

Nota relevante para esta rama:

- FE-141 originalmente decia que no habia manejo real de tokens. En la rama actual sigue sin haber JWT real, pero si existe manejo operativo de token sintetico en localStorage y en Authorization header mediante httpClient. Conviene entenderlo como una evolucion de la implementacion, no como seguridad real completa.

### FE-143 - Logout Flow Implementation

Relacion con las stories de QA:

- Complementa FE-140.
- Se ejecuta sobre el mismo estado gestionado por FE-141.

Archivos involucrados:

- src/context/AuthContext.tsx
- src/modules/authentication/services/authModuleService.ts

Como se cumple:

1. Existe accion de logout en AuthContext.
2. authModuleService.signOut limpia AUTH_STORAGE_KEYS.USER y AUTH_STORAGE_KEYS.TOKEN.
3. AuthContext limpia user del contexto.
4. Las rutas protegidas pueden reaccionar a la perdida de sesion.

## Diferencias clave entre esta rama y la documentacion anterior

La documentacion anterior quedo desactualizada respecto a esta rama en estos puntos:

1. Mezclaba Mockoon como si todo el modulo ya dependiera de endpoints HTTP, y no es asi.
2. No distinguia entre LoginPage demo y AdminLoginPage, que hoy es el flujo real integrado con AuthContext y authApi.
3. Atribuia algunos componentes a paginas que en esta rama ya no los usan o no los usan del mismo modo.
4. No dejaba claro que FE-319, FE-214 y FE-215 siguen montados sobre mockBackendAuth y no sobre Mockoon.

## Resumen ejecutivo para QA

Si QA va a probar esta rama, el criterio correcto es:

1. Para login de staff, probar AdminLoginPage con Mockoon levantado en puerto 3001. Historias involucradas: FE-140, FE-141 y FE-143.
2. Para recuperacion de password, no hace falta Mockoon. Historias involucradas: FE-319, FE-214, FE-215 y FE-164.
3. Para componentes compartidos, revisar consistencia visual y reuso en las paginas del modulo. Historia involucrada: FE-164, con relacion directa a FE-165.

## Nota sobre stories sin ticket especifico para Mockoon

En documentation/Jira Issues no aparece una story dedicada exclusivamente a la introduccion de Mockoon. Por eso, cuando este documento menciona Mockoon, se lo referencia como parte de la implementacion actual de FE-140 y su integracion con FE-141, en lugar de asignarle un ticket inexistente.

