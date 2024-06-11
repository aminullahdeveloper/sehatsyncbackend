const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config(); 
const cors = require('cors'); 
const app = express();
const port = 4000;


const apiRoutes = require('./routes/apiRoutes');
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use('/api', apiRoutes);
app.get('/', (req, res) => res.send("My Api is running"));


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
