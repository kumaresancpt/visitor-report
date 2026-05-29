using Backend.Models;
using iTextSharp.text;
using iTextSharp.text.pdf;

namespace Backend.Services;

public class PdfExportService : IPdfExportService
{
    public async Task<byte[]> GenerateAsync(List<VisitRecord> data, ReportExportRequest request)
    {
        return await Task.FromResult(GeneratePdf(data, request));
    }
    
    private byte[] GeneratePdf(List<VisitRecord> data, ReportExportRequest request)
    {
        using (var ms = new MemoryStream())
        {
            var document = new Document(PageSize.A4.Rotate());
            var writer = PdfWriter.GetInstance(document, ms);
            document.Open();
            
            var titleFont = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 16);
            var headerFont = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 10);
            var cellFont = FontFactory.GetFont(FontFactory.HELVETICA, 9);
            
            document.Add(new Paragraph($"Visitor Report: {request.ReportType}", titleFont)
            {
                Alignment = Element.ALIGN_CENTER,
                SpacingAfter = 10
            });
            
            document.Add(new Paragraph($"Period: {request.DateFrom:MMM dd, yyyy} - {request.DateTo:MMM dd, yyyy}")
            {
                Alignment = Element.ALIGN_CENTER,
                SpacingAfter = 5
            });
            
            document.Add(new Paragraph($"Generated: {DateTime.Now:MMM dd, yyyy HH:mm:ss}")
            {
                Alignment = Element.ALIGN_CENTER,
                SpacingAfter = 20
            });
            
            var table = new PdfPTable(12);
            table.WidthPercentage = 100;
            
            string[] headers = { "Sr No", "Visitor Name", "Company", "Host Employee", "Department", "ID Type", "Check-in Date", "Check-in Time", "Check-out Time", "Duration", "Purpose", "Status" };
            
            foreach (var header in headers)
            {
                var cell = new PdfPCell(new Phrase(header, headerFont))
                {
                    BackgroundColor = new iTextSharp.text.BaseColor(200, 200, 200),
                    HorizontalAlignment = Element.ALIGN_CENTER,
                    Padding = 5
                };
                table.AddCell(cell);
            }
            
            int rowNum = 1;
            foreach (var record in data)
            {
                var bgColor = rowNum % 2 == 0 ? new iTextSharp.text.BaseColor(240, 240, 240) : iTextSharp.text.BaseColor.WHITE;
                
                table.AddCell(CreateCell(rowNum.ToString(), cellFont, bgColor));
                table.AddCell(CreateCell(record.VisitorName, cellFont, bgColor));
                table.AddCell(CreateCell(record.Company, cellFont, bgColor));
                table.AddCell(CreateCell(record.HostEmployee, cellFont, bgColor));
                table.AddCell(CreateCell(record.Department, cellFont, bgColor));
                table.AddCell(CreateCell(record.IdTypeMasked, cellFont, bgColor));
                table.AddCell(CreateCell(record.CheckInDate.ToString("MMM dd, yyyy"), cellFont, bgColor));
                table.AddCell(CreateCell(record.CheckInTime.ToString(@"hh\:mm"), cellFont, bgColor));
                table.AddCell(CreateCell(record.CheckOutTime?.ToString(@"hh\:mm") ?? "-", cellFont, bgColor));
                table.AddCell(CreateCell(record.TotalDuration, cellFont, bgColor));
                table.AddCell(CreateCell(record.VisitPurpose, cellFont, bgColor));
                table.AddCell(CreateCell(record.Status, cellFont, bgColor));
                
                rowNum++;
            }
            
            document.Add(table);
            
            document.Close();
            writer.Close();
            
            return ms.ToArray();
        }
    }
    
    private PdfPCell CreateCell(string text, Font font, iTextSharp.text.BaseColor bgColor)
    {
        return new PdfPCell(new Phrase(text, font))
        {
            BackgroundColor = bgColor,
            Padding = 5,
            BorderWidth = 0.5f
        };
    }
}
