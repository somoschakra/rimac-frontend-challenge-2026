# Rímac — Seguro Salud Flexible

Aplicación web de cotización de seguros de salud. Permite ingresar datos, comparar planes y consultar un resumen de la cotización, con diseño adaptable a desktop y mobile.

## Requisitos

- Node.js compatible con Vite 8
- npm

## Inicio rápido

```bash
npm ci
npm run dev
```

Vite muestra en la terminal la dirección local de la aplicación.

## Comandos

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Inicia el servidor de desarrollo. |
| `npm run build` | Ejecuta el chequeo de TypeScript y genera la versión de producción en `dist/`. |
| `npm run preview` | Sirve localmente la versión generada. |
| `npm run lint` | Ejecuta ESLint. |

## Flujo de cotización

1. **Inicio:** se validan el documento, el celular y los consentimientos.
2. **Planes:** se obtienen primero los datos del usuario y, al completar esa solicitud, los planes. Se muestran únicamente los planes compatibles con la edad y después de elegir para quién se cotiza.
3. **Resumen:** muestra los datos del usuario, el plan elegido y su precio. Cotizar para otra persona aplica un descuento del 5 %.

Al comenzar una cotización nueva se limpian las selecciones anteriores. Al volver del resumen a los planes, se conserva la modalidad y se desmarca el plan.

## Estructura

```text
src/
├── adapters/     Normalización de datos externos
├── api/          Solicitudes al servicio de cotización
├── components/   Header, selector de documento y botones compartidos
├── domain/       Validaciones y reglas de precio
├── store/        Estado persistido del flujo
├── styles/       Tokens globales de diseño
└── views/        Pantallas de planes y resumen
```

## Servicio de datos

La aplicación consume el servicio público:

- `GET https://rimac-front-end-challenge.netlify.app/api/user.json`
- `GET https://rimac-front-end-challenge.netlify.app/api/plans.json`

TanStack Query gestiona las solicitudes y su caché. El estado del flujo se conserva con Zustand en `localStorage`.
