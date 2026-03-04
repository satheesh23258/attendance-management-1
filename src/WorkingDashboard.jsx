import React, { useEffect, useState } from 'react'

const WorkingDashboard = () => {
  const [userRole, setUserRole] = useState('employee')

  useEffect(() => {
    const path = window.location.pathname
    const role = path.split('/')[2]
    if (role) {
      setUserRole(role)
    }
  }, [])

  const getWelcomeMessage = () => {
    switch (userRole) {
      case 'admin':
        return 'Admin Dashboard'
      case 'hr':
        return 'HR Dashboard'
      default:
        return 'Employee Dashboard'
    }
  }

  const getRoleColor = () => {
    switch (userRole) {
      case 'admin':
        return '#000000'
      case 'hr':
        return '#f2c94c'
      default:
        return '#2f80ed'
    }
  }

  const headerTextColor = userRole === 'hr' ? 'black' : 'white'
  const getRoleFeatures = () => {
    switch (userRole) {
      case 'admin':
        return [
          {
            icon: '👥',
            title: 'Manage Employees',
            desc: 'Add, edit, delete staff',
            url: '/admin/manage-employees'
          },
          {
            icon: '📊',
            title: 'System Reports',
            desc: 'View all analytics',
            url: '/admin/system-reports'
          },
          {
            icon: '⚙️',
            title: 'System Settings',
            desc: 'Configure system',
            url: '/admin/system-settings'
          },
          {
            icon: '🔐',
            title: 'User Management',
            desc: 'Manage all users',
            url: '/admin/user-management'
          }
        ]
      case 'hr':
        return [
          {
            icon: '👥',
            title: 'Employee Records',
            desc: 'View staff details',
            url: '/hr/employee-records'
          },
          {
            icon: '📊',
            title: 'Attendance Reports',
            desc: 'Track attendance',
            url: '/hr/attendance-reports'
          },
          {
            icon: '💼',
            title: 'Performance',
            desc: 'Employee performance',
            url: '/hr/performance'
          },
          {
            icon: '📈',
            title: 'Analytics',
            desc: 'HR analytics',
            url: '/hr/analytics'
          }
        ]
      default:
        return [
          {
            icon: '⏰',
            title: 'Check In/Out',
            desc: 'Mark attendance',
            url: '/employee/checkinout'
          },
          {
            icon: '📋',
            title: 'My Tasks',
            desc: 'View assignments',
            url: '/employee/mytasks'
          },
          {
            icon: '📍',
            title: 'My Location',
            desc: 'Location tracking',
            url: '/employee/mylocation'
          },
          {
            icon: '👤',
            title: 'My Profile',
            desc: 'Personal details',
            url: '/employee/myprofile'
          }
        ]
    }
  }

  const handleFeatureClick = (url) => {
    if (url.startsWith('/')) {
      window.location.href = url
    } else {
      alert('This feature is coming soon!')
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <div style={{
        backgroundColor: getRoleColor(),
        color: headerTextColor,
        padding: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1>Employee Management System</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
            {userRole.toUpperCase()} Dashboard
          </span>
          <button
            style={{
              padding: '10px 20px',
              background: 'white',
              color: getRoleColor(),
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
            onClick={() => window.location.href = '/login'}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: '30px' }}>
        <h2>Welcome to {getWelcomeMessage()}</h2>
        <p style={{ color: '#666', marginBottom: '30px' }}>
          🎉 Login successful! You are logged in as <strong>{userRole}</strong>.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          {getRoleFeatures().map((feature, index) => (
            <div
              key={index}
              style={{
                background: 'white',
                padding: '20px',
                borderRadius: '8px',
                textAlign: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)'
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)'
              }}
              onClick={() => handleFeatureClick(feature.url)}
            >
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p style={{ color: '#666', margin: 0 }}>{feature.desc}</p>
            </div>
          ))}
        </div>

        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3>Recent Activity</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
              ✅ You successfully logged into the system as {userRole}
            </li>
            <li style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
              🎯 Welcome to your {getWelcomeMessage()}
            </li>
            <li style={{ padding: '10px 0' }}>
              🚀 Click on any feature above to get started
            </li>
          </ul>
        </div>

        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <p style={{ color: '#666' }}>
            Current Role: <strong style={{ color: getRoleColor() }}>{userRole.toUpperCase()}</strong>
          </p>
          <p style={{ color: '#999', fontSize: '14px' }}>
            URL: /dashboard/{userRole}
          </p>
        </div>
      </div>
    </div>
  )
}

export default WorkingDashboard
