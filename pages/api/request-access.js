import { createClient } from '@supabase/supabase-js';
import { sendWhatsAppNotification } from '../../lib/notify';

export default async function handler(req, res) {
  // Log request untuk debugging
  console.log('Request received:', {
    method: req.method,
    body: req.body
  });

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Validasi body
  if (!req.body) {
    return res.status(400).json({ error: 'Request body is missing' });
  }

  const { userId, email, name } = req.body;

  // Validasi parameter
  if (!userId) {
    return res.status(400).json({ error: 'Missing userId' });
  }
  if (!email) {
    return res.status(400).json({ error: 'Missing email' });
  }

  try {
    // Inisialisasi Supabase (langsung di handler untuk menghindari undefined)
    const supabaseAdmin = createClient(
      process.env.kiizuebvqeucyksorsfu_NEXT_PUBLIC_SUPABASE_URL,
      process.env.kiizuebvqeucyksorsfu_SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false
        }
      }
    );

    console.log('Supabase initialized:', !!supabaseAdmin);

    // Simpan permintaan akses
    const { data, error: insertError } = await supabaseAdmin
      .from('access_requests')
      .insert([{ 
        user_id: userId, 
        email,
        name: name || email.split('@')[0] || 'User',
        approved: false,
        created_at: new Date().toISOString(),
      }]);

    if (insertError) {
      console.error('❌ Database error:', insertError);
      return res.status(500).json({ 
        error: 'Database error',
        details: insertError.message
      });
    }

    console.log('✅ Data saved:', data);

    // Kirim notifikasi WhatsApp
    const message = `
🛡️ [AKSES BARU DIMINTA] 🛡️
👤 Nama: ${name || '-'}
📧 Email: ${email}
🆔 User ID: ${userId}
🗓️ Waktu: ${new Date().toLocaleString('id-ID')}
📌 Status: Belum Disetujui
`;

    try {
      const notifResult = await sendWhatsAppNotification(message);
      console.log('📬 Notifikasi terkirim:', notifResult);

      return res.status(200).json({
        success: true,
        message: 'Permintaan berhasil dikirim!',
        data,
        notif: notifResult
      });
    } catch (notifErr) {
      console.error('⚠️ Notifikasi gagal:', notifErr);
      return res.status(200).json({
        success: true,
        message: 'Permintaan berhasil disimpan, tapi notifikasi gagal',
        data,
        notif_error: notifErr.message
      });
    }
    
  } catch (err) {
    console.error('❌ Server error:', err);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: err.message
    });
  }
}
