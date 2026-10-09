## Context

El proyecto cuenta con repositorio Git y un scaffold en la rama orlando-proposal: frontend React, API Lambda TypeScript, contratos compartidos, pruebas e infraestructura declarativa. No se ha desplegado en AWS. El objetivo, aclarado por el usuario, es preparar un examen NETEC para ASO/APX de BBVA basado en Java 8–11 con preguntas de base OCA/OCP. Aún no se dispone del temario ni banco interno. La última decisión incorpora cuentas y seguimiento persistente de cada candidato en nube.

## Goals / Non-Goals

**Goals:** formación enfocada, ruta flexible con 3 semanas recomendadas, progreso sincronizado, costes bajos y contenido verificable.
**Non-Goals:** garantizar aprobación, inventar reglas ASO/APX, ejecutar Java arbitrario en AWS, vigilancia de visitantes o reproducir formato NETEC sin evidencia.

## Decisions

### Stack tecnológico

| Capa | Tecnología | Propósito |
| --- | --- | --- |
| Frontend | React + TypeScript estricto + Vite | Aplicación interactiva con build estático. |
| Navegación | React Router con hash | Enlaces directos sin reescrituras del CDN. |
| UI | CSS Modules y variables CSS | Diseño sobrio, móvil y accesible con pocas dependencias. |
| Apuntes | MDX compilado en build | Texto y actividades React revisados. |
| Contratos | JSON versionado + Zod | Validar contenido y solicitudes en cliente/servidor. |
| Estado | Hooks/reducer/context | Motor de examen separado de presentación. |
| Caché local | IndexedDB mediante idb | Borradores y cola de sincronización por cuenta; servidor es fuente de verdad. |
| Autenticación | Amazon Cognito User Pool | Registro, login, recuperación y sesiones; app client público sin secreto. |
| API | API Gateway HTTP API + JWT authorizer | Verificar tokens Cognito y proteger operaciones. |
| Backend | AWS Lambda con Node.js/TypeScript | Intentos, evaluación, progreso y entrega autorizada de preguntas. |
| Persistencia | DynamoDB Standard | Perfil, plan, intentos, respuestas y dominio por candidato. |
| Hosting | S3 privado + CloudFront/OAC + HTTPS | Distribuir assets; preguntas internas y soluciones no van en build público. |
| Infraestructura | AWS SAM/CloudFormation | Definir frontend, API, funciones, identidad y datos como código. |
| Pruebas | Vitest/Testing Library + Playwright | Motor, permisos, sincronización y flujos de navegador. |
| Calidad | ESLint + TypeScript + validación de contenido | Bloquear builds con errores. |
| Autoría Java | JDK 8 y 11 locales/CI | Verificar snippets; Java es contenido, no backend requerido. |
| CI/CD | Build local inicial; GitHub Actions/OIDC al crear repositorio | Publicar artefactos revisados sin claves AWS persistentes. |

Usar versiones estables compatibles al implementar; fijarlas en package-lock.json y verificar npm ci. Seleccionar runtime Node soportado por Lambda y documentarlo. Compartir tipos/esquemas y lógica de evaluación pura entre paquetes, sin enviar soluciones privadas al bundle cliente.

React/Vite produce assets estáticos: https://vite.dev/guide/static-deploy.html . HTTP API admite authorizers JWT con Cognito: https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-jwt-authorizer.html .
Alternativas: Next.js/SSR no resuelve una necesidad actual; Amplify Hosting simplifica Git pero añade su modelo de cobro. Spring Boot, EC2 y RDS añaden operación/coste fijo innecesarios para esta carga. API serverless aporta sesiones/progreso sin mantener servidores. No añadir VPC/NAT Gateway ni provisioned concurrency inicialmente.

### Identidad y autorización

Login mediante OAuth authorization code + PKCE con interfaz Cognito compatible con el nivel elegido; evaluar Lite por coste antes de desplegar. Registro con email verificado, recuperación de contraseña y cierre de sesión. Usar sub del token como ID inmutable, nunca email o userId enviados por cliente para decidir propiedad. Access token en memoria; renovación con biblioteca OIDC y políticas Cognito, evitando persistir credenciales en localStorage. Sesión expirada conserva borrador de la cuenta y solicita login; logout borra caché visible/tokens y jamás muestra datos de otra cuenta.

El servidor aplica propiedad en todas las consultas y mutaciones, además de validación JWT. Roles confirmados: candidato consulta su progreso y administrador consulta el de todos. La autorización se aplica en servidor; solo operadores pueden conceder rol administrador. Registro por invitación o autoservicio y acceso del contenido interno también se concretarán antes del despliegue; no enviar material interno a distribución pública mientras no esté definido.

### Panel administrador

