# Contenido y fuentes

El scaffold no incluye un banco validado ni afirma cobertura NETEC. Los objetivos Java son provisionales y ASO/APX queda pendiente.

- objectives.json: matriz inicial y estado de cobertura.
- exam-profile.json: formato desconocido representado con null; no copiar tiempos Oracle.
- questions.json: banco privado vacío. No importarlo desde el frontend.
- resources.json: referencias iniciales con revisión pendiente.
- sources/: documentos originales locales, ignorados por Git y excluidos del build.

Para incorporar un documento: registrar identificador/versión/localizador, separar ítems candidatos, mapear objetivo y JDK, deduplicar, verificar solución y escribir explicación por opción. Una pregunta reviewed requiere evidencia. No activar 600 preguntas ficticias ni contar variantes cosméticas. Los datos incompletos se conservan como draft.

npm run content:validate valida esquemas del scaffold; no equivale a aprobación editorial del banco completo ni ejecuta Java.
