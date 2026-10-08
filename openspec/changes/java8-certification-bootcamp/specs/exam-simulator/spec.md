## Purpose

Definir el comportamiento de exam-simulator para apoyar la autoformación intensiva y verificable para el examen NETEC ASO/APX basado en Java 8–11.

## ADDED Requirements

### Requirement: Modos y corrección
El simulador SHALL ofrecer práctica sin límite con explicación tras confirmar y respuesta bloqueada; modo con tiempo SHALL permitir revisar respuestas y ocultar toda corrección hasta finalizar. Multiselección SHALL puntuar solo coincidencia exacta.

#### Scenario: Práctica correcta
- **WHEN** confirma opciones correctas
- **THEN** ve explicación de acierto inmediatamente

### Requirement: Revisión diferida
El modo cronometrado SHALL mostrar explicaciones únicamente después de envío o expiración.

#### Scenario: Respuesta en simulación
- **WHEN** guarda una respuesta durante intento activo
- **THEN** no ve acierto, error ni explicación

### Requirement: Selección aleatoria
Cada intento SHALL seleccionar aleatoriamente sin reemplazo, respetando filtros, cobertura del perfil y máximo una pregunta por familia. Simulación SHALL ser independiente de debilidades; práctica SHALL ofrecer aleatoriedad completa o adaptativa. Historial de dos intentos SHALL evitarse si hay suficientes candidatos.

#### Scenario: Banco insuficiente
- **WHEN** solicita más preguntas que las disponibles con filtros
- **THEN** ve cantidad disponible y ajusta antes de iniciar sin reducción silenciosa

### Requirement: Tiempo y recuperación
El servidor SHALL establecer y persistir el deadline y mantenerlo durante recarga/inactividad; cambios al reloj cliente SHALL no ampliarlo y respuestas recibidas después del plazo SHALL no aceptarse como puntuales; al vencer SHALL finalizar una sola vez, impedir modificaciones y contar vacías como incorrectas. IDs/versiones y orden SHALL conservarse; el estado confirmado SHALL recuperarse entre dispositivos y escrituras concurrentes SHALL detectarse mediante revisión o bloqueo. Selección, nota y explicación SHALL validarse en servidor; durante simulación activa la API SHALL no entregar corrección ni soluciones.

#### Scenario: Regreso fuera de plazo
- **WHEN** recarga después del deadline
- **THEN** obtiene resultado final sin tiempo adicional

### Requirement: Perfiles y resultados
El perfil principal NETEC ASO/APX SHALL indicar versión, fuente, fecha, versiones Java, objetivos, formato y verificación; parámetros no documentados SHALL ofrecer modo educativo configurable sin heredar tiempos, cuotas o umbrales Oracle. La selección SHALL respetar versiones Java y ámbitos del perfil sin mezclar ítems incompatibles. Resultado SHALL incluir puntuación, tiempo, vacías, desglose por objetivo, explicaciones y repaso.

#### Scenario: Perfil sin verificar
- **WHEN** selecciona NETEC ASO/APX sin parámetros confirmados
- **THEN** ve aviso y modo educativo configurable en lugar de formato real asegurado

