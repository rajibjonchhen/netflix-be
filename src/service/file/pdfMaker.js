import PdfPrinter from "pdfmake"
import axios from 'axios'

export const getMediaPdf = async(media) => {
const {Title, Year, Type, Poster, createAt, reviews, imdbId} = media
const fonts = {
Helvetica: {
    normal: "Helvetica",
    bold: "Helvetica-Bold",
    
},
}
   
    const printer = new PdfPrinter(fonts)
    let imagePart = {};
    if (Poster) {
      const response = await axios.get(Poster, {
        responseType: "arraybuffer",
      });
      const posterURLParts = Poster.split("/");
      const fileName = posterURLParts[posterURLParts.length - 1];
      const [id, extension] = fileName.split(".");
      const base64 = response.data.toString("base64");
      const base64Image = `data:image/${extension};base64,${base64}`;
      imagePart = { image: base64Image, width: 500, margin: [0, 0, 0, 40] };
    }

    const reviewPart = reviews.map((review,i) => (
        {text:`\n\n Review - ${i+1} `,
        fontSize: 16},
        {text:` \n\n Rating -  ${review.rate}  \n\n Comment - ${review.comment} * \n\n ${review.createdAt}`,
        fontSize: 14,}
    ))

  const docDefinition = {
      pageSize:"A4",
      pageMargin:[40, 60, 40, 60],
    content: [

      {
        text: Title,
        style: "header",

      },
      '\n',
      imagePart,
      '\n',
     {
         text:`Released Year : ${Year}`
     },
     {text: "It is possible to apply multiple styles, by passing an array. This paragraph uses two styles: quote and small. When multiple styles are provided, they are evaluated in the specified order which is important in case they define the same properties",
     fontSize: 14,
    },
     '\n',
      {
        text: "Reviews",
        style: "subheader",
      },
      '\n',
      ...reviewPart,
      '\n',
      {
       
      },
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
      },
      subheader: {
        fontSize: 15,
        bold: true,
      },
      small: {
        fontSize: 8,
      },
    },
    defaultStyle: {
      font: "Helvetica",
    },
  }

  const pdfReadableStream = printer.createPdfKitDocument(docDefinition, {})
  pdfReadableStream.end()

  return pdfReadableStream
}