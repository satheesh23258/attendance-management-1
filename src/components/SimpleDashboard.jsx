import React from 'react'

const SimpleDashboard = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f5f5f5',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        backgroundColor: '#00c853',
        color: 'white',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px' }}>Employee Dashboard</h1>
          <p style={{ margin: '5px 0 0 0', opacity: 0.8 }}>Welcome back, Employee</p>
        </div>
        <button 
          onClick={() => alert('Logout clicked')}
          style={{
            padding: '8px 16px',
            backgroundColor: 'white',
            color: '#00c853',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #e0e0e0'
        }}>
          <h3 style={{ color: '#4caf50', margin: '0 0 10px 0' }}>✅ Tasks Completed</h3>
          <p style={{ fontSize: '32px', margin: '0', fontWeight: 'bold' }}>8</p>
          <p style={{ color: '#666', margin: '5px 0 0 0' }}>This week</p>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #e0e0e0'
        }}>
          <h3 style={{ color: '#00c853', margin: '0 0 10px 0' }}>⏳ Tasks Pending</h3>
          <p style={{ fontSize: '32px', margin: '0', fontWeight: 'bold' }}>3</p>
          <p style={{ color: '#666', margin: '5px 0 0 0' }}>Need attention</p>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #e0e0e0'
        }}>
          <h3 style={{ color: '#00c853', margin: '0 0 10px 0' }}>📅 Attendance Rate</h3>
          <p style={{ fontSize: '32px', margin: '0', fontWeight: 'bold' }}>95%</p>
          <p style={{ color: '#666', margin: '5px 0 0 0' }}>This month</p>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #e0e0e0'
        }}>
          <h3 style={{ color: '#000000', margin: '0 0 10px 0' }}>⭐ Performance</h3>
          <p style={{ fontSize: '32px', margin: '0', fontWeight: 'bold' }}>4.5</p>
          <p style={{ color: '#666', margin: '5px 0 0 0' }}>Out of 5.0</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #e0e0e0'
        }}>
          <h3 style={{ margin: '0 0 15px 0' }}>📈 Recent Activities</h3>
          <div style={{ listStyle: 'none', padding: 0 }}>
            <div style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
              📝 New task assigned - 2 min ago
            </div>
            <div style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
              ✅ Successfully checked in - 2 hours ago
            </div>
            <div style={{ padding: '10px 0' }}>
              🔧 Service request resolved - 3 hours ago
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #e0e0e0'
        }}>
          <h3 style={{ margin: '0 0 15px 0' }}>🚀 Quick Actions</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button 
              onClick={() => alert('Check In/Out clicked')}
              style={{
                padding: '10px',
                backgroundColor: '#00c853',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Check In/Out
            </button>
            <button 
              onClick={() => alert('My Location clicked')}
              style={{
                padding: '10px',
                backgroundColor: '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              My Location
            </button>
            <button 
              onClick={() => alert('My Profile clicked')}
              style={{
                padding: '10px',
                backgroundColor: '#00c853',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              My Profile
            </button>
            <button 
              onClick={() => alert('My Tasks clicked')}
              style={{
                padding: '10px',
                backgroundColor: '#000000',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              My Tasks
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SimpleDashboard
