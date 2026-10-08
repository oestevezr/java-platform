## Purpose

Definir un banco verificable Java 8–11 ampliable con documentos y preguntas internas para apoyar la preparación NETEC ASO/APX.

## ADDED Requirements

### Requirement: Volumen y cobertura
El banco inicial publicado SHALL contener al menos 600 preguntas revisadas e independientes, originales y/o incorporadas desde fuentes aportadas, sin contar variantes cosméticas. SHALL incluir JR, Standard y Senior como dificultades internas y al menos 10 preguntas y dos dificultades por objetivo confirmado del alcance publicado. La distribución SHALL priorizar el temario NETEC confirmado sin imponer cuotas de 300 preguntas por examen Oracle. Objetivos NETEC no documentados SHALL figurar pendientes y no declararse cubiertos.

#### Scenario: Auditar cobertura
- **WHEN** se prepara publicación
- **THEN** menos de 600 preguntas revisadas o un objetivo declarado cubierto sin mínimos impide aprobar el banco y la cobertura pendiente se informa

### Requirement: Contenido y explicación
Cada pregunta SHALL tener ID/versión, objetivo, ámbito Java/ASO/APX, versión Java objetivo, dificultad, opciones identificadas, número de selecciones, solución exacta, explicación general y por opción, referencias y revisión. SHALL explicar aciertos y errores y vincularse al apunte correspondiente.

#### Scenario: Respuesta incorrecta
- **WHEN** elige un distractor
- **THEN** ve el motivo específico, respuesta correcta y regla de la versión evaluada

### Requirement: Documentos y banco interno
El banco SHALL admitir incorporación editorial desde documentos y banco interno que aporte el usuario. Cada ítem incorporado o adaptado SHALL conservar ID y versión de fuente, página/sección o identificador de pregunta, tipo de origen y texto autocontenido. Soluciones SHALL verificarse antes de publicación y duplicados SHALL no incrementar el conteo. Archivos fuente SHALL no publicarse automáticamente.

#### Scenario: Incorporar pregunta interna
- **WHEN** aporta una pregunta del banco interno con información suficiente
- **THEN** se conserva su procedencia, se valida o corrige la respuesta y se redactan explicaciones antes de publicarla

#### Scenario: Discrepancia en la fuente
- **WHEN** la solución documental contradice evidencia técnica
- **THEN** el ítem queda pendiente hasta resolver y registrar la discrepancia

#### Scenario: Duplicado o documento ilegible
- **WHEN** un candidato equivale a otro existente o no puede leerse con contexto suficiente
- **THEN** no se contabiliza ni publica como nueva pregunta verificada y se registra la limitación

### Requirement: Validación por versión
Solo ítems revisados técnica y didácticamente SHALL publicarse. Snippets Java SHALL contar con evidencia del JDK objetivo 8 u 11, o de versiones intermedias si se evalúan expresamente, y condiciones de no determinismo. Reglas ASO/APX SHALL contrastarse con documentación de arquitectura identificada, sin sustituirla por reglas Java genéricas.

#### Scenario: Resultado distinto entre versiones
- **WHEN** un snippet compila en Java 11 pero no en Java 8
- **THEN** la versión evaluada queda explícita y la explicación distingue ambos resultados, sin excluirlo solo por requerir Java 11
