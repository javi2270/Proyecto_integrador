import React, { useState, useEffect } from "react";
import { Container, Form, Button, Alert, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { createMedicamento } from "../services/medicamento.service";
import { getLaboratorios, getlaboratorios } from "../services/laboratorio.service";

const NuevoMedicamentoPage = () => {
	const navigate = useNavigate()

// Estados
	const [laboratorios, setLaboratorios] = useState([]) // para llenar el <select>
	const [error, setError] = useState('')
	
// Estado unico para todo ek formulario
	const [formData, setFormData] = useState({
		nombre: '',
		codigoBarras: '',
		lote: '',
		fechaVencimiento: '',
		stock: 0,
		stockMinimo: 0,
		laboratorio: '' // aca guardo el ID del laboratorio seleccionado
	})

// Cargar laboratorios al iniciar
	useEffect( () => {
		const cargarLabs = async () => {
			try {
				const data = await getLaboratorios()
				setLaboratorios(data)
			} catch (err) {
				setError('Error al cargar los laboratorios')
			}
		}
		cargarLabs()
	}, [])








}

export default NuevoMedicamentoPage;
