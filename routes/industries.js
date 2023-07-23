const express = require('express');
const db = require('../db');
const router = new express.Router();



// List all industries in database

router.get('/', async function(req, res, next){
    try{
        const results = await db.query(`
        SELECT *
        FROM industries

        `)
        return res.status(201).json(results.rows)
    }catch(e){
        return next(e)
    }

})


// ADD NEW INDUSTRY

router.post('/', async function(req, res, next){
    try{
        let {code, indust_code} = req.body;
        const results = await db.query(`
        INSERT INTO industries
        VALUES ($1, $2)
        RETURNING *
        `, [code, indust_code]);

        return res.json(results.rows[0])


    }catch(e){
        return next(e);
    }
});

//CONNECT INDUSTRY TO COMPANY

router.get('/:code', async function(req, res, next){
    try{
        let { code } = req.params;

        const results = await db.query(`
        SELECT *
        FROM industries
        LEFT JOIN company_industries AS ci
        ON industries.indust_code = ci.industry_code
        LEFT JOIN companies
        ON ci.company_code = companies.code
        WHERE indust_code = $1
        `,[code]);
        return res.json(results.rows);

    }catch(e){
        return next(e)
    }
    
})







module.exports = router;