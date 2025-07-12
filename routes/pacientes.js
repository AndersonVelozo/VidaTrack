const express = require('express');
const router = express.Router();
const db = require('../config/database'); // Supondo que você tenha um módulo para conexão com o banco de dados

// Lista de comorbidades pré-definidas
const COMORBIDADES = {
    1: "Diabetes",
    2: "Hipertensão",
    3: "Asma",
    4: "Obesidade",
    5: "Doença Cardíaca",
};

// Rota para listar todos os pacientes
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM pacientes');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rota para adicionar um novo paciente
router.post('/', async (req, res) => {
    const { nome, cpf, idade, sexo, comorbidades } = req.body;

    if (!nome || !cpf || !idade || !sexo) {
        return res.status(400).json({ error: "Dados incompletos" });
    }

    try {
        const result = await db.query(
            'INSERT INTO pacientes (nome, cpf, idade, sexo, comorbidades) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [nome, cpf, idade, sexo, JSON.stringify(comorbidades || [])]
        );
        const novoPaciente = result.rows[0];
        let comorbidadesArray = [];
        if (novoPaciente.comorbidades) {
            try {
                comorbidadesArray = typeof novoPaciente.comorbidades === 'string'
                    ? JSON.parse(novoPaciente.comorbidades)
                    : novoPaciente.comorbidades;
            } catch (e) {
                comorbidadesArray = [];
            }
        }
        res.status(201).json({
            ...novoPaciente,
            comorbidades: comorbidadesArray.map(id => COMORBIDADES[id] || `Desconhecido (ID: ${id})`)
        });
    } catch (error) {
        console.error('Erro ao cadastrar paciente:', error);
        res.status(500).json({ error: "Erro ao cadastrar paciente", detalhe: error.message });
    }
});

// Rota para atualizar um paciente
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, cpf, idade, sexo, comorbidades } = req.body;

    try {
        const result = await db.query(
            'UPDATE pacientes SET nome = $1, cpf = $2, idade = $3, sexo = $4, comorbidades = $5 WHERE id = $6 RETURNING *',
            [nome, cpf, idade, sexo, JSON.stringify(comorbidades || []), id]
        );
        const pacienteAtualizado = result.rows[0];
        res.status(200).json({
            ...pacienteAtualizado,
            comorbidades: pacienteAtualizado.comorbidades 
                ? JSON.parse(pacienteAtualizado.comorbidades).map(id => COMORBIDADES[id] || `Desconhecido (ID: ${id})`) 
                : []
        });
    } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar paciente" });
    }
});

// Rota para excluir um paciente
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await db.query('DELETE FROM pacientes WHERE id = $1', [id]);
        res.status(200).json({ message: "Paciente excluído com sucesso" });
    } catch (error) {
        res.status(500).json({ error: "Erro ao excluir paciente" });
    }
});

module.exports = router;