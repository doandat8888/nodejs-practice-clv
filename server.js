const express = require('express');
const app = express();
const userRouter = require('./routes/user.route');
const bodyParser = require('body-parser');

require('dotenv').config();

const PORT = process.env.PORT || 8080;


app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/users', userRouter);


app.listen(PORT, () => {
    console.log('Server running on port', PORT)
})