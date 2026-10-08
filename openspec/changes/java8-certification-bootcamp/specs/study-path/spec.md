## Purpose

Definir el comportamiento de study-path para apoyar la autoformación intensiva y verificable para el examen NETEC ASO/APX basado en Java 8–11.

## ADDED Requirements

### Requirement: Diagnóstico y horizonte
La plataforma SHALL ofrecer diagnóstico de 30 preguntas estratificadas, elegir ruta NETEC ASO/APX o práctica de fundamentos/avanzados de base OCA/OCP, registrar disponibilidad diaria y duración deseada y generar una ruta flexible con 3 semanas como valor recomendado, opciones de 2 o 4 semanas y duración personalizada en días positivos, mostrando carga pendiente y objetivos NETEC aún no documentados; SHALL advertir que no garantiza aprobación.

#### Scenario: Seleccionar ruta
- **WHEN** el candidato termina diagnóstico y elige NETEC ASO/APX
- **THEN** ve un plan recomendado de 3 semanas que puede ajustar, sus debilidades y carga estimada

#### Scenario: Elegir otra duración
- **WHEN** selecciona 2 o 4 semanas o una duración personalizada válida
- **THEN** el calendario distribuye el temario y la práctica en ese horizonte, muestra la carga diaria y advierte si la disponibilidad es insuficiente sin cambiarlo silenciosamente

#### Scenario: Replanificar la ruta
- **WHEN** cambia duración o disponibilidad durante el estudio
- **THEN** se redistribuye trabajo pendiente y se conservan intentos, dominio y repasos vencidos de la cuenta, sincronizados entre dispositivos

#### Scenario: Duración inválida
- **WHEN** introduce cero, un número negativo o una duración no entera en días
- **THEN** recibe un error y el plan actual permanece intacto

### Requirement: Recuperación y repaso
La plataforma SHALL priorizar errores y aciertos inseguros y programar repasos a 1, 3, 7 y 14 días; un error reinicia el intervalo a 1 día y SHALL ofrecer trazas y cuaderno de errores. El fin del calendario SHALL mantener accesibles estudio y repasos posteriores sin comprimir sus intervalos.

#### Scenario: Error reiterado
- **WHEN** falla una pregunta de repaso
- **THEN** el concepto reaparece al día siguiente y se enlaza la explicación

#### Scenario: Repaso después del calendario
- **WHEN** un repaso vence después del último día de la ruta seleccionada
- **THEN** sigue disponible en su fecha y el candidato puede continuar estudiando

### Requirement: Preparación orientativa
La plataforma SHALL mostrar dominio solo con 5 preguntas distintas en 2 días y 80% reciente; SHALL recomendar preparación solo con dos simulaciones distintas al 80% y 70% por objetivo, mostrando muestras sin prometer éxito.

#### Scenario: Muestra insuficiente
- **WHEN** acierta una sola pregunta
- **THEN** no se marca el objetivo dominado

