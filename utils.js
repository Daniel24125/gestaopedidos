const ExcelJS = require('exceljs');


module.exports = ()=>{
    return {
        saveDataToExcel:  (data, sheetTitle)=>{
            const workbook = new ExcelJS.Workbook();
            const metadata_ws = workbook.addWorksheet(sheetTitle);
            metadata_ws.addRows(data)
            return workbook
        }
    }
}