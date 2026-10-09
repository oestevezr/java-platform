# Java · Ruta de aprendizaje

Scaffold de autoformación para NETEC ASO/APX basado en Java 8–11. Ruta flexible con foco recomendado en 3 semanas. Rama de trabajo: orlando-proposal.

## Ejecutar localmente

Requiere Node 22.12+ y npm. Desde la raíz:

```powershell
npm ci
npm run dev:api
```

En otra terminal, inicia el frontend de prueba:

```powershell
$env:VITE_LOCAL_DEMO = "true"
$env:VITE_API_URL = "http://127.0.0.1:3001"
npm run dev -- --host 127.0.0.1
```

Abre http://127.0.0.1:5173. Los botones de candidato/administrador son exclusivos de desarrollo. La API local escucha solo loopback y sus datos se pierden al reiniciar; no utiliza AWS. El bundle Lambda no incluye local.ts. Un build de producción ignora el acceso local aunque VITE_LOCAL_DEMO esté activo.

## Estructura

- apps/web: React/Vite, CSS Modules, hash router, MDX y caché IndexedDB por cuenta.
- apps/api: Lambda TypeScript, permisos y repositorio DynamoDB. API local separada para probar sin nube.
- packages/contracts: esquemas Zod y contratos públicos.
- content: objetivos/profil NETEC provisionales, recursos y banco privado vacío.
- infra/template.yaml: scaffold SAM/CloudFormation en sintaxis JSON válida de YAML.
- tests: contratos, autorización, evaluación exacta, caché y navegador.
- openspec: propuesta, diseño y seguimiento de implementación.

## Estado real del scaffold

La navegación, actividad MDX de muestra, cambio de duración, APIs de lectura de progreso/guardado de plan y directorio administrativo están conectados localmente. No hay candidatos ni resultados reales de muestra inventados. Ambas vistas usan el mismo repositorio; GET /me/progress entrega solo estadísticas personales y /admin/candidates entrega campos internos exclusivos de administración.

Pendiente: onboarding/materialización de perfiles DynamoDB/directorio, flujo completo de intentos y resultados, estadísticas calculadas desde ejercicios, sincronización offline de respuestas, diagnóstico, repetición espaciada, temario documentado, banco de 600 preguntas, validación JDK y pruebas de Cognito en AWS. Los exámenes no pueden iniciarse con el banco vacío. La evaluación pura existe como base del motor, no como un examen completo.

## Comprobar

```powershell
npm run check
npm run content:validate
npm run infra:validate
npx playwright install chromium
npm run test:e2e
```

Los tests editoriales usan fixtures independientes, no preguntas publicadas. El validador de contenido no acredita todavía cobertura ni revisión JDK. infra:validate comprueba estructura/seguridad mínima local, no es validación SAM completa.

## Configuración de nube

Copiar apps/web/.env.example a apps/web/.env.local y completar las salidas del stack. Las variables VITE son públicas: nunca introducir claves AWS ni secretos. Cognito usa code + PKCE; HTTP API exige JWT con scopes learning/read y learning/write. El grupo administrator se asigna por operador, nunca por el cliente. CORS y callback solo apuntan al dominio CloudFront del stack.

La plantilla usa Node 22 en Lambda, S3 privado/OAC, DynamoDB on-demand con throughput limitado, retención de tabla/buckets, concurrencia Lambda limitada y logs con retención corta. Incluye los recursos para cuentas, pero no despliega ni publica contenido interno. Registro por invitación es el valor conservador de la plantilla; confirmar modalidad y audiencia antes de activar.

Con AWS SAM instalado, las comprobaciones siguientes no despliegan:

```powershell
npm run build
sam validate --lint --template-file infra/template.yaml
sam build --template-file infra/template.yaml
```

Despliegue posterior: revisar uso esperado, región, elegibilidad, créditos/vencimiento, precios de cada servicio y cambio de infraestructura; solicitar despliegue explícitamente. Los límites y alertas no garantizan factura cero. No ejecutar sam deploy durante scaffold. En caso de despliegue autorizado, revisar change set, guardar parámetros/salidas y subir solo apps/web/dist al bucket del frontend. Mantener index.html con TTL corto y assets con hash inmutables.

El rollback conserva progreso: tabla y buckets tienen Retain. Un rollback del bundle debe mantener compatibilidad de datos; nunca eliminar tablas para corregir una versión. Los documentos en content/sources están ignorados por Git y no entran al frontend.

## Datos de referencia

Ver content/README.md. Aportar documentos incompletos no requiere completar campos inventados: registrar pendientes y su procedencia. El perfil NETEC tiene parámetros null hasta confirmarlos. OCA/OCP son referencia educativa, no el examen objetivo.
