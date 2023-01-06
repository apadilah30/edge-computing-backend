const db = require('../services/db');

function get() {
    let data = db.query("SELECT * FROM settings LIMIT 1", [])
    return data
}

function update(object) {
    try {
        const { request_time } = object
        
        const result = db.run(`
        UPDATE settings 
        SET request_time=@request_time
        WHERE id=1`, {
            request_time
        });

        return result
    } catch (error) {
        console.log(error)
        return "Error :"+error
    }
}

module.exports = {
    get,
    update
}