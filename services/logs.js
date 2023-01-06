const db = require('../services/db');
const config = require('../config');
const devices = require('./devices')

function getMultiple(page = 1) {
  const offset = (page - 1) * config.listPerPage;
  const data = db.query(`SELECT * FROM monitoring LIMIT ?,?`, [offset, config.listPerPage]);
  const meta = {page};

  return {
    data,
    meta
  }
}

function getAll(){
  const data = db.query("SELECT * FROM monitoring ORDER BY id DESC", [])
  return data
}

function getLatest(req){
  let data;
  if(req && Object.keys(req).length > 0){
    data = db.query("SELECT * FROM monitoring WHERE uuid='"+req.id+"' ORDER BY id DESC LIMIT 20", []);
  } else {
    data = db.query("SELECT * FROM monitoring ORDER BY id DESC LIMIT 20", []);
  }

  return data
}

function getCoords(){
  let results = [];
  devices.get()?.forEach(element => {
    results.push({
      name  : element.name,
      data  : db.query("SELECT CAST(lat as numeric(10,8)) as lat, CAST(lng as numeric(10,8)) as lng, CAST(rssi as numeric(10,8)) as rssi, CAST(snr as numeric(10,8)) as snr, CAST(cpu as numeric(10,8)) as cpu, CAST(ram as numeric(10,8)) as ram, CAST(rom as numeric(10,8)) as rom FROM monitoring WHERE uuid='"+element.name+"' ORDER BY uuid DESC LIMIT 200", [])
    })
  });
  // let results = [
  //   {
  //     name : "MKRRMP011222",
  //     data : db.query("SELECT CAST(lat as numeric(10,8)) as lat, CAST(lng as numeric(10,8)) as lng FROM monitoring WHERE uuid='MKRRMP011222' ORDER BY uuid DESC LIMIT 200", [])
  //   },
  //   {
  //     name : "MKRRMP021222",
  //     data : db.query("SELECT CAST(lat as numeric(10,8)) as lat, CAST(lng as numeric(10,8)) as lng FROM monitoring WHERE uuid='MKRRMP021222' ORDER BY uuid DESC LIMIT 200", [])
  //   },
  //   {
  //     name : "MKRRMP031222",
  //     data : db.query("SELECT CAST(lat as numeric(10,8)) as lat, CAST(lng as numeric(10,8)) as lng FROM monitoring WHERE uuid='MKRRMP031222' ORDER BY uuid DESC LIMIT 200", [])
  //   }
  // ]

  return results
}

function validateLatLng(lat, lng) {    
  let pattern = new RegExp('^-?([1-8]?[1-9]|[1-9]0)\\.{1}\\d{1,6}');
  
  return pattern.test(lat) && pattern.test(lng);
}

function create(object) {
  try {
    const { id, lat, lng, alt, sog, cog, accx, accy, accz, gyrox, gyroy, gyroz, magx, magy, magz, roll, pitch, yaw, suhu, rh, cahaya, vbat, times, rssi, snr, cpu, ram, rom } = object
    // const latVal = new RegExp("/^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,15}/g").exec(parseFloat(lat))
    // const lngVal = new RegExp("/^-?(([-+]?)([\d]{1,3})((\.)(\d+))?)/g").exec(parseFloat(lng))
    const result = db.run(`
    INSERT INTO monitoring 
    (
        uuid, lat, lng, alt, sog, cog, accx, accy, accz, gyrox, gyroy, gyroz,
        magx, magy, magz, roll, pitch, yaw, suhu, rh, cahaya, vbat, timestamp, rssi, snr, cpu, ram, rom
    ) VALUES (
        @id, @lat, @lng, @alt, @sog, @cog, @accx, @accy, @accz, @gyrox, @gyroy, @gyroz, 
        @magx, @magy, @magz, @roll, @pitch, @yaw, @suhu, @rh, @cahaya, @vbat, @times, @rssi, @snr, @cpu, @ram, @rom
    )`, {
        id, lat, lng, alt, sog, cog, accx, accy, accz, gyrox, gyroy, gyroz, 
        magx, magy, magz, roll, pitch, yaw, suhu, rh, cahaya, vbat, times, rssi, snr, cpu, ram, rom
    });
    console.log(times+": ok");
  } catch (error) {
    console.log(error)
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
  getAll,
  create,
  empty
}