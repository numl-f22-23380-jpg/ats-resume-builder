// UsersTable.jsx
// Shows a table of all users
// Each row has: name, email, plan badge, join date, status

export default function UsersTable({ users }) {
  return (
    <div style={card}>

      {/* HEADER */}
      <div style={headerRow}>
        <h3 style={title}>All Users</h3>
        <span style={countBadge}>{users.length} total</span>
      </div>

      {/* TABLE */}
      <div style={{ overflowX: 'auto' }}>
        <table style={table}>

          {/* TABLE HEADER */}
          <thead>
            <tr>
              {['Name', 'Email', 'Plan', 'Joined', 'Status'].map((col) => (
                <th key={col} style={th}>{col}</th>
              ))}
            </tr>
          </thead>

          {/* TABLE BODY */}
          <tbody>
            {users.map((user, index) => (
              <tr
                key={index}
                style={{
                  ...tr,
                  background: index % 2 === 0 ? '#fff' : '#F8FAFC',
                }}
              >
                {/* NAME */}
                <td style={td}>
                  <div style={nameRow}>
                    <div style={avatar}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <p style={nameText}>{user.name}</p>
                  </div>
                </td>

                {/* EMAIL */}
                <td style={td}>
                  <p style={emailText}>{user.email}</p>
                </td>

                {/* PLAN BADGE */}
                <td style={td}>
                  <span style={{
                    ...planBadge,
                    background: user.plan === 'Pro'
                      ? '#EFF6FF' : '#F1F5F9',
                    color: user.plan === 'Pro'
                      ? '#2563EB' : '#64748B',
                  }}>
                    {user.plan === 'Pro' ? '⭐ ' : ''}{user.plan}
                  </span>
                </td>

                {/* JOIN DATE */}
                <td style={td}>
                  <p style={dateText}>{user.joinDate}</p>
                </td>

                {/* STATUS */}
                <td style={td}>
                  <span style={{
                    ...statusBadge,
                    background: user.status === 'Active'
                      ? '#F0FDF4' : '#FEF2F2',
                    color: user.status === 'Active'
                      ? '#16A34A' : '#DC2626',
                  }}>
                    {user.status}
                  </span>
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  )
}

// ─── Styles ──────────────────────────────
const card = {
  background: '#fff',
  borderRadius: 14,
  padding: '24px',
  border: '1px solid #F1F5F9',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  marginBottom: 24,
}
const headerRow = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  marginBottom: 20,
}
const title = {
  fontSize: 18,
  fontWeight: 700,
  color: '#0F172A',
  flex: 1,
}
const countBadge = {
  background: '#EFF6FF',
  color: '#2563EB',
  fontSize: 12,
  fontWeight: 700,
  padding: '4px 10px',
  borderRadius: 20,
}
const table = {
  width: '100%',
  borderCollapse: 'collapse',
}
const th = {
  textAlign: 'left',
  fontSize: 12,
  fontWeight: 700,
  color: '#94A3B8',
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  padding: '10px 16px',
  borderBottom: '1px solid #F1F5F9',
}
const tr = {
  transition: 'background 0.15s',
}
const td = {
  padding: '14px 16px',
  borderBottom: '1px solid #F8FAFC',
}
const nameRow = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
}
const avatar = {
  width: 32,
  height: 32,
  borderRadius: '50%',
  background: '#EFF6FF',
  color: '#2563EB',
  fontSize: 13,
  fontWeight: 700,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
}
const nameText = {
  fontSize: 14,
  fontWeight: 600,
  color: '#0F172A',
}
const emailText = {
  fontSize: 13,
  color: '#64748B',
}
const planBadge = {
  fontSize: 12,
  fontWeight: 700,
  padding: '4px 10px',
  borderRadius: 20,
}
const dateText = {
  fontSize: 13,
  color: '#64748B',
}
const statusBadge = {
  fontSize: 12,
  fontWeight: 700,
  padding: '4px 10px',
  borderRadius: 20,
}