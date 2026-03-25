import PDFDocument from 'pdfkit';

export function createTicketPdf(booking) {
  return new Promise((resolve) => {
    const doc = new PDFDocument();
    const chunks = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));

    doc.fontSize(22).fillColor('#0a4da3').text('Staff Travel PNR Ticket', { align: 'center' });
    doc.moveDown();
    doc.fillColor('black').fontSize(12);
    doc.text(`PNR: ${booking.pnr}`);
    doc.text(`Passenger: ${booking.nominee_name || 'Employee Self'}`);
    doc.text(`Route: ${booking.from_airport} → ${booking.to_airport}`);
    doc.text(`Airline: ${booking.airline}`);
    doc.text(`Travel Date: ${booking.travel_date}`);
    doc.text(`Fare: ₹${booking.fare}`);
    doc.text(`Booked On: ${new Date(booking.created_at).toISOString().slice(0, 10)}`);
    doc.moveDown();
    doc.text('Helpline: +91-1800-111-INDIGO | support@stafftravel.local');

    doc.end();
  });
}
