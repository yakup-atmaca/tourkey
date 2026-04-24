package com.tourkey.backend.service;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.tourkey.backend.entity.Ticket;
import com.tourkey.backend.repository.TicketRepository;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Service
public class ReportService {

    private final TicketRepository ticketRepository;

    public ReportService(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    public byte[] generateTicketPdf(Long ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId).orElseThrow();
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4);
            PdfWriter.getInstance(document, baos);
            document.open();

            Font titleFont = new Font(Font.HELVETICA, 18, Font.BOLD);
            Font headerFont = new Font(Font.HELVETICA, 12, Font.BOLD);
            Font normalFont = new Font(Font.HELVETICA, 10, Font.NORMAL);

            document.add(new Paragraph("BILET RAPORU", titleFont));
            document.add(Chunk.NEWLINE);

            PdfPTable table = new PdfPTable(2);
            table.setWidthPercentage(100);

            addCell(table, "Bilet No:", headerFont);
            addCell(table, ticket.getTicketNumber(), normalFont);
            addCell(table, "Tur:", headerFont);
            addCell(table, ticket.getTourSchedule().getTour().getName(), normalFont);
            addCell(table, "Tarih:", headerFont);
            addCell(table, ticket.getTourSchedule().getScheduleDate().format(DateTimeFormatter.ISO_LOCAL_DATE), normalFont);
            addCell(table, "Satici Firma:", headerFont);
            addCell(table, ticket.getSellerCompany().getName(), normalFont);
            addCell(table, "Duzenleyen Firma:", headerFont);
            addCell(table, ticket.getOrganizerCompany().getName(), normalFont);
            addCell(table, "Net Tutar:", headerFont);
            addCell(table, ticket.getNetTotal() + " " + ticket.getCurrency(), normalFont);
            addCell(table, "Komisyon:", headerFont);
            addCell(table, ticket.getCommissionAmount() + " " + ticket.getCurrency(), normalFont);
            addCell(table, "Toplam:", headerFont);
            addCell(table, ticket.getGrossTotal() + " " + ticket.getCurrency(), normalFont);

            document.add(table);
            document.add(Chunk.NEWLINE);

            document.add(new Paragraph("Yolcular:", headerFont));
            PdfPTable passengerTable = new PdfPTable(4);
            passengerTable.setWidthPercentage(100);
            addCell(passengerTable, "Ad Soyad", headerFont);
            addCell(passengerTable, "Tip", headerFont);
            addCell(passengerTable, "Cinsiyet", headerFont);
            addCell(passengerTable, "Koltuk", headerFont);

            ticket.getPassengers().forEach(p -> {
                addCell(passengerTable, p.getFullName(), normalFont);
                addCell(passengerTable, p.getPassengerType().name(), normalFont);
                addCell(passengerTable, p.getGender().name(), normalFont);
                addCell(passengerTable, p.getSeatNumber() != null ? p.getSeatNumber() : "-", normalFont);
            });
            document.add(passengerTable);

            document.close();
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("PDF generation failed", e);
        }
    }

    private void addCell(PdfPTable table, String text, Font font) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setPadding(5);
        table.addCell(cell);
    }
}
