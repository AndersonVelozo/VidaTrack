const express = require('express');
const router = express.Router();
const { SinalVital, Paciente } = require('../models');

// POST /api/pacientes/:id/sinais
router.post('/:id/sinais', async (req, res) => {
  try {
    // Verifica se o paciente existe
    const paciente = await Paciente.findByPk(req.params.id);
    if (!paciente) {
      return res.status(404).json({ error: 'Paciente não encontrado' });
    }

    // Cria o sinal vital associado ao paciente
    const sinalVital = await SinalVital.create({
      ...req.body,
      paciente_id: req.params.id
    });
    
    res.status(201).json(sinalVital);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;