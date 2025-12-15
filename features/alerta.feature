Feature: Gestión de alertas
  Para mantener el sistema bajo control,
  como usuario autenticado
  quiero ver las alertas activas y poder marcarlas como leídas.

  Scenario: Visualizar alertas activas
    Given que existe una alerta activa en el sistema
    And que he iniciado sesión como "Empleado"
    When consulto las alertas
    Then veo la alerta en el listado

  Scenario: Marcar alerta como leída
    Given que existe una alerta activa en el sistema
    And que he iniciado sesión como "Empleado"
    When marco la alerta como leída
    Then la alerta deja de estar activa
