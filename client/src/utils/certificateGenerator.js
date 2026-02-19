import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export const generateCertificate = async (userName, courseName, date, certificateId) => {
    // Create a hidden template element
    const element = document.createElement('div');
    element.style.width = '800px';
    element.style.height = '600px';
    element.style.padding = '40px';
    element.style.background = '#020617';
    element.style.color = '#fff';
    element.style.fontFamily = 'Arial, sans-serif';
    element.style.border = '20px solid #6366f1';
    element.style.position = 'absolute';
    element.style.left = '-9999px';
    element.style.display = 'flex';
    element.style.flexDirection = 'column';
    element.style.alignItems = 'center';
    element.style.justifyContent = 'center';
    element.style.textAlign = 'center';

    element.innerHTML = `
        <div style="border: 2px solid #ffffff10; padding: 40px; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; overflow: hidden;">
            <div style="position: absolute; top: -50px; right: -50px; width: 200px; height: 200px; background: #6366f1; border-radius: 50%; opacity: 0.1;"></div>
            <div style="position: absolute; bottom: -50px; left: -50px; width: 200px; height: 200px; background: #10b981; border-radius: 50%; opacity: 0.1;"></div>
            
            <h1 style="font-size: 14px; text-transform: uppercase; letter-spacing: 5px; color: #6366f1; margin: 0;">Certificate of Completion</h1>
            <div style="width: 80px; hieght: 2px; background: #ffffff20; margin: 20px 0;"></div>
            
            <p style="font-size: 10px; text-transform: uppercase; color: #64748b; margin-bottom: 30px;">This serves to certify that</p>
            <h2 style="font-size: 42px; font-weight: 900; color: #fff; margin: 0; font-family: 'Times New Roman', serif;">${userName}</h2>
            
            <p style="font-size: 12px; color: #94a3b8; margin: 30px 0; max-width: 400px; line-height: 1.6;">
                has successfully completed the program of study and met all professional competency standards required for the course:
            </p>
            
            <h3 style="font-size: 24px; font-weight: 800; color: #10b981; margin: 0;">${courseName}</h3>
            
            <div style="margin-top: 50px; width: 100%; display: flex; justify-content: space-between; align-items: flex-end; padding: 0 40px;">
                <div style="text-align: left;">
                    <p style="font-size: 8px; color: #4b5563; margin-bottom: 5px; font-weight: bold;">DATE OF ISSUE</p>
                    <p style="font-size: 12px; color: #fff; margin: 0; font-weight: bold;">${date}</p>
                </div>
                <div style="text-align: center;">
                    <div style="width: 100px; height: 100px; background: #fff; padding: 5px; border-radius: 8px;">
                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=MAANVERSE-${certificateId}" style="width: 100%; height: 100%;" />
                    </div>
                    <p style="font-size: 8px; color: #4b5563; margin-top: 5px; font-weight: bold;">VERIFY IDENTITY</p>
                </div>
                <div style="text-align: right;">
                    <p style="font-size: 8px; color: #4b5563; margin-bottom: 5px; font-weight: bold;">ID: ${certificateId}</p>
                    <div style="width: 120px; height: 1px; background: #ffffff20; margin-bottom: 5px;"></div>
                    <p style="font-size: 12px; color: #fff; margin: 0; font-weight: bold;">MAAN-VERSE ACADEMY</p>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(element);

    try {
        const canvas = await html2canvas(element, {
            scale: 2,
            backgroundColor: '#020617',
            logging: false,
            useCORS: true
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'px',
            format: [800, 600]
        });

        pdf.addImage(imgData, 'PNG', 0, 0, 800, 600);
        pdf.save(`Certificate-${userName}-${courseName}.pdf`);
    } finally {
        document.body.removeChild(element);
    }
};