Rol administrator mediante grupo Cognito asignado solo por operador autorizado, nunca editable desde formulario de alta. API /admin/candidates y /admin/candidates/{sub}/progress /attempts requiere JWT válido y grupo verificado por servidor; no confiar en visibilidad del menú. Panel de lectura con paginación y filtros por nombre/identificador y actividad; detalle con avance por objetivo, puntuaciones, tendencia, últimos intentos y repasos pendientes. Registrar última actividad al confirmar evento de aprendizaje, no rastrear páginas/clics.
Mantener resumen de candidato y GSI de directorio para listar paginado sin escanear todo el historial. Administrador no modifica soluciones, notas ni respuestas de candidato en MVP. Auditar acceso administrativo mediante logs mínimos sin respuestas ni tokens; retención acotada. Revocación de rol invalida capacidad de seguir accediendo según vigencia/revalidación de tokens; documentar demora máxima y mecanismo de cierre de sesión.

### Datos y API

Tabla DynamoDB con partición USER#sub; elementos PROFILE, PLAN, PROGRESS#objectiveId y ATTEMPT#id. Respuestas en elementos propios o fragmentos para no superar límites de ítem; no almacenar historial ilimitado en un solo documento. Versiones de contenido y perfiles congeladas por intento.
API inicial: GET/PATCH /me, GET/PUT /me/plan, GET /me/progress, GET/POST /me/attempts, GET /me/attempts/{id}, PUT /me/attempts/{id}/answers/{questionId}, POST /me/attempts/{id}/submit, GET /me/export. Validar cuerpo/tamaño, IDs, pertenencia y estado; no permitir editar nota/dominio directamente.
Importación local produce un historial personal marcado importado; no puede fabricar resultados verificados ni sobrescribir intentos evaluados por servidor. Cambios de plan usan versionado optimista y devuelven conflicto sin pisar otro dispositivo.

Servidor selecciona preguntas, congela orden/versiones y calcula nota/explicaciones y dominio. Banco JSON versionado en S3 separado y privado, accesible por rol Lambda, con caché de función; no cargar todo el banco en cada respuesta. El navegador recibe solo lo autorizado para su intento. Restricción de distribución del contenido interno pendiente; ninguna URL pública debe filtrar sus archivos fuente ni JSON completos.

### Sincronización, examen y temporizador

DynamoDB es fuente de verdad del progreso. Servidor guarda startAt/deadline y estado del intento; cliente muestra tiempo restante con referencia de tiempo servidor. Expiración se verifica en cada petición y al retomar, sin requerir cron ni escribir cada segundo. Envío/expiración finalizan una sola vez mediante escritura condicional; multiselección se corrige por coincidencia exacta, vacías incorrectas, abandonados excluidos del indicador.
Respuestas guardadas por acción con requestId/versión y actualización condicional. IndexedDB mantiene borrador por sub e id de intento; indicadores pendiente/sincronizado/error. Reintentos idempotentes con espera exponencial acotada; conflictos se muestran sin sobrescribir silenciosamente.
Sin conexión puede consultarse contenido ya disponible y preparar borradores; respuestas cronometradas que lleguen después del deadline no se aceptan como si hubieran llegado antes. Mostrar claramente cambios locales no guardados. Práctica libre permite sincronizar respuestas pendientes al reconectar, manteniendo primera evaluación. Recarga y segundo dispositivo recuperan exactamente el intento del servidor; impedir ediciones concurrentes mediante revisión/bloqueo de intento.
Práctica devuelve explicación tras confirmar; simulación activa no devuelve solución, corrección ni explicación hasta finalizar. Después, resultado incluye tiempo, vacías, desglose por objetivo/dificultad, motivos por opción y próximos repasos. No es examen supervisado ni una herramienta antifraude.

### Ruta y aprendizaje

Diagnóstico de 30 preguntas estratificadas sobre objetivos disponibles. Ruta NETEC ASO/APX con práctica de fundamentos/avanzados de base OCA/OCP; 3 semanas por defecto, opciones 2/4 semanas y duración personalizada en días enteros positivos. Registrar disponibilidad diaria, carga y cobertura NETEC pendiente. Cambiar duración redistribuye pendientes conservando historial, dominio y vencimientos.
Plantilla de 3 semanas: día 1 diagnóstico; días 2–7 fundamentos; 8–14 avanzados, diferencias Java 8–11 y ASO/APX documentado; 15–18 práctica focalizada/simulaciones; 19–20 dos simulaciones nuevas; día 21 repaso ligero. Redistribuir fases según duración sin bloquear estudio posterior. Sesión orientativa de 3h ajustable: recuperación, apuntes/trazas, preguntas, revisión y repaso.
Repasos a 1/3/7/14 días desde aprendizaje; error reinicia a 1 día, acierto inseguro también se repasa. No comprimir intervalos por acabar calendario. Dominio requiere 5 preguntas distintas en 2 días y 80% reciente; preparación orientativa requiere dos simulaciones distintas al 80% y 70% por objetivo cubierto, mostrando muestras y cobertura pendiente sin prometer aprobación.

### Contenido y aleatoriedad

