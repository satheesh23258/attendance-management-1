import React, { useState } from 'react'

const MyProfileSimple = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    firstName: 'Mike',
    lastName: 'Johnson',
    email: 'mike@company.com',
    phone: '+1 (555) 345-6789',
    address: '123 Main St, New York, NY 10001',
    employeeId: 'EMP003',
    department: 'Engineering',
    position: 'Software Engineer',
    joinDate: '2023-06-10',
    manager: 'Jane Smith'
  })

  const [tempData, setTempData] = useState(profileData)

  const handleBack = () => {
    window.history.back()
  }

  const handleEdit = () => {
    setTempData(profileData)
    setIsEditing(true)
  }

  const handleSave = () => {
    setProfileData(tempData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setTempData(profileData)
    setIsEditing(false)
  }

  const handleChange = (field, value) => {
    setTempData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const getYearsOfService = () => {
    const joinDate = new Date(profileData.joinDate)
    const currentDate = new Date()
    const years = Math.floor((currentDate - joinDate) / (365.25 * 24 * 60 * 60 * 1000))
    return years
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        background: '#00c853',
        color: 'white',
        padding: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomLeftRadius: '16px',
        borderBottomRightRadius: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={handleBack}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: 'white',
              fontSize: '18px',
              cursor: 'pointer',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
            onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
          >
            ←
          </button>
          <div>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>
              My Profile
            </h1>
            <p style={{ margin: '4px 0 0 0', opacity: 0.9, fontSize: '14px' }}>
              Manage your personal and work information
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                style={{
                  background: 'none',
                  border: '1px solid rgba(255,255,255,0.5)',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                style={{
                  background: 'white',
                  border: 'none',
                  color: '#00c853',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={handleEdit}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                padding: '10px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px',
                backdropFilter: 'blur(4px)'
              }}
              onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
              onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: '20px' }}>
        {/* Profile Header */}
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '8px',
          textAlign: 'center',
          marginBottom: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            width: '100px',
            height: '100px',
            backgroundColor: '#00c853',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px auto',
            fontSize: '40px',
            color: 'white'
          }}>
            {profileData.firstName[0]}{profileData.lastName[0]}
          </div>
          <h2 style={{ margin: '0 0 10px 0' }}>
            {profileData.firstName} {profileData.lastName}
          </h2>
          <p style={{ color: '#666', margin: '0 0 20px 0' }}>
            {profileData.position}
          </p>
          <div style={{
            padding: '8px 16px',
            backgroundColor: '#e3f2fd',
            color: '#00c853',
            borderRadius: '16px',
            display: 'inline-block'
          }}>
            {profileData.department}
          </div>
        </div>

        {/* Quick Stats */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center',
            flex: 1,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '24px', color: '#00c853', fontWeight: 'bold' }}>
              {getYearsOfService()}
            </div>
            <div style={{ color: '#666', fontSize: '14px' }}>Years at Company</div>
          </div>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center',
            flex: 1,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '24px', color: '#4caf50', fontWeight: 'bold' }}>
              {profileData.employeeId}
            </div>
            <div style={{ color: '#666', fontSize: '14px' }}>Employee ID</div>
          </div>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center',
            flex: 1,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '24px', color: '#00c853', fontWeight: 'bold' }}>
              Full-time
            </div>
            <div style={{ color: '#666', fontSize: '14px' }}>Employment Type</div>
          </div>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center',
            flex: 1,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '24px', color: '#000000', fontWeight: 'bold' }}>
              NY Office
            </div>
            <div style={{ color: '#666', fontSize: '14px' }}>Work Location</div>
          </div>
        </div>

        {/* Personal Information */}
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#00c853' }}>Personal Information</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', color: '#666', fontSize: '14px', marginBottom: '5px' }}>
                First Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={tempData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              ) : (
                <div style={{ padding: '8px 0', fontSize: '16px' }}>
                  {profileData.firstName}
                </div>
              )}
            </div>
            <div>
              <label style={{ display: 'block', color: '#666', fontSize: '14px', marginBottom: '5px' }}>
                Last Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={tempData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              ) : (
                <div style={{ padding: '8px 0', fontSize: '16px' }}>
                  {profileData.lastName}
                </div>
              )}
            </div>
            <div>
              <label style={{ display: 'block', color: '#666', fontSize: '14px', marginBottom: '5px' }}>
                Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={tempData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              ) : (
                <div style={{ padding: '8px 0', fontSize: '16px' }}>
                  {profileData.email}
                </div>
              )}
            </div>
            <div>
              <label style={{ display: 'block', color: '#666', fontSize: '14px', marginBottom: '5px' }}>
                Phone
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={tempData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              ) : (
                <div style={{ padding: '8px 0', fontSize: '16px' }}>
                  {profileData.phone}
                </div>
              )}
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', color: '#666', fontSize: '14px', marginBottom: '5px' }}>
                Address
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={tempData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              ) : (
                <div style={{ padding: '8px 0', fontSize: '16px' }}>
                  {profileData.address}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Work Information */}
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#00c853' }}>Work Information</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', color: '#666', fontSize: '14px', marginBottom: '5px' }}>
                Employee ID
              </label>
              <div style={{ padding: '8px 0', fontSize: '16px' }}>
                {profileData.employeeId}
              </div>
            </div>
            <div>
              <label style={{ display: 'block', color: '#666', fontSize: '14px', marginBottom: '5px' }}>
                Department
              </label>
              <div style={{ padding: '8px 0', fontSize: '16px' }}>
                {profileData.department}
              </div>
            </div>
            <div>
              <label style={{ display: 'block', color: '#666', fontSize: '14px', marginBottom: '5px' }}>
                Position
              </label>
              <div style={{ padding: '8px 0', fontSize: '16px' }}>
                {profileData.position}
              </div>
            </div>
            <div>
              <label style={{ display: 'block', color: '#666', fontSize: '14px', marginBottom: '5px' }}>
                Manager
              </label>
              <div style={{ padding: '8px 0', fontSize: '16px' }}>
                {profileData.manager}
              </div>
            </div>
            <div>
              <label style={{ display: 'block', color: '#666', fontSize: '14px', marginBottom: '5px' }}>
                Join Date
              </label>
              <div style={{ padding: '8px 0', fontSize: '16px' }}>
                {profileData.joinDate}
              </div>
            </div>
            <div>
              <label style={{ display: 'block', color: '#666', fontSize: '14px', marginBottom: '5px' }}>
                Work Location
              </label>
              <div style={{ padding: '8px 0', fontSize: '16px' }}>
                New York Office
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyProfileSimple
