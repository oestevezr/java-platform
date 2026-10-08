## Purpose

Definir una plataforma accesible con sesiones, progreso sincronizado y seguimiento administrativo para formación NETEC ASO/APX en Java 8–11.

## ADDED Requirements

### Requirement: Experiencia accesible
La plataforma SHALL ofrecer Apuntes, Exámenes de prueba y Material Extra, panel personal y panel administrador con diseño sobrio, móvil, teclado y accesibilidad WCAG 2.2 AA. Código y correcciones SHALL ser legibles sin depender de color.

#### Scenario: Uso por teclado
- **WHEN** navega y responde sin ratón
- **THEN** accede a controles etiquetados, foco visible y corrección textual

### Requirement: Cuentas y sesiones
La plataforma SHALL permitir cuentas con login, recuperación de contraseña y logout. Operaciones de progreso e intentos SHALL requerir sesión válida. Sesión expirada SHALL conservar borrador aislado de la cuenta y solicitar reautenticación; logout SHALL impedir que otro usuario vea la caché anterior.

#### Scenario: Sesión expirada
- **WHEN** intenta guardar con sesión expirada
- **THEN** se solicita login sin perder el borrador ni atribuirlo a otra cuenta

### Requirement: Autorización individual
Cada candidato SHALL acceder únicamente a sus planes, intentos, resultados y progreso; el servidor SHALL verificar identidad y propiedad, sin aceptar identificadores del cliente como autoridad.

#### Scenario: Intento ajeno
- **WHEN** un candidato solicita o modifica el ID de intento de otro
- **THEN** el servidor deniega acceso sin revelar sus datos

### Requirement: Seguimiento administrativo
Un administrador autorizado SHALL consultar el progreso de todos los candidatos en un panel con lista paginada, última actividad de estudio, avance por objetivo, intentos, puntuaciones, tendencia y repasos pendientes. Candidatos SHALL no obtener acceso por cambiar URL o atributos del cliente; concesión del rol SHALL ser controlada en servidor y no disponible mediante registro público.

#### Scenario: Administrador consulta progreso
- **WHEN** inicia sesión con rol administrador
- **THEN** puede listar candidatos y abrir su detalle de avance e historial con fechas y cobertura pendiente

#### Scenario: Candidato abre panel administrador
- **WHEN** un candidato solicita una ruta o API administrativa
- **THEN** el acceso es denegado por servidor

### Requirement: Sincronización y conflictos
El progreso confirmado SHALL persistir en nube por candidato y recuperarse en otro dispositivo. Guardado SHALL ser idempotente y versionado; la UI SHALL indicar pendiente, sincronizado o error y no sobrescribir cambios concurrentes silenciosamente. Nota y dominio SHALL calcularse en servidor a partir de respuestas y versiones, no de puntuaciones enviadas por cliente.

#### Scenario: Continuar en otro dispositivo
- **WHEN** inicia sesión en otro dispositivo después de guardar
- **THEN** ve el mismo progreso e intento confirmado

#### Scenario: Reintento de guardado
- **WHEN** se repite una petición por fallo de red
- **THEN** no duplica respuestas ni intentos y devuelve el estado confirmado

#### Scenario: Conflicto de edición
- **WHEN** otro dispositivo ya guardó una revisión posterior
- **THEN** se informa conflicto y se recupera estado vigente sin perder silenciosamente el borrador

### Requirement: Portabilidad y recuperación
El candidato SHALL exportar su historial y progreso. Importaciones SHALL validarse y marcarse como históricas no verificadas, sin alterar notas confirmadas por servidor. Sin conexión SHALL mostrarse qué cambios no están guardados; caché local SHALL quedar separada por identidad.

#### Scenario: Importación inválida
- **WHEN** selecciona un archivo incompatible o ajeno
- **THEN** recibe error y conserva sus datos confirmados

### Requirement: Distribución y coste
El frontend SHALL producir build estático con API autenticada para progreso y administración. Material interno SHALL no distribuirse en assets públicos mientras su audiencia no esté definida. Antes de desplegar SHALL documentarse uso esperado, elegibilidad, precios y créditos; SHALL no prometer coste cero no verificado.

#### Scenario: Coste no confirmado
- **WHEN** no puede garantizarse ausencia de cobros
- **THEN** se mantiene entorno local y se presenta estimación antes de despliegue
