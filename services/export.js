const excelJS = require("exceljs");
const logs = require('./logs');
const exportUser = async (req, res) => {
    console.log('yoooo')
    const workbook = new excelJS.Workbook();  // Create a new workbook
    const worksheet = workbook.addWorksheet("Monitoring Logs"); // New Worksheet
    const path = "./files";  // Path to download excel
    // Column for data in excel. key must match data key
    worksheet.columns = [
        { header: "No", key: "s_no", width: 10 },
        { header: "ID", key: "id", width: 10 },
        { header: "Latitude", key: "lat", width: 10 },
        { header: "Longitude", key: "lng", width: 10 },
        { header: "Altitude", key: "alt", width: 10 },
        { header: "SOG", key: "sog", width: 10 },
        { header: "COG", key: "cog", width: 10 },
        { header: "Acc X", key: "accx", width: 10 },
        { header: "Acc Y", key: "accy", width: 10 },
        { header: "Acc Z", key: "accz", width: 10 },
        { header: "Gyro X", key: "gyrox", width: 10 },
        { header: "Gyro Y", key: "gyroy", width: 10 },
        { header: "Gyro Z", key: "gyroz", width: 10 },
        { header: "Magz X", key: "magx", width: 10 },
        { header: "Magz Y", key: "magy", width: 10 },
        { header: "Magz Z", key: "magz", width: 10 },
        { header: "Roll", key: "roll", width: 10 },
        { header: "Pitch", key: "pitch", width: 10 },
        { header: "Yaw", key: "yaw", width: 10 },
        { header: "Suhu", key: "suhu", width: 10 },
        { header: "Rh", key: "rh", width: 10 },
        { header: "Cahaya", key: "cahaya", width: 10 },
        { header: "VBat(V)", key: "vbat", width: 10 }
    ];
    // Looping through User data
    let counter = 1;
    logs.getAll().forEach((user) => {
        user.s_no = counter;
        worksheet.addRow(user); // Add data in worksheet
        counter++;
    });
    // Making first line in excel bold
    worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
    });
    try {
        
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader("Content-Disposition", "attachment; filename=" + "Logs-Report.xlsx");
        workbook.xlsx.write(res)
            .then(function (data) {
                res.end();
                console.log('File write done........');
            });
        // const data = await workbook.xlsx.writeFile(`${path}/logs.xlsx`)
        //     .then(() => {
        //         res.send({
        //             status: "success",
        //             message: "file successfully downloaded",
        //             path: `${path}/users.xlsx`,
        //         });
        //     });
    } catch (err) {
        res.send({
            status: "error",
            message: err
        });
    }
};
module.exports = exportUser;