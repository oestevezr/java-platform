## 1. Fundamentos, identidad y contratos

- [ ] 1.1 Crear frontend React/TypeScript/Vite y paquete Lambda TypeScript con lógica pura compartida sin filtrar soluciones al cliente; verificar npm ci, typecheck y builds.
- [ ] 1.2 Crear matriz NETEC ASO/APX Java 8–11 con base OCA/OCP y estado confirmado/provisional/pendiente; verificar ID, versión, referencia y cobertura visible.
- [ ] 1.3 Preparar perfil NETEC versionado y confirmar parámetros con documentos aportados; verificar que valores desconocidos se rotulen educativos sin heredar formato Oracle.
- [ ] 1.4 Validar con Zod contenido, API, intentos, procedencia y versiones Java; verificar rechazo de datos malformados/IDs duplicados.
- [x] 1.5 Configurar React Router con hash, CSS Modules, MDX y caché IndexedDB mediante idb; verificar deep links, build y aislamiento de caché por cuenta.
- [x] 1.6 Configurar Vitest/Testing Library, Playwright y ESLint; verificar motor, flujo de navegador y lint.
- [ ] 1.7 Diseñar contratos HTTP API y esquema DynamoDB por sub, respuestas fragmentadas y directorio paginado; verificar consultas sin scans de historial ni ítems ilimitados.

## 2. Interfaz y apuntes

- [ ] 2.1 Construir navegación de tres secciones y panel de estudio sobrio; verificar móvil, foco de teclado y código legible.
- [ ] 2.2 Crear componentes de predicción, traza, cambio mínimo y recuperación activa; verificar que explicación se revele solo tras interacción.
- [ ] 2.3 Escribir apuntes de fundamentos Java de base OCA por grupos de objetivos, cada lote revisado; verificar matriz completa de tipos, operadores, control, arrays, métodos, Strings, objetos, herencia, excepciones y APIs básicas.
- [ ] 2.4 Escribir apuntes avanzados de base OCP por grupos de objetivos, cada lote revisado; verificar matriz completa de diseño, genéricos/colecciones, lambdas/streams, fechas, excepciones, I/O/NIO.2, concurrencia, JDBC y localización.
- [ ] 2.5 Revisar ejemplos/trazas con JDK objetivo 8/11 y referencias normativas; verificar versión explícita, diferencias entre versiones, ejemplo, contraejemplo, actividad y pregunta enlazada.
- [x] 2.6 Preparar estructura de apuntes ASO/APX y cobertura pendiente; verificar que contenidos específicos se incorporen solo desde documentación aportada y ninguna regla se invente.

## 3. Producción editorial de preguntas

- [ ] 3.1 Preparar validación por JDK objetivo 8/11, evidencia documental ASO/APX y revisión técnica/didáctica; verificar snippets correctos, errores de compilación y casos no deterministas.
- [ ] 3.2 Crear lote 1 de 100 preguntas Java 8–11 alineadas a la matriz disponible; verificar versiones, evidencia, diversidad de dificultad y explicación por opción.
- [ ] 3.3 Crear lote 2 de 100 preguntas originales y/o incorporadas; verificar procedencia, cobertura disponible y familias distintas.
- [ ] 3.4 Crear lote 3 de 100 preguntas originales y/o incorporadas; verificar 300 revisadas, diversidad de dificultad y cobertura de objetivos disponibles.
- [ ] 3.5 Crear lote 4 de 100 preguntas originales y/o incorporadas; verificar versión, evidencia y explicación por opción.
- [ ] 3.6 Crear lote 5 de 100 preguntas originales y/o incorporadas; verificar procedencia, cobertura y familias distintas.
- [ ] 3.7 Crear lote 6 de 100 preguntas originales y/o incorporadas; verificar 600 revisadas y representación JR/Standard/Senior sin imponer cuotas Oracle.
- [ ] 3.8 Auditar banco completo y ampliar objetivos insuficientes; verificar al menos 600 revisadas, 10 por objetivo confirmado del alcance publicado, dos dificultades por objetivo y ausencia de variantes cosméticas.

Cada lote se procesa en sublotes de 10-20 preguntas durante aplicación; no publicar un lote sin revisión completa.

- [ ] 3.9 Preparar flujo editorial para documentos futuros con registro de procedencia, extracción según formato, candidatos y revisión; verificar con un documento de muestra trazabilidad, contenido autocontenido, discrepancia de solución y duplicado sin inflar el conteo. Los documentos y banco interno reales se procesarán cuando el usuario los entregue, incorporando o adaptando ítems con versión Java y documentación ASO/APX, sin bloquear el banco Java inicial ni afirmar cobertura NETEC completa.

## 4. Motor y simuladores

