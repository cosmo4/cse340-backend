const pool = require("../database/")

async function getClassifications(){
    return await pool.query(`SELECT * FROM public.classification ORDER BY classification_name`)
}

async function getInventoryByClassificationId(classification_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i 
            JOIN public.classification AS c 
            ON i.classification_id = c.classification_id 
            WHERE i.classification_id = $1`,
            [classification_id]
        )
        return data.rows
    } catch (error) {
        console.error("getclassificationsbyid error " + error)
    }
}

async function getVehicleByInventoryId(inventory_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory
            WHERE inv_id = $1`,
            [inventory_id]
        )
        return data.rows

    } catch (error) {
        console.log("getvehiclebyinventoryid error" + error)
    }
}

// Add new Classification
async function addClassification(classification_name) {
    try {
        const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING*"
        return await pool.query(sql, [classification_name])
    } catch (error) {
        return error.message
    }
}

// Check if classification exists
async function checkExistingClassification(classification_name) {
    try {
        const sql = "SELECT * FROM classification WHERE classification_name = $1"
        const classification = await pool.query(sql, [classification_name])
        return classification.rowCount
    } catch (error) {
        console.log("checkExistingClassification error: " + error.message)
    }
}


module.exports = {getClassifications, getInventoryByClassificationId, getVehicleByInventoryId, addClassification, checkExistingClassification}


