const express = require('express');
require('dotenv').config();

const port = process.env.PORT || 3030;
const app = express();

app.listen(port, () => console.log(`server running on port ${port}`));
