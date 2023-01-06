const db = require('../services/db');
const config = require('../config');

function get() {
    let data = db.query("SELECT * FROM devices", [])
    return data
}

function show(id) {
    let data = db.query("SELECT * FROM devices WHERE id='"+id+"'", [])
    return data
}

function create(object) {
    try {
        const { name, cpu, ram, rom, bandwidth } = object
        
        const result = db.run(`
        INSERT INTO devices 
        (
            name, cpu, ram, rom, bandwidth
        ) VALUES (
            @name, @cpu, @ram, @rom, @bandwidth
        )`, {
            name, cpu, ram, rom, bandwidth
        });
        console.log(name+": ok");

        return result
    } catch (error) {
        console.log(error)
        return "Error :"+error
    }
}

function update(object) {
    try {
        const { id, name, cpu, ram, rom, bandwidth } = object
        
        const result = db.run(`
        UPDATE devices 
        SET name=@name, cpu=@cpu, ram=@ram, rom=@rom, bandwidth=@bandwidth
        WHERE id=@id`, {
            name, cpu, ram, rom, bandwidth, id
        });
        console.log(name+": ok");

        return result
    } catch (error) {
        console.log(error)
        return "Error :"+error
    }
}

function destroy(id) {
    try {
        const result = db.run(
        `DELETE FROM devices WHERE id=@id`, {
            id
        })
        console.log(id+": ok");
        return "Success"
    } catch (error) {
        console.log(error)
        return "Error :"+error
    }
}


module.exports = {
    get,
    show,
    create,
    update,
    destroy
}