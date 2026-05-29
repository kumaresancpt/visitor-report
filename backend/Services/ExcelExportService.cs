using Backend.Models;
using OfficeOpenXml;

namespace Backend.Services;

public class ExcelExportService : IExcelExportService
{
    public ExcelExportService()
    {
        ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
    }
    
    public async Task<byte[]> GenerateAsync(List<VisitRecord> data, ReportExportRequest request)
    {
        return await Task.FromResult(GenerateExcel(data, request));
    }
    
    private byte[] GenerateExcel(List<VisitRecord> data, ReportExportRequest request)
    {
        using (var package = new ExcelPackage())
        {
            var summarySheet = package.Workbook.Worksheets.Add("Summary");
            summarySheet.Cells["A1"].Value = "Report Type";
            summarySheet.Cells["B1"].Value = request.ReportType;
            summarySheet.Cells["A2"].Value = "Period From";
            summarySheet.Cells["B2"].Value = request.DateFrom.ToString("MMM dd, yyyy");
            summarySheet.Cells["A3"].Value = "Period To";
            summarySheet.Cells["B3"].Value = request.DateTo.ToString("MMM dd, yyyy");
            summarySheet.Cells["A4"].Value = "Total Records";
            summarySheet.Cells["B4"].Value = data.Count;
            summarySheet.Cells["A5"].Value = "Generated";
            summarySheet.Cells["B5"].Value = DateTime.Now.ToString("MMM dd, yyyy HH:mm:ss");
            
            summarySheet.Columns[1].AutoFit();
            summarySheet.Columns[2].AutoFit();
            
            var dataSheet = package.Workbook.Worksheets.Add("Data");
            
            string[] headers = { "Sr No", "Visitor Name", "Company", "Host Employee", "Department", "ID Type", "Check-in Date", "Check-in Time", "Check-out Time", "Duration", "Purpose", "Status" };
            
            for (int col = 0; col < headers.Length; col++)
            {
                var cell = dataSheet.Cells[1, col + 1];
                cell.Value = headers[col];
                cell.Style.Font.Bold = true;
                cell.Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                cell.Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.LightGray);
                cell.Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
            }
            
            dataSheet.View.FreezePanes(2, 1);
            
            int row = 2;
            for (int i = 0; i < data.Count; i++)
            {
                var record = data[i];
                dataSheet.Cells[row, 1].Value = i + 1;
                dataSheet.Cells[row, 2].Value = record.VisitorName;
                dataSheet.Cells[row, 3].Value = record.Company;
                dataSheet.Cells[row, 4].Value = record.HostEmployee;
                dataSheet.Cells[row, 5].Value = record.Department;
                dataSheet.Cells[row, 6].Value = record.IdTypeMasked;
                dataSheet.Cells[row, 7].Value = record.CheckInDate.ToString("MMM dd, yyyy");
                dataSheet.Cells[row, 8].Value = record.CheckInTime.ToString(@"hh\:mm");
                dataSheet.Cells[row, 9].Value = record.CheckOutTime?.ToString(@"hh\:mm") ?? "-";
                dataSheet.Cells[row, 10].Value = record.TotalDuration;
                dataSheet.Cells[row, 11].Value = record.VisitPurpose;
                dataSheet.Cells[row, 12].Value = record.Status;
                
                row++;
            }
            
            for (int col = 1; col <= headers.Length; col++)
            {
                dataSheet.Column(col).AutoFit();
            }
            
            return package.GetAsByteArray();
        }
    }
}
