import express from 'express';
import router from './src/users/routes.js';

const app = express();
const port = 3000;
  
app.use(express.json());

// Ruta inicial para iniciar el proceso
app.get("/", async (req, res) => {
    res.send("Conected!");
});

app.use('/api/v1/users', router);

// Iniciar servidor
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});