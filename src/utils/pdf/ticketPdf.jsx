import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import Swal from 'sweetalert2'

export const generarTicketPDF = async (elementId, ticketCodigo) => {
  const element = document.getElementById(elementId)

  if (!element) return

  Swal.fire({
    title: 'GENERANDO PDF',
    text: 'Preparando ticket digital...',
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading(),
  })

  try {
    const canvas = await html2canvas(element, {
      scale: 3, // Calidad para que no se vea borroso en móviles
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
    })

    const imgData = canvas.toDataURL('image/jpeg', 0.95)

    const pdfWidth = 80
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [pdfWidth, pdfHeight],
    })

    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight)
    pdf.save(`Ticket_${ticketCodigo}.pdf`)

    Swal.close()
  } catch (error) {
    console.error('Error al generar PDF:', error)
    Swal.fire('Error', 'No se pudo procesar el archivo', 'error')
  }
}
