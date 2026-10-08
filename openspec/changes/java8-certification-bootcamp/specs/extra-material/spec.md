## Purpose

Definir el comportamiento de extra-material para apoyar la autoformación intensiva y verificable para el examen NETEC ASO/APX basado en Java 8–11.

## ADDED Requirements

### Requirement: Catálogo curado
Material Extra SHALL permitir buscar/filtrar videos, práctica y documentación por objetivo NETEC, ámbito Java/ASO/APX, versión Java, idioma y tipo; cada recurso SHALL tener URL, motivo, coste, fecha y estado de revisión; recursos ASO/APX SHALL proceder de material aportado, sin inventar enlaces internos.

#### Scenario: Filtrar recursos
- **WHEN** elige fundamentos Java 8 y excepciones
- **THEN** obtiene solo recursos relacionados con etiquetas de coste y revisión

### Requirement: Ampliación editorial
Los recursos SHALL poder añadirse gradualmente mediante mantenimiento editorial del catálogo versionado y revisión, sin una interfaz pública de alta de recursos; videos SHALL abrir por enlace sin cargar reproductores externos automáticamente; enlaces rotos SHALL señalarse o retirarse.

#### Scenario: Recurso roto
- **WHEN** la revisión detecta URL inválida
- **THEN** el recurso se etiqueta no disponible o se retira del catálogo activo

