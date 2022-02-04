import PdfPrinter from "pdfmake"
import axios from 'axios'

export const getMediaPdf = async(media) => {
const fonts = {
Helvetica: {
    normal: "Helvetica",
    bold: "Helvetica-Bold",
    
},
}


    const {Title, year, Type, Poster} = media
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

  const docDefinition = {
    content: [
      {
        text: Title,
        style: "header",
      },
      imagePart,
      , "\n\n",
      {
        text: media.year,
        style: "subheader",
      },
      {
        text: "Subheader 2 - using subheader style",
        style: "subheader",
      },
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam posset, eveniunt specie deorsus efficiat sermone instituendarum fuisse veniat, eademque mutat debeo. Delectet plerique protervi diogenem dixerit logikh levius probabo adipiscuntur afficitur, factis magistra inprobitatem aliquo andriam obiecta, religionis, imitarentur studiis quam, clamat intereant vulgo admonitionem operis iudex stabilitas vacillare scriptum nixam, reperiri inveniri maestitiam istius eaque dissentias idcirco gravis, refert suscipiet recte sapiens oportet ipsam terentianus, perpauca sedatio aliena video.",
      {
        text: "It is possible to apply multiple styles, by passing an array. This paragraph uses two styles: quote and small. When multiple styles are provided, they are evaluated in the specified order which is important in case they define the same properties",
        style: ["quote", "small"],
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