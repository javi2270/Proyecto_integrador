Feature: Control de temperatura mensual
  Para cumplir con normativas sanitarias,
  como administrador
  quiero registrar la temperatura mensual del refrigerador
  y asegurar que se controlen incumplimientos.

  Scenario: Registro válido de temperatura mensual
    Given que he iniciado sesión como "Administrador"
    When registro una temperatura mensual de 5 grados
    Then la temperatura queda registrada
    And no existe una alerta mensual activa

  Scenario: Falta de registro mensual genera alerta
    Given que no se registró temperatura en el mes actual
    When el sistema ejecuta la verificación mensual
    Then se genera una alerta de temperatura mensual
