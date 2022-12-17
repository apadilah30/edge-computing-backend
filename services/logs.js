const db = require('../services/db');
const config = require('../config');

function getMultiple(page = 1) {
  const offset = (page - 1) * config.listPerPage;
  const data = db.query(`SELECT * FROM monitoring LIMIT ?,?`, [offset, config.listPerPage]);
  const meta = {page};

  return {
    data,
    meta
  }
}

function getLatest(){
  const data = db.query("SELECT * FROM monitoring ORDER BY uuid DESC LIMIT 10", [])
  return data
}

function getCoords(){
  const data = db.query("SELECT CAST(lat as numeric(10,8)) as lat, CAST(lng as numeric(10,8)) as lng FROM monitoring ORDER BY uuid DESC LIMIT 500", [])

  return data
}

function validateLatLng(lat, lng) {    
  let pattern = new RegExp('^-?([1-8]?[1-9]|[1-9]0)\\.{1}\\d{1,6}');
  
  return pattern.test(lat) && pattern.test(lng);
}

function create(object) {
  try {
    const { id, lat, lng, alt, sog, cog, accx, accy, accz, gyrox, gyroy, gyroz, magx, magy, magz, roll, pitch, yaw, suhu, rh, cahaya, vbat, times } = object
    // const latVal = new RegExp("/^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,15}/g").exec(parseFloat(lat))
    // const lngVal = new RegExp("/^-?(([-+]?)([\d]{1,3})((\.)(\d+))?)/g").exec(parseFloat(lng))
    console.log(
      !isNaN(parseFloat(lat)), 
      !isNaN(parseFloat(lng)),
      parseFloat(lat), 
      parseFloat(lng)
    )
    if(!isNaN(parseFloat(lng)) && !isNaN(parseFloat(lat))){
      const result = db.run(`
      INSERT INTO monitoring 
      (
          id, lat, lng, alt, sog, cog, accx, accy, accz, gyrox, gyroy, gyroz,
          magx, magy, magz, roll, pitch, yaw, suhu, rh, cahaya, vbat, times
      ) VALUES (
          @id, @lat, @lng, @alt, @sog, @cog, @accx, @accy, @accz, @gyrox, @gyroy, @gyroz, 
          @magx, @magy, @magz, @roll, @pitch, @yaw, @suhu, @rh, @cahaya, @vbat, @times
      )`, {
          id, lat, lng, alt, sog, cog, accx, accy, accz, gyrox, gyroy, gyroz, 
          magx, magy, magz, roll, pitch, yaw, suhu, rh, cahaya, vbat, times
      });
    }
  
    let message = 'Error in creating Logs';
    return {message};
    
  } catch (error) {
    console.log(error)
    return 'error cuy'
  }
}

function empty(){
  const data = db.run("DELETE FROM monitoring", [])
  return "completed"
}

module.exports = {
  getMultiple,
  getLatest,
  getCoords,
  create,
  empty
}