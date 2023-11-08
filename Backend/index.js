const connectDB = require('./db');
const express = require('express');
var cors=require('cors');

//connectDB();
const app = express();
const PORT=5000;
connectDB();
app.use(cors());
app.use(express.json());


app.use('https://notes-application-a7e9hd5dg-surya-prakashs-projects-7fb03da7.vercel.app/api/auth',require('./routers/auth.js'));
app.use('https://notes-application-a7e9hd5dg-surya-prakashs-projects-7fb03da7.vercel.app/api/notes',require('./routers/notes'));




app.listen(PORT, () => {
    console.log(`Todolist listening at http://localhost:${PORT}`);
})
