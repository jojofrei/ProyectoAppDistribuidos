const express = require('express');
const router = express.Router();

const db = require('../database');
const { isLoggedIn } = require('../lib/auth');

router.get('/add', isLoggedIn, (req, res) => {
    res.render('links/add');
});

router.post('/add', isLoggedIn, async (req, res) => {
    const { title, url, description } = req.body;
    const newLink = { 
        title,
        url,
        description,
        user_id: req.user.id
    };
    await db.query('INSERT INTO links set ?', [newLink]);
    req.flash('success', 'El enlace se guardó exitosamente');
    res.redirect('/links');
});

router.get('/', isLoggedIn, async (req, res) => {
    const links = await db.query('SELECT * FROM links WHERE user_id = ?', [req.user.id]); 
    console.log(links);  
    res.render('links/list', { links });
});

router.get('/delete/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await db.query('DELETE FROM links WHERE ID = ?', [id]);
    req.flash('success', 'El enlace se eliminó exitosamente');
    res.redirect('/links');
});

router.get('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const links = await db.query('SELECT * FROM links WHERE id = ?', [id]);
    res.render('links/edit', {link: links[0]});
});

router.post('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { title, description, url} = req.body; 
    const newLink = {
        title,
        description,
        url
    };
    await db.query('UPDATE links set ? WHERE id = ?', [newLink, id]);
    req.flash('success', 'El enlace se actualizó exitosamente');
    res.redirect('/links');
});

module.exports = router;