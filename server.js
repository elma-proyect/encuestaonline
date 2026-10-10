const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Servir archivos estáticos desde el directorio actual
app.use(express.static(path.join(__dirname, '.')));

// Si alguien entra a la raíz, enviamos el index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Servidor iniciado en el puerto ${port}`);
});
