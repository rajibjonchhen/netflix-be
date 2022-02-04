import PdfPrinter from "pdfmake";
import striptags from "striptags";
import axios from "axios";
import getStream from "get-stream";

export const getMediaPdf = async (media, asBuffer = false) => {
    console.log("im pdf")
    const fonts = {
      Helvetica: {
        normal: "Helvetica",
        bold: "Helvetica-Bold",
        italics: "Helvetica-Italics",
      },
    };
  
    const printer = new PdfPrinter(fonts);
    let imagePart = {};
    if (media.Poster) {
        console.log("im pdf")
      const response = await axios.get(media.Poster, {
        responseType: "arraybuffer",
      });
      const posterURLParts = media.Poster.split("/");
      const fileName = posterURLParts[posterURLParts.length - 1];
      const [id, extension] = fileName.split(".");
      const base64 = response.data.toString("base64");
      const base64Image = `data:image/${extension};base64,${base64}`;
      imagePart = {
        image: base64Image,
        width: 480,
        height: 300,
        margin: [0, 0, 0, 40],
      };
    }
    const docDefinition = {
      content: [
        imagePart,
        {
          text: media.title,
          style: "header",
        },
        "\n",
        media.Type,
        media.Year,

      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
        },
      },
      defaultStyle: {
        font: "Helvetica",
      },
    };
  
    const pdfReadableStream = printer.createPdfKitDocument(docDefinition, {});
    pdfReadableStream.end();
    const buffer = await getStream.buffer(pdfReadableStream);
    return asBuffer ? buffer : pdfReadableStream;
  };