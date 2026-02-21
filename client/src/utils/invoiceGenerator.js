import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export const generateInvoicePDF = async (fee, student) => {
    // Create a hidden template element
    const element = document.createElement('div');
    element.style.width = '700px';
    element.style.padding = '50px';
    element.style.background = '#ffffff';
    element.style.color = '#1e293b';
    element.style.fontFamily = "'Inter', 'Arial', sans-serif";
    element.style.position = 'absolute';
    element.style.left = '-9999px';
    element.style.boxSizing = 'border-box';

    element.innerHTML = `
        <div style="border: 1px solid #e2e8f0; padding: 40px; border-radius: 12px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
            <!-- Header -->
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; border-bottom: 2px solid #6366f1; padding-bottom: 20px;">
                <div>
                    <h1 style="margin: 0; color: #6366f1; font-size: 28px; font-weight: 800; letter-spacing: -0.025em;">MAAN-VERSE</h1>
                    <p style="margin: 4px 0 0; color: #64748b; font-size: 12px; text-transform: uppercase; font-weight: 700; letter-spacing: 0.1em;">Academy Management System</p>
                </div>
                <div style="text-align: right;">
                    <h2 style="margin: 0; font-size: 20px; font-weight: 800; color: #1e293b;">FEE INVOICE</h2>
                    <p style="margin: 4px 0 0; color: #64748b; font-size: 14px; font-weight: 600;">Receipt #${fee.transactionId?.substring(0, 12) || 'N/A'}</p>
                </div>
            </div>

            <!-- Student Details -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 40px; background: #f8fafc; padding: 20px; border-radius: 8px;">
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 4px 0; color: #64748b; font-size: 11px; font-weight: 700; text-transform: uppercase;">Student Name</td>
                        <td style="padding: 4px 0; font-weight: 700; color: #1e293b; text-align: right;">${student.name}</td>
                    </tr>
                    <tr>
                        <td style="padding: 4px 0; color: #64748b; font-size: 11px; font-weight: 700; text-transform: uppercase;">Student ID / Roll No</td>
                        <td style="padding: 4px 0; font-weight: 700; color: #1e293b; text-align: right;">${student.studentProfile?.rollNo || student._id}</td>
                    </tr>
                    <tr>
                        <td style="padding: 4px 0; color: #64748b; font-size: 11px; font-weight: 700; text-transform: uppercase;">Branch / Program</td>
                        <td style="padding: 4px 0; font-weight: 600; color: #1e293b; text-align: right;">${student.studentProfile?.branch || 'N/A'}</td>
                    </tr>
                </table>
            </div>

            <!-- Fee Table -->
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 40px;">
                <thead>
                    <tr style="background: #f1f5f9;">
                        <th style="padding: 12px 15px; text-align: left; font-size: 11px; color: #475569; text-transform: uppercase; font-weight: 800; border-bottom: 1px solid #e2e8f0;">Description</th>
                        <th style="padding: 12px 15px; text-align: center; font-size: 11px; color: #475569; text-transform: uppercase; font-weight: 800; border-bottom: 1px solid #e2e8f0;">Semester</th>
                        <th style="padding: 12px 15px; text-align: right; font-size: 11px; color: #475569; text-transform: uppercase; font-weight: 800; border-bottom: 1px solid #e2e8f0;">Amount Paid</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="padding: 20px 15px; border-bottom: 1px solid #f1f5f9;">
                            <p style="margin: 0; font-weight: 700; color: #1e293b; font-size: 16px;">${fee.type} Fee</p>
                            <p style="margin: 4px 0 0; color: #64748b; font-size: 12px;">Full payment for the specified semester</p>
                        </td>
                        <td style="padding: 20px 15px; border-bottom: 1px solid #f1f5f9; text-align: center; font-weight: 600;">${fee.semester}</td>
                        <td style="padding: 20px 15px; border-bottom: 1px solid #f1f5f9; text-align: right; font-weight: 800; color: #1e293b; font-size: 18px;">₹${fee.amount.toLocaleString()}</td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr style="background: #eef2ff;">
                        <td colspan="2" style="padding: 20px; font-weight: 800; font-size: 16px; color: #1e293b;">TOTAL PAID</td>
                        <td style="padding: 20px; text-align: right; font-weight: 900; font-size: 24px; color: #6366f1;">₹${fee.amount.toLocaleString()}</td>
                    </tr>
                </tfoot>
            </table>

            <!-- Payment Info -->
            <div style="display: flex; justify-content: space-between; align-items: flex-end;">
                <div style="max-width: 350px;">
                    <p style="margin: 0 0 5px; color: #64748b; font-size: 10px; font-weight: 700; text-transform: uppercase;">Transaction Details</p>
                    <p style="margin: 0; font-size: 12px; font-weight: 600; color: #334155;">Status: <span style="color: #10b981;">SUCCESSFUL</span></p>
                    <p style="margin: 2px 0; font-size: 11px; color: #64748b; word-break: break-all;">Transaction ID: ${fee.transactionId || 'N/A'}</p>
                    <p style="margin: 2px 0; font-size: 11px; color: #64748b;">Paid at: ${fee.paidAt ? new Date(fee.paidAt).toLocaleString() : 'N/A'}</p>
                </div>
                <div style="text-align: right;">
                    <div style="display: inline-block; padding: 10px 20px; border-radius: 8px; background: #ecfdf5; border: 1px solid #10b981; color: #065f46; font-size: 12px; font-weight: 800; text-transform: uppercase;">
                        PAID
                    </div>
                    <p style="margin: 15px 0 0; color: #94a3b8; font-size: 10px; font-style: italic;">This is a computer-generated receipt.</p>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(element);

    try {
        const canvas = await html2canvas(element, {
            scale: 2,
            backgroundColor: '#ffffff',
            logging: false,
            useCORS: true
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'p',
            unit: 'px',
            format: [700, 850]
        });

        pdf.addImage(imgData, 'PNG', 0, 0, 700, 850);
        pdf.save(`Invoice-${fee.type}-${fee.semester}-${student.name}.pdf`);
    } finally {
        document.body.removeChild(element);
    }
};
