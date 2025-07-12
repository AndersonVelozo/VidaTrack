require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db'); // Agora usando nosso novo db.js
const pacientesRouter = require('./routes/pacientes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Injetar o pool de conexão no app
app.locals.pool = db;

// Rotas
app.use('/api/pacientes', pacientesRouter);

// Rota de saúde
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro interno' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});