Cada apunte: regla, modelo mental, ejemplo/contraejemplo, trampa, actividad y preguntas. Predecir compilación/salida antes de revelar; trazas editoriales prevalidada, no compilador remoto. Cada pregunta explicita JDK objetivo 8/11; comparaciones verifican ambos, versiones intermedias se validan si se evalúan expresamente. ASO/APX necesita referencia documental específica.
Al menos 600 preguntas independientes revisadas: originales y/o incorporadas/adaptadas del material aportado, con JR/Standard/Senior como dificultades internas. Distribución por objetivos NETEC confirmados, sin cuotas Oracle; mínimo 10 preguntas y dos dificultades por objetivo declarado cubierto. El banco base puede avanzar mientras ASO/APX figura pendiente.
Campos: id/versión, targetProfile, ámbito, objectiveIds, difficulty, javaVersion, originType, procedencia/version/localizador, texto/contexto, opciones con IDs, solución, explicación general/por opción, referencias, familia, shuffleSafe y reviewStatus/evidencia.
Simulación usa cuotas del perfil y aleatoriedad sin reemplazo ni adaptación por debilidad, máximo una por familia; práctica ofrece aleatoriedad completa o mezcla 50% debilidades/30% vencidos/20% exploración, redistribuyendo grupos vacíos. RNG uniforme, IDs estables y opciones barajables solo si no altera significado. Evitar últimos dos intentos si hay candidatos suficientes; avisar al relajar historial. Si filtros impiden cantidad/cobertura, pedir ajuste antes de iniciar.

### Fuentes y materiales

El usuario aportará documentos y buscará banco interno NETEC/ASO/APX. Ingesta editorial local, sin subida pública necesaria. Registrar documento/versión y página/sección o ID original; extraer con herramienta adecuada, mapear objetivos/versiones, incorporar/adaptar, deduplicar y revisar solución/explicación contra JDK o arquitectura. Discrepancias/ilegibilidad quedan pendientes, no publicadas. Preguntas autocontenidas; fuente original no se distribuye automáticamente.
Perfil NETEC conserva fuente, versión, objetivos, ponderaciones, minutos, cantidad y corrección. Parámetros desconocidos son educativos configurables; no heredar umbrales/fechas de retiro Oracle ni afirmar réplica exacta. No inventar reglas ASO/APX.
Material Extra es catálogo JSON curado por objetivo, ámbito, versión, idioma, coste y fecha; iniciar con documentación Java 8/11, ampliar con enlaces revisados; YouTube abre por enlace sin embed automático.

### Interfaz y costes AWS

Apuntes, Exámenes de prueba y Material Extra como navegación principal; panel personal para plan/progreso. Fondo gris claro, texto carbón, acento azul petróleo y código monoespaciado; móvil/teclado, contraste WCAG 2.2 AA, foco, lectores y movimiento reducido.
S3/CloudFront para frontend; Cognito/API Gateway/Lambda/DynamoDB para sesiones/datos. DynamoDB inicialmente on-demand por tráfico variable y baja operación, con límites configurables y estimación de consumo; comparar provisioned de baja capacidad si elegibilidad y patrón permiten coste menor. No asumir almacenamiento gratuito implica escrituras gratuitas. Evitar guardar cada tick o telemetría de clics; historial por eventos de aprendizaje.
Antes de desplegar: revisar región, número de candidatos/uso, créditos/vencimiento, Cognito/email, API, Lambda, DynamoDB, S3/CDN, logs y backups. CloudFront Free requiere elegibilidad: cuentas AWS Free Tier no son elegibles para planes de tarifa fija según documentación actual. Alertas y límites de concurrencia/throughput reducen riesgo pero no garantizan factura cero. Sin estimación aceptada, mantener build y backend locales.
Fuentes: https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/flat-rate-pricing-plan.html ; https://aws.amazon.com/cognito/pricing/ ; https://aws.amazon.com/api-gateway/pricing/ ; https://aws.amazon.com/lambda/pricing/ ; https://aws.amazon.com/dynamodb/pricing/ .

## Risks / Trade-offs

- [Calendario insuficiente] → diagnóstico, carga visible y replanificación.
- [Temario/formato NETEC pendiente] → cobertura visible y perfil educativo.
- [Soluciones erróneas] → evidencia por JDK/documentación y revisión.
- [Conflictos o cortes de red] → idempotencia, estado de sincronización y versionado.
- [Acceso a datos ajenos] → propiedad por sub y pruebas de autorización servidor.
- [Costes variables] → estimación, límites, retención de logs acotada y alertas; ninguna promesa de gratuidad.
- [Banco interno descargable] → distribución privada por API; aclarar quién puede acceder antes de publicación.

## Migration Plan

Implementar frontend y API con almacenamiento local de desarrollo. Validar contratos, identidad, evaluación y dos cuentas aisladas antes de nube. Configurar SAM/CloudFormation y revisar change set/costes; desplegar solo por solicitud posterior. DynamoDB con retención al retirar stack y backup/export antes de migraciones destructivas. Versionar banco/contratos y mantener compatibilidad para intentos activos; rollback de app/funciones no elimina progreso.

## Open Questions

Pendientes del usuario: modalidad de alta de candidatos y audiencia autorizada del banco interno. El rol administrador y su consulta del progreso de todos ya están confirmados. Los puntos pendientes se resuelven antes de activar altas y distribuir contenido interno; no cambian el stack elegido.
