# Eva Examen Componentes

Aplicación web construida con **React + Vite** que implementa catálogo de productos, carrito persistente por usuario, autenticación, formulario con validaciones y publicación web/móvil. Este repositorio está preparado para demostrar de forma clara la integración de componentes, estado, eventos, rutas y servicios externos.

---

## 1) Objetivo del proyecto

Entregar una versión final funcional de una SPA (Single Page Application) que cubra de punta a punta:

- Renderizado de componentes con JSX.
- Arquitectura de componentes padre/hijo.
- Comunicación entre componentes vía `props` y callbacks.
- Manejo de estado local y de clase (`this.setState`).
- Ciclo de vida de componentes de clase.
- Formularios con validaciones en cliente.
- Enrutamiento con y sin parámetros.
- Integración opcional/extendida con Firebase (Auth, Firestore y Storage).
- Estilos con Bootstrap.
- Flujo de build para despliegue web y empaquetado móvil Android (Cordova).

---

## 2) Tecnologías utilizadas

- **React 19**
- **Vite 7**
- **React Router DOM 7**
- **Bootstrap 5**
- **Firebase 12** (Auth, Firestore, Storage)
- **simple-react-validator**
- **Cordova + cordova-android**

Scripts relevantes (`package.json`):

- `npm run dev` → desarrollo local
- `npm run test` → pruebas de lógica
- `npm run build` → build de producción web (`dist/`)
- `npm run preview` → vista local del build
- `npm run build:mobile` → build hacia `www/` para Cordova
- `npm run mobile:add-android` → agrega plataforma Android
- `npm run mobile:prepare` → prepara assets/webview Android
- `npm run mobile:build-debug` → APK debug
- `npm run mobile:build-release` → APK release

---

## 3) Estructura del proyecto

```text
src/
  components/
    Header.jsx
    ProductCatalog.jsx
    ProductCard.jsx
    CartSummary.jsx
    ProductDetail.jsx
    RegistrationForm.jsx
    LoginForm.jsx
    StaticFooter.jsx
  context/
    AuthContext.jsx
  hooks/
    useProducts.js
  services/
    authService.js
    productService.js
    cartService.js
    cartLogic.js
    registrationService.js
  data/
    products.js
  App.jsx
  main.jsx
  firebase.js
  firebaseConfig.js
  styles.css

tests/
  cartLogic.test.js

docs/
  mobile.md
```

---

## 4) Cobertura funcional por módulos

### 4.1 Catálogo y carrito

- **Componente padre de clase:** `ProductCatalog`.
- **Componentes hijos:** tarjetas de producto (`ProductCard`) y resumen (`CartSummary`).
- **Listado dinámico:** render con `map()` sobre arreglo de productos.
- **Comunicación padre-hijo:** el padre pasa datos y handlers por `props`.
- **Comunicación hijo-padre:** los hijos notifican eventos (agregar/quitar/cambiar cantidad) mediante callbacks.
- **Estado del carrito:** controlado en el padre con `this.setState(...)`.
- **Persistencia:** carrito asociado al usuario autenticado en Firestore (`carritos/{uid}`).
- **Reglas de negocio:** límite por stock, incremento/decremento seguro y vaciado del carrito.

### 4.2 Ciclo de vida

Dentro del componente de clase del catálogo se usan:

- `componentDidMount` para carga inicial y título de documento.
- `componentDidUpdate` para sincronización cuando cambia el usuario y actualización dinámica del título con el total del carrito.
- `componentWillUnmount` para limpiar suscripciones de Firestore.

### 4.3 Formulario de registro + validaciones

`RegistrationForm` implementa:

- Campos personales y de contacto.
- Validación de obligatorios, formato email, mínimos de caracteres.
- Regla personalizada para teléfono chileno.
- Validación de tamaño de archivo (`<= 2MB`) para imagen/comprobante.
- Envío a servicio de registro con fallback local cuando Firebase no está configurado.

