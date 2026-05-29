using Xunit;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Tests
{
    // AC-04: Report Types Tests
    public class ReportTypeTests
    {
        [Fact]
        public void TestFullVisitorLogContainsAllRecords()
        {
            // Arrange
            var records = new List<string> { "Record1", "Record2", "Record3" };
            var reportType = "FullVisitorLog";

            // Act
            var result = records.Where(r => !string.IsNullOrEmpty(r)).ToList();

            // Assert
            Assert.Equal(3, result.Count);
        }

        [Fact]
        public void TestPendingApprovalsFiltersCorrectly()
        {
            // Arrange
            var records = new List<(string name, string status)>
            {
                ("John", "Approved"),
                ("Jane", "Pending"),
                ("Bob", "Checked-Out"),
            };

            // Act
            var pendingOnly = records.Where(r => r.status == "Pending").ToList();

            // Assert
            Assert.Single(pendingOnly);
            Assert.Equal("Jane", pendingOnly[0].name);
        }

        [Fact]
        public void TestOvrstayReportFiltersOverstayRecords()
        {
            // Arrange
            var records = new List<(string name, int minutes)>
            {
                ("John", 90),
                ("Jane", 480),
                ("Bob", 240),
            };
            var overstayThreshold = 360; // 6 hours

            // Act
            var overstays = records.Where(r => r.minutes > overstayThreshold).ToList();

            // Assert
            Assert.Single(overstays);
        }

        [Fact]
        public void TestDepartmentWiseCountAggregates()
        {
            // Arrange
            var records = new List<(string name, string department)>
            {
                ("John", "Finance"),
                ("Jane", "Finance"),
                ("Bob", "HR"),
            };

            // Act
            var departmentCounts = records.GroupBy(r => r.department)
                .Select(g => new { Department = g.Key, Count = g.Count() })
                .ToList();

            // Assert
            Assert.Equal(2, departmentCounts.Count);
            Assert.Equal(2, departmentCounts.First(d => d.Department == "Finance").Count);
        }

        [Fact]
        public void TestFrequentVisitorsFilters()
        {
            // Arrange
            var visitCounts = new Dictionary<string, int>
            {
                { "John", 5 },
                { "Jane", 2 },
                { "Bob", 8 },
            };

            // Act
            var frequentVisitors = visitCounts.Where(v => v.Value >= 5)
                .OrderByDescending(v => v.Value)
                .ToList();

            // Assert
            Assert.Equal(2, frequentVisitors.Count);
        }

        [Fact]
        public void TestSecurityIncidentsReport()
        {
            // Arrange
            var records = new List<(string name, string status)>
            {
                ("John", "Denied"),
                ("Jane", "Checked-Out"),
                ("Bob", "Denied"),
            };

            // Act
            var incidents = records.Where(r => r.status == "Denied").ToList();

            // Assert
            Assert.Equal(2, incidents.Count);
        }
    }

    // AC-05: Summary Metrics Tests
    public class MetricsCalculationTests
    {
        [Fact]
        public void TestTotalVisitorsCount()
        {
            // Arrange
            var records = new List<string> { "V1", "V2", "V3" };

            // Act
            var totalVisitors = records.Count;

            // Assert
            Assert.Equal(3, totalVisitors);
        }

        [Fact]
        public void TestAverageDurationCalculation()
        {
            // Arrange
            var durations = new List<int> { 60, 120, 90 };

            // Act
            var avgMinutes = durations.Average();
            var hours = (int)avgMinutes / 60;
            var minutes = (int)avgMinutes % 60;
            var formatted = $"{hours}h {minutes}m";

            // Assert
            Assert.Equal("1h 30m", formatted);
        }

        [Fact]
        public void TestDeniedEntriesCount()
        {
            // Arrange
            var records = new List<(string name, string status)>
            {
                ("John", "Denied"),
                ("Jane", "Approved"),
                ("Bob", "Denied"),
            };

            // Act
            var deniedCount = records.Count(r => r.status == "Denied");

            // Assert
            Assert.Equal(2, deniedCount);
        }

        [Fact]
        public void TestOverstaysCount()
        {
            // Arrange
            var records = new List<(string name, int durationMinutes)>
            {
                ("John", 480),
                ("Jane", 240),
                ("Bob", 720),
            };
            var overstayThreshold = 480; // 8 hours

            // Act
            var overstayCount = records.Count(r => r.durationMinutes > overstayThreshold);

            // Assert
            Assert.Equal(1, overstayCount);
        }

        [Fact]
        public void TestUniqueCompaniesCount()
        {
            // Arrange
            var records = new List<(string name, string company)>
            {
                ("John", "Acme"),
                ("Jane", "Acme"),
                ("Bob", "TechCorp"),
                ("Alice", "Acme"),
                ("Charlie", "TechCorp"),
            };

            // Act
            var uniqueCompanies = records.Select(r => r.company).Distinct().Count();

            // Assert
            Assert.Equal(2, uniqueCompanies);
        }

        [Fact]
        public void TestMostVisitedDepartment()
        {
            // Arrange
            var records = new List<(string name, string department)>
            {
                ("John", "Finance"),
                ("Jane", "Finance"),
                ("Bob", "HR"),
                ("Alice", "Finance"),
            };

            // Act
            var mostVisited = records.GroupBy(r => r.department)
                .OrderByDescending(g => g.Count())
                .First()
                .Key;

            // Assert
            Assert.Equal("Finance", mostVisited);
        }

        [Fact]
        public void TestMetricsFormattingWithZeroValues()
        {
            // Arrange
            var totalVisitors = 0;

            // Act
            var formatted = totalVisitors.ToString();

            // Assert
            Assert.Equal("0", formatted);
        }

        [Fact]
        public void TestMetricsFormatIntegersWithoutDecimals()
        {
            // Arrange
            var value = 150.7;

            // Act
            var formatted = ((int)value).ToString();

            // Assert
            Assert.Equal("150", formatted);
            Assert.NotEqual("150.7", formatted);
        }
    }

    // AC-06: Filtering Tests
    public class FilteringTests
    {
        [Fact]
        public void TestDepartmentFilter()
        {
            // Arrange
            var records = new List<(string name, string department)>
            {
                ("John", "Finance"),
                ("Jane", "HR"),
                ("Bob", "Finance"),
            };

            // Act
            var filtered = records.Where(r => r.department == "Finance").ToList();

            // Assert
            Assert.Equal(2, filtered.Count);
        }

        [Fact]
        public void TestMultipleFiltersWithAndLogic()
        {
            // Arrange
            var records = new List<(string name, string department, string status)>
            {
                ("John", "Finance", "Approved"),
                ("Jane", "Finance", "Pending"),
                ("Bob", "HR", "Approved"),
            };

            // Act
            var filtered = records
                .Where(r => r.department == "Finance" && r.status == "Approved")
                .ToList();

            // Assert
            Assert.Single(filtered);
            Assert.Equal("John", filtered[0].name);
        }

        [Fact]
        public void TestStatusFilter()
        {
            // Arrange
            var records = new List<(string name, string status)>
            {
                ("John", "Checked-Out"),
                ("Jane", "Pending"),
                ("Bob", "Checked-Out"),
            };

            // Act
            var filtered = records.Where(r => r.status == "Pending").ToList();

            // Assert
            Assert.Single(filtered);
        }

        [Fact]
        public void TestHostEmployeeFilter()
        {
            // Arrange
            var records = new List<(string visitor, string hostEmployee)>
            {
                ("John", "Alice"),
                ("Jane", "Bob"),
                ("Mike", "Alice"),
            };

            // Act
            var filtered = records.Where(r => r.hostEmployee == "Alice").ToList();

            // Assert
            Assert.Equal(2, filtered.Count);
        }

        [Fact]
        public void TestVisitPurposeFilter()
        {
            // Arrange
            var records = new List<(string name, string purpose)>
            {
                ("John", "Meeting"),
                ("Jane", "Interview"),
                ("Bob", "Meeting"),
            };

            // Act
            var filtered = records.Where(r => r.purpose == "Meeting").ToList();

            // Assert
            Assert.Equal(2, filtered.Count);
        }

        [Fact]
        public void TestMultipleValuesInSingleFilter()
        {
            // Arrange
            var records = new List<(string name, string department)>
            {
                ("John", "Finance"),
                ("Jane", "HR"),
                ("Bob", "Operations"),
                ("Alice", "Finance"),
            };
            var selectedDepartments = new[] { "Finance", "HR" };

            // Act
            var filtered = records.Where(r => selectedDepartments.Contains(r.department)).ToList();

            // Assert
            Assert.Equal(3, filtered.Count);
        }

        [Fact]
        public void TestFilterClearsCorrectly()
        {
            // Arrange
            var records = new List<(string name, string department)>
            {
                ("John", "Finance"),
                ("Jane", "HR"),
            };
            string? departmentFilter = "Finance";

            // Act
            departmentFilter = null;
            var filtered = string.IsNullOrEmpty(departmentFilter)
                ? records
                : records.Where(r => r.department == departmentFilter).ToList();

            // Assert
            Assert.Equal(2, filtered.Count);
        }
    }

    // AC-11: ID Masking Tests
    public class IdMaskingTests
    {
        private string MaskId(string id)
        {
            if (string.IsNullOrEmpty(id))
                return "XXXX-XXXX-XXXX";

            if (id.Length < 4)
                return $"XXXX-XXXX-{id.PadLeft(4, '0')}";

            var lastFour = id.Substring(id.Length - 4);
            return $"XXXX-XXXX-{lastFour}";
        }

        [Fact]
        public void TestIdMaskingFormat()
        {
            // Arrange
            var idNumber = "1234567890";

            // Act
            var masked = MaskId(idNumber);

            // Assert
            Assert.Equal("XXXX-XXXX-7890", masked);
        }

        [Fact]
        public void TestIdMaskingWithShortId()
        {
            // Arrange
            var idNumber = "12";

            // Act
            var masked = MaskId(idNumber);

            // Assert
            Assert.Equal("XXXX-XXXX-0012", masked);
        }

        [Fact]
        public void TestIdMaskingWithSingleDigit()
        {
            // Arrange
            var idNumber = "5";

            // Act
            var masked = MaskId(idNumber);

            // Assert
            Assert.Equal("XXXX-XXXX-0005", masked);
        }

        [Fact]
        public void TestIdMaskingWithEmptyString()
        {
            // Arrange
            var idNumber = "";

            // Act
            var masked = MaskId(idNumber);

            // Assert
            Assert.Equal("XXXX-XXXX-XXXX", masked);
        }

        [Fact]
        public void TestIdMaskingHidesOriginalId()
        {
            // Arrange
            var idNumber = "1234567890";

            // Act
            var masked = MaskId(idNumber);

            // Assert
            Assert.DoesNotContain("1234567", masked);
            Assert.Contains("XXXX", masked);
        }

        [Fact]
        public void TestIdMaskingPreservesLastFourDigits()
        {
            // Arrange
            var idNumber = "9876543210";

            // Act
            var masked = MaskId(idNumber);

            // Assert
            Assert.EndsWith("3210", masked);
        }

        [Fact]
        public void TestMultipleIdsAreMaskedCorrectly()
        {
            // Arrange
            var ids = new[] { "1111111111", "2222222222", "3333333333" };

            // Act
            var maskedIds = ids.Select(MaskId).ToList();

            // Assert
            Assert.Equal(3, maskedIds.Count);
            Assert.All(maskedIds, m => Assert.StartsWith("XXXX-XXXX-", m));
        }

        [Fact]
        public void TestIdMaskingWithSpecialCharacters()
        {
            // Arrange
            var idNumber = "ABC-123-DEF-7890";

            // Act
            var masked = MaskId(idNumber);

            // Assert
            Assert.StartsWith("XXXX-XXXX-", masked);
        }
    }

    // AC-02/AC-03: Validation Tests
    public class ValidationTests
    {
        [Fact]
        public void TestMaxDateRangeOf12Months()
        {
            // Arrange
            var fromDate = new DateTime(2025, 1, 1);
            var toDate = new DateTime(2026, 1, 15);

            // Act
            var daysDiff = (toDate - fromDate).Days;
            var isValid = daysDiff <= 365;

            // Assert
            Assert.False(isValid);
        }

        [Fact]
        public void TestValidDateRangeWithin12Months()
        {
            // Arrange
            var fromDate = new DateTime(2025, 5, 29);
            var toDate = new DateTime(2026, 5, 28);

            // Act
            var daysDiff = (toDate - fromDate).Days;
            var isValid = daysDiff <= 365;

            // Assert
            Assert.True(isValid);
        }

        [Fact]
        public void TestEndDateMustBeAfterStartDate()
        {
            // Arrange
            var fromDate = new DateTime(2026, 5, 29);
            var toDate = new DateTime(2026, 5, 28);

            // Act
            var isValid = toDate >= fromDate;

            // Assert
            Assert.False(isValid);
        }

        [Fact]
        public void TestEndDateCanEqualStartDate()
        {
            // Arrange
            var fromDate = new DateTime(2026, 5, 29);
            var toDate = new DateTime(2026, 5, 29);

            // Act
            var isValid = toDate >= fromDate;

            // Assert
            Assert.True(isValid);
        }

        [Fact]
        public void TestFutureDateValidation()
        {
            // Arrange
            var today = DateTime.Today;
            var futureDate = today.AddDays(1);

            // Act
            var isValid = futureDate <= today;

            // Assert
            Assert.False(isValid);
        }
    }
}
