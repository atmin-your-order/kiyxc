import { useEffect, useState } from 'react';

export default function ApproveUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUnapproved();
  }, []);

  const fetchUnapproved = async () => {
    const res = await fetch('/api/get-unapproved-users');
    const data = await res.json();
    setUsers(data.users || []);
  };

  const approve = async (id) => {
    const res = await fetch('/api/approve-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: id })
    });

    const result = await res.json();
    if (result.success) {
      alert('✅ Berhasil disetujui!');
      fetchUnapproved();
    } else {
      alert('❌ Gagal menyetujui: ' + result.error);
    }
  };

  return (
    <div style={{ marginTop: '1rem' }}>
      <h3 style={{ color: '#fff' }}>🕵️ User Belum Disetujui:</h3>
      {users.length === 0 ? (
        <p style={{ color: '#ccc' }}>Tidak ada user menunggu.</p>
      ) : (
        <ul>
          {users.map(u => (
            <li key={u.id} style={{ marginBottom: '10px', color: 'white' }}>
              {u.email}
              <button
                onClick={() => approve(u.id)}
                style={{
                  marginLeft: '10px',
                  background: 'green',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '5px 10px'
                }}
              >
                ✅ Approve
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