### 4.4 Autenticación

- Pantalla `LoginForm` para inicio de sesión con email/clave.
- `AuthContext` para exponer estado de sesión y operaciones (`signIn`, `signOut`).
- Header reactivo que muestra usuario autenticado y permite cerrar sesión.

### 4.5 Enrutamiento

Configurado en `App.jsx` con `react-router-dom`:

- `/` → catálogo principal
- `/producto/:id` → detalle con parámetro de ruta
- `/registro` → formulario de registro
- `/login` → inicio de sesión

Se usa `lazy()` + `Suspense` para carga diferida de vistas secundarias.

### 4.6 Estilo e interfaz

- Maquetado y componentes visuales con **Bootstrap**.
- Estilos adicionales en `src/styles.css`.
- Diseño responsive con grilla y utilidades de Bootstrap.

### 4.7 Datos de productos

- Fuente principal opcional: colección `productos` en Firestore.
- Fallback automático: `src/data/products.js` cuando no existe configuración Firebase o falla la lectura remota.

---

## 5) Requisitos previos

- Node.js 20+ recomendado
- npm 10+
- Cuenta de Firebase (si se usará backend real)
- (Opcional móvil) Android Studio + SDK + Java + Gradle + Cordova

---

## 6) Instalación y ejecución local

```bash
npm install
npm run dev
```

Aplicación disponible normalmente en el host local configurado por Vite.

---

## 7) Variables de entorno

Crear un archivo `.env` en la raíz del proyecto con:

```bash
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
```

### Modo demo (sin Firebase)

Si faltan variables, la app sigue funcionando en modo demostración:

- Registro guardado localmente.
- Catálogo cargado desde datos locales.
- Funcionalidades dependientes de backend real se degradan de forma controlada.

---

## 8) Configuración de Firebase (modo completo)

En Firebase Console:

1. **Authentication**
   - Habilitar proveedor **Email/Password**.

2. **Firestore Database**
   - Colección `clientes` para registros del formulario.
   - Colección `productos` para catálogo remoto (campos sugeridos: `name`, `category`, `price`, `stock`, `image`, `description`).
   - Documento de carrito por usuario en `carritos/{uid}` con items `{ productId, quantity, nameSnapshot, priceSnapshot }`.

3. **Storage**
   - Bucket habilitado para archivos del formulario (imagen/comprobante).

---

## 9) Flujo recomendado de uso

1. Ingresar al catálogo (`/`) y revisar productos.
2. Crear cuenta en `/registro`.
3. Iniciar sesión en `/login`.
4. Agregar productos al carrito y ajustar cantidades.
5. Verificar persistencia del carrito por usuario autenticado.
6. Revisar detalle de producto en `/producto/:id`.

---

## 10) Pruebas y calidad

Ejecutar pruebas unitarias de lógica:

```bash
npm run test
```

Las pruebas actuales cubren reglas críticas de carrito (`tests/cartLogic.test.js`):

- Agregado de productos.
- Límites por stock.
- Eliminación de ítems.
- Reajuste de cantidades.

---

## 11) Build y despliegue web

### Build producción

```bash
npm run build
```

Genera carpeta `dist/` lista para publicar.

### Netlify

El repositorio incluye `netlify.toml` para publicar build SPA y resolver rutas del cliente.

Flujo:

1. Subir repositorio a GitHub.
2. Conectar repo en Netlify.
3. Configurar variables de entorno (`VITE_*`) en Netlify.
4. Desplegar.

---

## 12) Empaquetado Android (Cordova)

Existe documentación técnica paso a paso en:

- [`docs/mobile.md`](docs/mobile.md)

Comandos típicos:

```bash
npm run build:mobile
npm run mobile:add-android
npm run mobile:prepare
npm run mobile:build-debug
npm run mobile:build-release
```

Incluye build para APK debug/release y firma del APK release.

---