- [ ] 4.1 Implementar corrección exacta en servidor con multiselección, opciones con IDs y explicación específica; verificar aciertos, errores y selección parcial.
- [ ] 4.2 Implementar muestreo aleatorio en servidor, cuotas, familias, historial y filtros; verificar invariantes sin duplicados, cobertura, shuffleSafe y fallback informado con RNG controlable en tests.
- [ ] 4.3 Implementar práctica aleatoria/adaptativa 50/30/20 y confirmación bloqueada; verificar explicación inmediata y redistribución de grupos vacíos.
- [ ] 4.4 Implementar simulación con revisión/marcado y envío manual; verificar ausencia de correcciones antes de finalizar y resultado completo después.
- [ ] 4.5 Implementar deadline de servidor y revisión/bloqueo entre pestañas y dispositivos; verificar recarga, suspensión, expiración servidor, dispositivo concurrente, finalización única y rechazo de respuestas que lleguen fuera de plazo.
- [ ] 4.6 Implementar historial y resultados por objetivo/dificultad con vacías y versiones congeladas; verificar que actualizar banco no cambie intentos previos.

## 5. Cuentas, sincronización y ruta

- [ ] 5.1 Implementar Cognito y login authorization code/PKCE con biblioteca OIDC, recuperación/logout y email verificado; verificar sesión expirada, renovación, borrador conservado y caché aislada.
- [ ] 5.2 Implementar JWT authorizer y propiedad de recursos por sub en servidor; verificar con dos cuentas que un candidato no lea ni modifique datos ajenos.
- [ ] 5.3 Implementar persistencia de intentos, respuestas y planes en DynamoDB con idempotencia y revisiones; verificar reintentos sin duplicados y conflicto entre dispositivos.
- [ ] 5.4 Implementar sincronización/caché por cuenta y estados pendiente/sincronizado/error; verificar reconexión, segundo dispositivo y borrador no guardado visible.
- [ ] 5.5 Implementar diagnóstico y ruta flexible de 3 semanas recomendadas, 2/4 semanas o días enteros positivos; verificar replanificación, carga insuficiente y cobertura NETEC pendiente.
- [ ] 5.6 Implementar confianza, cuaderno de errores y repaso 1/3/7/14 calculados desde resultados servidor; verificar reinicio por error, acierto inseguro y continuidad tras calendario.
- [ ] 5.7 Implementar dominio/preparación orientativa; verificar mínimos de muestra y exclusión de abandonados/historial importado no verificado.
- [ ] 5.8 Implementar exportación personal e importación histórica validada; verificar que no altere resultados verificados ni acepte datos ajenos/incompatibles.
- [ ] 5.9 Implementar rol administrator asignado por operador y APIs de consulta global paginada; verificar denegación a candidato y que no pueda autoasignarse privilegios.
- [ ] 5.10 Construir panel administrador con lista de candidatos, última actividad, avance por objetivo, historial, tendencia y repasos pendientes; verificar datos con dos candidatos y paginación.

## 6. Material Extra

- [ ] 6.1 Crear catálogo y filtros con recursos oficiales iniciales; verificar URL, examen, objetivo, idioma, coste y fecha de revisión.
- [ ] 6.2 Documentar adición editorial de videos/prácticas y revisión de enlaces; verificar incorporación de un recurso sin cambios de código y apertura YouTube sin embed previo.

## 7. Integración, infraestructura y entrega

- [ ] 7.1 Verificar flujo login → diagnóstico → apuntes → práctica → simulación → resultado → repaso → segundo dispositivo con integración frontend/API.
- [ ] 7.2 Auditar WCAG 2.2 AA, teclado, móvil y lector de pantalla, incluyendo login/paneles; registrar y corregir bloqueos.
- [ ] 7.3 Ejecutar typecheck, lint, validación de contenido/JDK objetivo, autorización y tests de temporización/sincronización; entregar builds con banco mínimo revisado.
- [ ] 7.4 Preparar plantilla AWS SAM/CloudFormation para S3/CloudFront/OAC, Cognito, HTTP API, Lambda y DynamoDB con permisos mínimos; verificar validate/build/change set sin desplegar.
- [ ] 7.5 Revisar antes de despliegue solicitado cuenta, región, candidatos/uso esperado, planes, créditos/vencimiento, email, logs y backups; entregar estimación, alertas y mecanismo de desactivación.
- [ ] 7.6 Documentar despliegue AWS CLI/SAM y rollback con conservación de progreso/backup; verificar que retirar stack no borre datos sin intención explícita.
- [ ] 7.7 Preparar GitHub Actions/OIDC al existir repositorio; verificar ausencia de claves AWS persistentes y publicación solo tras checks.
- [ ] 7.8 Resolver modalidad de alta y audiencia del banco interno antes de publicación; verificar que preguntas/soluciones internas no estén en build público y solo se entreguen mediante API al público autorizado.

## Estado del scaffold

Implementación inicial en orlando-proposal. Las tareas parciales permanecen sin marcar: contratos de contenido/progreso, evaluación pura, autorización de las rutas actuales, plan flexible, panel administrativo básico, configuración Cognito y plantilla SAM. La autenticación real, el motor completo de exámenes, historial, repasos y banco revisado siguen pendientes. Las estadísticas candidatas se proyectan en servidor sin campos internos; AWS será la fuente de verdad e IndexedDB una caché por cuenta. La vista local utiliza datos temporales y está excluida del acceso de producción.

Validación: typecheck, lint, 25 pruebas unitarias, builds, validación estructural de contenido/infraestructura y 6 pruebas de navegador en escritorio/móvil. La validación estructural no sustituye SAM validate/build/change set, todavía pendientes.
