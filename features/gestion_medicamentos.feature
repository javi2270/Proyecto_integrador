# language: es
Feature: Gestion de Medicamentos

	Para mantener un inventario preciso y funcional,
	como empleado de farmacia, quiero poder registrar, actualizar y consultar
	los medicamentos refrigerados del sistema.

	Scenario: Registro exitoso de un nuevo medicamento
		Given que he iniciado sesión como "Empleado"
		And estoy en la pantalla de "Gestión de medicamentos"
		When completo el formulario con los siguientes datos:
			| nombre            | codigoBarras    | lote      | fechaVencimiento | stock |
			| "Lantus Solostar" | "1234567890123" | "LOTE001" | "2026-10-13"     | "5"   |
		And presiono el botón "Guardar"
		Then el sistema muestra un mensaje de confirmación "Medicamento guardado con éxito"
		And el medicamento "Lantus Solostar" aparece en el listado de medicamentos

	Scenario: Intento de registro con datos faltantes
		Given que he iniciado sesión como "Empleado"
		And estoy en la pantalla de "Gestión de medicamentos"
		When completo el formulario con los siguientes datos:
			| nombre | codigoBarras    | lote      | fechaVencimiento | stock |
			| ""     | "1234567890124" | "LOTE002" | "2026-10-13"     | "5"   |
		And presiono el botón "Guardar"
		Then el sistema muestra un mensaje de error "El campo \"nombre\" no puede estar vacío."
		And el medicamento no aparece en el listado de medicamentos

	Scenario: Intento de registro con datos inválidos
		Given que he iniciado sesión como "Empleado"
		And estoy en la pantalla de "Gestión de medicamentos"
		When completo el formulario con los siguientes datos:
			| nombre            | codigoBarras | lote      | fechaVencimiento | stock |
			| "Lantus Solostar" | "12345"      | "LOTE003" | "2026-10-13"     | "5"   |
		And presiono el botón "Guardar"
		Then el sistema muestra un mensaje de error "El \"codigoBarras\" debe consistir en exactamente 13 dígitos numéricos."
		And el medicamento no aparece en el listado de medicamentos

	Scenario: Intento de registro con fecha de vencimiento pasada
		Given que he iniciado sesión como "Empleado"
		And estoy en la pantalla de "Gestión de medicamentos"
		When completo el formulario con los siguientes datos:
			| nombre            | codigoBarras    | lote      | fechaVencimiento | stock |
			| "Lantus Solostar" | "1234567890125" | "LOTE004" | "2022-10-13"     | "5"   |
		And presiono el botón "Guardar"
		Then el sistema muestra un mensaje de error "La fecha de vencimiento no puede ser pasada"
		And el medicamento no aparece en el listado de medicamentos

	Scenario: Intento de registro con stock negativo
		Given que he iniciado sesión como "Empleado"
		And estoy en la pantalla de "Gestión de medicamentos"
		When completo el formulario con los siguientes datos:
			| nombre            | codigoBarras    | lote      | fechaVencimiento | stock |
			| "Lantus Solostar" | "1234567890126" | "LOTE005" | "2026-10-13"     | "-10" |
		And presiono el botón "Guardar"
		Then el sistema muestra un mensaje de error "El \"stock\" no puede ser un número negativo."
		And el medicamento no aparece en el listado de medicamentos