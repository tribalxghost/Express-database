const express = require('express')
const db = require('../db')
const router = new express.Router()



router.get("/", async function(req, res, next){
    try{
        const results = await db.query(
            `SELECT *
            FROM invoices
            `)
        return res.json({"invoice": results.rows[0]})
    }catch(err){
        return next(err)
    }
})



router.get("/:id", async function(req, res, next) {
    try{
        let {id} = req.params
        const results = await db.query(`
        SELECT *
        FROM invoices
        INNER JOIN companies 
        ON invoices.comp_code = companies.code
        WHERE id = $1
        `,[id])
        return res.json(results.rows[0])

    }catch(err){
        return next(err)
    }
})


router.post("/", async function(req, res, next){
    try{
        let {comp_code, amt} = req.body
        const results = await db.query(`
        INSERT INTO invoices (comp_code, amt)
        VALUES ($1, $2)
        RETURNING *
       
        `,[comp_code, amt])
        return res.status(201).json({"invoice": results.rows[0] })

    }catch(err){
        return next(err)
    }
})

router.put("/:id", async function(req, res, next){
    try{
        let { amt, paid } = req.body
        let { id } = req.params
        let date = new Date().toLocaleDateString();
        if(amt){
            const results = await db.query(`
            UPDATE invoices
            SET amt = $1, paid = $3, paid_date = $4
            WHERE id = $2
            RETURNING *
            `,[amt, id, paid, date])
            res.status(201).json({"invoice": results.rows[0]})
    
        } else {
            const results = await db.query(`
            UPDATE invoices
            SET  paid = NULL
            WHERE id = $2
            RETURNING *
            `,)
            res.status(201).json({"invoice": results.rows[0]})
        }

        
    }catch(err){
        return next(err)
    }
})


router.delete("/:id", async function(req, res, next){
    let {id} = req.params
    const results = await db.query(`
    DELETE 
    FROM invoices
    WHERE id = $1
    RETURNING *
    `,[id])
    res.status(201).json({"status":"deleted"})
})









module.exports = router