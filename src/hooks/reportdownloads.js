import { getProfitLossReport } from "../api/reportdownload";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";


export const handleDownload = async (
    period,
    selectedDate,
    fromDate,
    toDate,
    pdfRef,
    setReportData
) => {

    try {

        const res = await getProfitLossReport(
            period,
            selectedDate,
            fromDate,
            toDate
        );


        setReportData(res.data);



        setTimeout(async () => {


            const element = pdfRef.current;


            if (!element) {
                console.error("PDF element not found");
                return;
            }



            const canvas = await html2canvas(
                element,
                {
                    scale: 2,
                    useCORS: true,
                    backgroundColor: "#ffffff"
                }
            );



            const pdf = new jsPDF(
                "p",
                "mm",
                "a4"
            );


            const pageWidth =
                pdf.internal.pageSize.getWidth();


            const pageHeight =
                pdf.internal.pageSize.getHeight();



            const imgWidth =
                pageWidth;



            const imgHeight =
                (
                    canvas.height *
                    imgWidth
                )
                /
                canvas.width;



            let heightLeft = imgHeight;



            let position = 0;



            // First page

            pdf.addImage(
                canvas.toDataURL("image/png"),
                "PNG",
                0,
                position,
                imgWidth,
                imgHeight
            );


            heightLeft -= pageHeight;



            // Remaining pages

            while (heightLeft > 0) {


                position =
                    heightLeft - imgHeight;


                pdf.addPage();



                pdf.addImage(
                    canvas.toDataURL("image/png"),
                    "PNG",
                    0,
                    position,
                    imgWidth,
                    imgHeight
                );


                heightLeft -= pageHeight;

            }



            pdf.save(
                `profit-loss-${period}.pdf`
            );



        }, 1000);



    }
    catch (error) {

        console.error(
            "PDF ERROR",
            error
        );

    }

};