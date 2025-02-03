const Vehicle = require('../models/Vehicle');
const User = require('../models/User');
const Checkpost = require('../models/Checkpost');
const excel = require('exceljs');
const PDFDocument = require('pdfkit');
const { parse, format } = require('date-fns');

const exportReport = async (req, res) => {
    try {
        const { startDate, endDate, reportType, format } = req.query;
        const data = await generateReportData(req.user, reportType, startDate, endDate);

        switch (format) {
            case 'excel':
                await exportToExcel(res, data, reportType);
                break;
            case 'csv':
                await exportToCSV(res, data, reportType);
                break;
            case 'pdf':
                await exportToPDF(res, data, reportType);
                break;
            default:
                await exportToExcel(res, data, reportType);
        }
    } catch (error) {
        console.error('Export error:', error);
        res.status(500).json({ message: 'Failed to export report' });
    }
};

const generateReportData = async (user, reportType, startDate, endDate) => {
    const dateFilter = {
        createdAt: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
        }
    };

    const checkpostFilter = user.role === 'user' ? { checkpost: user.checkpost } : {};

    switch (reportType) {
        case 'checkpost_entries':
            return await Vehicle.aggregate([
                { 
                    $match: { 
                        ...dateFilter,
                        ...checkpostFilter 
                    } 
                },
                {
                    $lookup: {
                        from: 'checkposts',
                        localField: 'checkpost',
                        foreignField: '_id',
                        as: 'checkpostDetails'
                    }
                },
                { $unwind: '$checkpostDetails' },
                {
                    $lookup: {
                        from: 'vehicletypes',
                        localField: 'vehicleType',
                        foreignField: '_id',
                        as: 'vehicleTypeDetails'
                    }
                },
                { $unwind: '$vehicleTypeDetails' },
                {
                    $group: {
                        _id: {
                            checkpost: '$checkpostDetails._id',
                            checkpostName: '$checkpostDetails.name',
                            vehicleType: '$vehicleTypeDetails.name'
                        },
                        totalEntries: { $sum: 1 },
                        vehicles: { 
                            $push: {
                                vehicleNumber: '$vehicleNumber',
                                entryTime: '$createdAt'
                            }
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            checkpost: '$_id.checkpost',
                            checkpostName: '$_id.checkpostName'
                        },
                        vehicleTypes: {
                            $push: {
                                type: '$_id.vehicleType',
                                count: '$totalEntries',
                                vehicles: '$vehicles'
                            }
                        },
                        totalEntries: { $sum: '$totalEntries' }
                    }
                },
                {
                    $project: {
                        checkpost: '$_id.checkpost',
                        checkpostName: '$_id.checkpostName',
                        vehicleTypes: 1,
                        totalEntries: 1,
                        _id: 0
                    }
                },
                { $sort: { checkpostName: 1 } }
            ]);

        case 'daily_summary':
            return await Vehicle.aggregate([
                { 
                    $match: { 
                        ...dateFilter,
                        ...checkpostFilter 
                    } 
                },
                {
                    $group: {
                        _id: {
                            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                            checkpost: '$checkpost'
                        },
                        totalEntries: { $sum: 1 }
                    }
                },
                {
                    $lookup: {
                        from: 'checkposts',
                        localField: '_id.checkpost',
                        foreignField: '_id',
                        as: 'checkpostDetails'
                    }
                },
                { $unwind: '$checkpostDetails' },
                {
                    $project: {
                        date: '$_id.date',
                        checkpost: '$checkpostDetails.name',
                        totalEntries: 1,
                        _id: 0
                    }
                },
                { $sort: { date: -1, checkpost: 1 } }
            ]);

        case 'vehicle_type_analysis':
            return await Vehicle.aggregate([
                { 
                    $match: { 
                        ...dateFilter,
                        ...checkpostFilter 
                    } 
                },
                {
                    $lookup: {
                        from: 'vehicletypes',
                        localField: 'vehicleType',
                        foreignField: '_id',
                        as: 'vehicleTypeDetails'
                    }
                },
                { $unwind: '$vehicleTypeDetails' },
                {
                    $group: {
                        _id: {
                            checkpost: '$checkpost',
                            vehicleType: '$vehicleTypeDetails.name'
                        },
                        count: { $sum: 1 }
                    }
                },
                {
                    $lookup: {
                        from: 'checkposts',
                        localField: '_id.checkpost',
                        foreignField: '_id',
                        as: 'checkpostDetails'
                    }
                },
                { $unwind: '$checkpostDetails' },
                {
                    $project: {
                        checkpost: '$checkpostDetails.name',
                        vehicleType: '$_id.vehicleType',
                        count: 1,
                        _id: 0
                    }
                },
                { $sort: { checkpost: 1, vehicleType: 1 } }
            ]);

        default:
            throw new Error('Invalid report type');
    }
};

// Export helper functions...
const exportToExcel = async (res, data, reportType) => {
    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet(reportType);

    // Populate Excel with data
    worksheet.addRow(["Checkpost Name", "Total Entries"]); // Example headers
    data.forEach((row) => {
        worksheet.addRow([row.checkpostName, row.totalEntries]);
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=report-${reportType}-${format(new Date(), 'yyyy-MM-dd')}.xlsx`);

    // Write file to response
    await workbook.xlsx.write(res);
    res.end();
};

const exportToCSV = async (res, data, reportType) => {
    try {
        let csvContent = "";

        // Add headers dynamically
        if (data.length > 0) {
            csvContent += Object.keys(data[0]).join(",") + "\n"; // Column headers
        }

        // Add data rows
        data.forEach(row => {
            csvContent += Object.values(row).join(",") + "\n";
        });

        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=report-${reportType}-${format(new Date(), "yyyy-MM-dd")}.csv`
        );

        res.send(csvContent);
    } catch (error) {
        console.error("CSV export error:", error);
        res.status(500).json({ message: "Failed to export CSV report" });
    }
};

const exportToPDF = async (res, data, reportType) => {
    try {
        const doc = new PDFDocument({ margin: 30 });

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=report-${reportType}-${format(new Date(), "yyyy-MM-dd")}.pdf`
        );

        // Pipe the PDF output directly to the response
        doc.pipe(res);

        // Title
        doc.fontSize(18).text(`Report: ${reportType}`, { align: "center" }).moveDown(1);

        if (data.length > 0) {
            // Add table headers
            const headers = Object.keys(data[0]);
            doc.fontSize(12).text(headers.join(" | "), { underline: true }).moveDown(0.5);

            // Add data rows
            data.forEach(row => {
                const values = Object.values(row).join(" | ");
                doc.text(values).moveDown(0.2);
            });
        } else {
            doc.text("No data available for this report.", { align: "center" }).moveDown(1);
        }

        // Finalize the PDF and send response
        doc.end();
    } catch (error) {
        console.error("PDF export error:", error);
        res.status(500).json({ message: "Failed to export PDF report" });
    }
};


module.exports = {
    exportReport
}; 