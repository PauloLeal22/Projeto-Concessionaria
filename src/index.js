import express from 'express';
import path from 'path';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import flash from 'express-flash';

import { fileURLToPath } from 'url';
import { router } from './routes.js';

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Config url
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Config route views
app.set('views', path.join(__dirname, 'views'));

// Config view engine
app.set('view engine', 'ejs');

// Config static
app.use(express.static(path.join(__dirname, 'public')));

// Config session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 60000
    }
}));

app.use(cookieParser('zlatanibrahimovic'));

app.use(flash());

// Config routes
app.use(router);

app.listen(port, () => console.log(`Servidor em execução na porta ${port}...`));