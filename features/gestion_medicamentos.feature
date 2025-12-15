Feature: Gestión de Medicamentos Refrigerados
  Para mantener un inventario preciso y funcional,
  como empleado o administrador
  quiero registrar y consultar medicamentos refrigerados
  para asegurar su correcta gestión.

  Scenario: Registro exitoso de un nuevo medicamento
    Given que he iniciado sesión como "Empleado"
    And estoy en la pantalla de "Gestión de medicamentos"
    When completo el formulario con los siguientes datos:
      | nombre          | codigoBarras  | lote    | fechaVencimiento | stock |
      | Lantus Solostar | 1234567890123 | LOTE001 | 2026-10-13       | 5     |
    And presiono el botón "Guardar"
    Then el sistema muestra un mensaje de confirmación "Medicamento guardado con éxito"
    And el medicamento "Lantus Solostar" aparece en el listado de medicamentos

  Scenario: Intento de registro con datos faltantes
    Given que he iniciado sesión como "Empleado"
    And estoy en la pantalla de "Gestión de medicamentos"
    When completo el formulario con los siguientes datos:
      | nombre | codigoBarras  | lote    | fechaVencimiento | stock |
      |        | 1234567890124 | LOTE002 | 2026-10-13       | 5     |
    And presiono el botón "Guardar"
    Then el sistema muestra un mensaje de error "El campo \"nombre\" no puede estar vacío."
    And el medicamento no aparece en el listado de medicamentos
