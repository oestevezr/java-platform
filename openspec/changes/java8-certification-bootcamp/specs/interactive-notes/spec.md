## Purpose

Definir apuntes interactivos Java 8–11 y material ASO/APX documentado para preparar el examen NETEC indicado por el usuario.

## ADDED Requirements

### Requirement: Temario y versión objetivo
Los apuntes SHALL organizar conceptos Java 8–11 de base OCA/OCP y objetivos NETEC confirmados, con regla, ejemplo, contraejemplo, trampa, actividad y preguntas enlazadas. Cada tema SHALL indicar versión aplicable; diferencias de compilación/API entre Java 8 y 11 SHALL explicarse cuando afecten al resultado.

#### Scenario: Característica de Java 11
- **WHEN** abre un tema que usa una API disponible en Java 11 y ausente en Java 8
- **THEN** ve la versión necesaria y por qué el mismo ejemplo no compila en Java 8

### Requirement: Arquitecturas con respaldo documental
Los temas específicos ASO/APX SHALL basarse en documentación aportada y conservar referencia/versionado. Objetivos aún no documentados SHALL mostrarse como pendientes, sin atribuir reglas supuestas a BBVA o NETEC.

#### Scenario: Tema de arquitectura pendiente
- **WHEN** no se ha aportado material suficiente de un objetivo ASO/APX
- **THEN** se señala la falta de cobertura y no se presenta una explicación inventada

### Requirement: Explicaciones interactivas
Cada tema publicado SHALL incluir predicción previa a revelar y traza editorial o cambio mínimo; SHALL distinguir compilación, ejecución y salida sin afirmar ejecutar Java arbitrario en el sitio.

#### Scenario: Predecir salida
- **WHEN** responde una actividad
- **THEN** se revela la traza y la regla correspondiente a la versión indicada
