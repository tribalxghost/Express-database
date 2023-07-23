const express = require('express');
const db = require('../db');
const slugify = require('slugify')
const router = new express.Router();


router.get("/", async function (req, res, next) {
    try {
        const results = await db.query(
            'SELECT * FROM companies'
        )
        return res.json({ "companies": results.rows })
    } catch (err) {
        next(err)
    }
});

router.get("/:code", async function (req, res, next) {
    try {
        let code = req.params.code
        const results = await db.query(
            `SELECT *
            FROM companies 
            LEFT JOIN invoices
            ON invoices.comp_code = companies.code
            WHERE code = $1`, [code]
        )
        return res.json(results.rows[0])

    } catch (err) {
        next(err)
    }
})

router.post("/", async function (req,res, next) {
    try {
        let {code, name, description } = req.body
        console.log(code)
        const results = await db.query(
            `INSERT INTO companies (code, name, description)
            VALUES ($1, $2, $3)
            RETURNING code, name, description`,
            [code, name, description]);

        return res.status(201).json({"company":results.rows[0]})


    } catch (err) {
       return  next(err)
    }
})

router.put("/", async function (req, res, next){
    try{
        let {code, name, description} = req.body
        console.log(code)
        const results = await db.query(
            `UPDATE companies
            SET name = $2, description =$3
            WHERE code = $1
            RETURNING code, name, description`,
            [code, name, description]
        )
        return res.status(201).json({"company":results.rows[0]})
    }catch(err){
        return next(err)
    }
})

router.delete("/:code", async function(req, res, next){
    let {code} = req.params
    console.log(code)
    try{
        const results = await db.query(
            `DELETE
            FROM companies
            WHERE code = $1
            RETURNING code, name, description`,
            [code]
        )
        res.status(201).json({"status": "deleted"})
    }catch(err){
        return next(err)
    }


})




module.exports = router