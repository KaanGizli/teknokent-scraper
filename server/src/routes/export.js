/**
 * Export Route - /api/export
 * Excel dosyası oluşturur ve indirir
 */

const express = require('express');
const router = express.Router();
const ExcelJS = require('exceljs');
const { readData, getAllFirmalar } = require('../store/dataStore');

// GET /api/export/excel
router.get('/excel', async (req, res) => {
    try {
        const data = readData();
        let firmalar = data.firmalar;

        // Teknokent filtresi
        if (req.query.teknokent) {
            firmalar = firmalar.filter(f => f.teknokentId === req.query.teknokent);
        }

        if (firmalar.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Dışa aktarılacak firma bulunamadı. Önce scraping yapın.'
            });
        }

        // Excel oluştur
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'Teknokent Scraper';
        workbook.created = new Date();

        const worksheet = workbook.addWorksheet('Firmalar');

        // Başlık stili
        worksheet.columns = [
            { header: 'Firma Adı', key: 'name', width: 40 },
            { header: 'Web Sitesi', key: 'website', width: 50 },
            { header: 'Teknokent', key: 'teknokent', width: 30 },
            { header: 'Tarih', key: 'date', width: 20 }
        ];

        // Başlık satırını stillendik
        const headerRow = worksheet.getRow(1);
        headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF6366F1' }
        };
        headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

        // Veri ekle
        firmalar.forEach(f => {
            worksheet.addRow({
                name: f.name,
                website: f.website || '—',
                teknokent: f.teknokentName,
                date: new Date(f.scrapedAt).toLocaleDateString('tr-TR')
            });
        });

        // Web sitesi linklerini hyperlink yap
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 1) {
                const cell = row.getCell(2);
                const value = cell.value;
                if (value && value.startsWith('http')) {
                    cell.value = { text: value, hyperlink: value };
                    cell.font = { color: { argb: 'FF4F46E5' }, underline: true };
                }
            }
        });

        // Response headers
        const filename = `teknokent_firmalar_${new Date().toISOString().slice(0, 10)}.xlsx`;
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

        await workbook.xlsx.write(res);
        res.end();
    } catch (err) {
        console.error('Excel export hatası:', err);
        res.status(500).json({
            success: false,
            error: 'Excel dosyası oluşturulurken hata oluştu'
        });
    }
});

module.exports = router;
