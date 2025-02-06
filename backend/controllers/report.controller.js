const Vehicle = require('../models/Vehicle');
const User = require('../models/User');
const Checkpost = require('../models/Checkpost');
const excel = require('exceljs');
const PDFDocument = require('pdfkit');
const { parse, format, startOfDay, endOfDay, subDays } = require('date-fns');

const exportReport = async (req, res) => {
    try {
        const { startDate, endDate, reportType, format = 'excel' } = req.query;
        
        // Get user's checkpost filter based on role
        const checkpostFilter = ['super_admin', 'admin'].includes(req.user.role) 
            ? {} 
            : { checkpost: req.user.checkpost._id }; // Ensure we use the checkpost ID

        let data;
        switch (reportType) {
            case 'checkpost_entries':
                data = await generateCheckpostReport(startDate, endDate, checkpostFilter);
                break;
            case 'daily_summary':
                data = await generateDailySummaryReport(startDate, endDate, checkpostFilter);
                break;
            case 'vehicle_type_analysis':
                data = await generateVehicleTypeReport(startDate, endDate, checkpostFilter);
                break;
            default:
                return res.status(400).json({ message: 'Invalid report type' });
        }

        // Add checkpost info to the report title for regular users
        const reportTitle = req.user.role === 'user' 
            ? `${reportType} - ${req.user.checkpost.name}`
            : reportType;

        // Generate and send report based on format
        switch (format.toLowerCase()) {
            case 'excel':
                await generateExcelReport(res, data, reportTitle);
                break;
            case 'csv':
                await generateCSVReport(res, data, reportTitle);
                break;
            case 'pdf':
                await generatePDFReport(res, data, reportTitle);
                break;
            default:
                return res.status(400).json({ message: 'Invalid format type' });
        }
    } catch (error) {
        console.error('Report generation error:', error);
        res.status(500).json({ message: 'Failed to generate report' });
    }
};

const generateCheckpostReport = async (startDate, endDate, checkpostFilter) => {
    const pipeline = [
        {
            $match: {
                ...checkpostFilter,
                ...(startDate && endDate ? {
                    createdAt: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate)
                    }
                } : {})
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
        {
            $unwind: '$checkpostDetails'
        },
        {
            $group: {
                _id: '$checkpost',
                checkpostName: { $first: '$checkpostDetails.name' },
                totalEntries: { $sum: 1 },
                vehicles: { $push: '$$ROOT' }
            }
        }
    ];

    return await Vehicle.aggregate(pipeline);
};

const generateDailySummaryReport = async (startDate, endDate, checkpostFilter) => {
    const pipeline = [
        {
            $match: {
                ...checkpostFilter,
                ...(startDate && endDate ? {
                    createdAt: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate)
                    }
                } : {})
            }
        },
        {
            $group: {
                _id: {
                    date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
                },
                totalEntries: { $sum: 1 }
            }
        },
        {
            $sort: { '_id.date': 1 }
        }
    ];

    return await Vehicle.aggregate(pipeline);
};

const generateVehicleTypeReport = async (startDate, endDate, checkpostFilter) => {
    const pipeline = [
        {
            $match: {
                ...checkpostFilter,
                ...(startDate && endDate ? {
                    createdAt: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate)
                    }
                } : {})
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
        {
            $unwind: '$vehicleTypeDetails'
        },
        {
            $group: {
                _id: '$vehicleType',
                vehicleTypeName: { $first: '$vehicleTypeDetails.name' },
                count: { $sum: 1 }
            }
        }
    ];

    return await Vehicle.aggregate(pipeline);
};

const generateExcelReport = async (res, data, reportTitle) => {
    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet('Report');

    // Configure headers based on report type
    switch (reportTitle) {
        case 'checkpost_entries':
            worksheet.columns = [
                { header: 'Checkpost', key: 'checkpostName', width: 20 },
                { header: 'Total Entries', key: 'totalEntries', width: 15 }
            ];
            worksheet.addRows(data.map(item => ({
                checkpostName: item.checkpostName,
                totalEntries: item.totalEntries
            })));
            break;

        case 'daily_summary':
            worksheet.columns = [
                { header: 'Date', key: 'date', width: 15 },
                { header: 'Total Entries', key: 'entries', width: 15 }
            ];
            worksheet.addRows(data.map(item => ({
                date: item._id.date,
                entries: item.totalEntries
            })));
            break;

        case 'vehicle_type_analysis':
            worksheet.columns = [
                { header: 'Vehicle Type', key: 'type', width: 20 },
                { header: 'Count', key: 'count', width: 15 }
            ];
            worksheet.addRows(data.map(item => ({
                type: item.vehicleTypeName,
                count: item.count
            })));
            break;
    }

    // Style the header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
    };

    // Set response headers
    res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
        'Content-Disposition',
        `attachment; filename=${reportTitle}_${format(new Date(), 'yyyy-MM-dd')}.xlsx`
    );

    // Send the workbook
    await workbook.xlsx.write(res);
    res.end();
};

const generateCSVReport = async (res, data, reportTitle) => {
    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet('Report');

    // Configure headers and data similar to Excel report
    // ... (same configuration as in generateExcelReport)

    // Set response headers for CSV
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
        'Content-Disposition',
        `attachment; filename=${reportTitle}_${format(new Date(), 'yyyy-MM-dd')}.csv`
    );

    // Write to response
    await workbook.csv.write(res);
    res.end();
};

const generatePDFReport = async (res, data, reportTitle) => {
    try {
        const doc = new PDFDocument({ margin: 30 });

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=report-${reportTitle}-${format(new Date(), "yyyy-MM-dd")}.pdf`
        );

        // Pipe the PDF output directly to the response
        doc.pipe(res);

        // Title
        doc.fontSize(18).text(`Report: ${reportTitle}`, { align: "center" }).moveDown(1);

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