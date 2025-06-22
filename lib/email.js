import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendEmailFallback(email, name) {
  const msg = {
    to: process.env.ADMIN_EMAIL,
    from: process.env.SENDER_EMAIL,
    subject: '[Fallback] Request Akses Baru',
    text: `Email: ${email}\nNama: ${name || '-'}`,
    html: `<p>Email: <strong>${email}</strong></p>
           <p>Nama: ${name || '-'}</p>`
  };

  return sgMail.send(msg);
}
