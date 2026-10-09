# API del scaffold

Todas las rutas de producción requieren JWT Cognito validado por HTTP API con scope. Identidad/propiedad viene del sub, nunca de un userId del cliente.

| Ruta | Permiso | Respuesta |
| --- | --- | --- |
| GET /me/progress | learning/read | CandidateProgress: resumen personal y plan |
| GET /me/plan | learning/read | StudyPlan |
| PUT /me/plan | learning/write | StudyPlan con revisión incrementada; 409 si existe conflicto |
| GET /admin/candidates?cursor=... | learning/read + grupo administrator | Directorio paginado con indicadores internos |

Las estadísticas de ambos paneles tienen una fuente central. El contrato público no incluye internalInsights; no se oculta simplemente un campo en CSS. La caché IndexedDB se separa por sub y se limpia al salir.

DynamoDB: PK USER#sub, SK PROFILE/PLAN/SUMMARY, futuros ATTEMPT#id y ANSWER#attempt#question separados. Directorio: GSI1PK CANDIDATES, GSI1SK sub; Query paginada con 25 perfiles por página, no Scan del historial. Solo profiles explícitamente creados por onboarding aparecen en el directorio: esa escritura se implementará en la siguiente fase.

Futuras rutas de intentos/exportación y seguimiento detallado todavía no están implementadas. No aceptar notas o indicadores de dominio calculados por cliente como resultados verificados.
