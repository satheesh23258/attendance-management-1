import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'

const CheckInOutSimple = () => {
  const { user } = useAuth()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [checkInTime, setCheckInTime] = useState(null)
  const [checkOutTime, setCheckOutTime] = useState(null)
  const [records, setRecords] = useState([])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const upsertAttendanceInStorage = (updater) => {
    if (!user?.id) return
    let stored = []
    try {
      stored = JSON.parse(localStorage.getItem('mockAttendance')) || []
    } catch {
      stored = []
    }

    const today = new Date().toISOString().split('T')[0]
    const idx = stored.findIndex(
      (a) => a.employeeId === user.id && a.date === today
    )

    const base = {
      employeeId: user.id,
      employeeName: user.name || '',
      date: today,
      status: 'present',
      workingHours: 0,
      overtime: 0,
      location: { address: 'Office Main Building' },
    }

    if (idx >= 0) {
      stored[idx] = updater({ ...base, ...stored[idx] })
    } else {
      stored.push(updater({ ...base, checkIn: '', checkOut: '' }))
    }

    localStorage.setItem('mockAttendance', JSON.stringify(stored))
  }

  const handleCheckIn = () => {
    const now = new Date()
    setIsCheckedIn(true)
    setCheckInTime(now)
    setRecords([...records, {
      type: 'check-in',
      time: now.toLocaleTimeString(),
      date: now.toLocaleDateString()
    }])

    // Persist today's check-in so AttendanceDashboard can see it
    upsertAttendanceInStorage((rec) => ({
      ...rec,
      checkIn: now.toLocaleTimeString(),
      status: 'present',
    }))
  }

  const handleCheckOut = () => {
    const now = new Date()
    setIsCheckedIn(false)
    setCheckOutTime(now)
    setRecords([...records, {
      type: 'check-out',
      time: now.toLocaleTimeString(),
      date: now.toLocaleDateString()
    }])

    // Persist today's check-out and mark working hours (simple demo value)
    upsertAttendanceInStorage((rec) => ({
      ...rec,
      checkOut: now.toLocaleTimeString(),
      workingHours: rec.workingHours && rec.workingHours > 0 ? rec.workingHours : 8,
    }))
  }

  const handleBack = () => {
    window.history.back()
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f5f5f5',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header */}
      <div style={{ 
        backgroundColor: '#00c853', 
        color: 'white', 
        padding: '20px', 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button 
            onClick={handleBack}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            ← Back
          </button>
          <h1 style={{ margin: 0, fontSize: '28px' }}>
            Check In/Out
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: '20px' }}>
        {/* Current Time Card */}
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '8px',
          textAlign: 'center',
          marginBottom: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: '#00c853', margin: '0 0 10px 0' }}>
            {currentTime.toLocaleTimeString()}
          </h2>
          <p style={{ color: '#666', margin: '0 0 20px 0' }}>
            {currentTime.toLocaleDateString()}
          </p>
          <div style={{
            padding: '8px 16px',
            backgroundColor: isCheckedIn ? '#4caf50' : '#9e9e9e',
            color: 'white',
            borderRadius: '16px',
            display: 'inline-block'
          }}>
            {isCheckedIn ? 'Checked In' : 'Not Checked In'}
          </div>
        </div>

        {/* Check In/Out Actions */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '8px',
            textAlign: 'center',
            flex: 1,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              backgroundColor: '#4caf50',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto',
              fontSize: '40px',
              color: 'white'
            }}>
              ✓
            </div>
            <h3 style={{ margin: '0 0 10px 0' }}>Check In</h3>
            <p style={{ color: '#666', margin: '0 0 20px 0' }}>
              Mark your attendance for today
            </p>
            <button
              onClick={handleCheckIn}
              disabled={isCheckedIn}
              style={{
                padding: '12px 24px',
                backgroundColor: isCheckedIn ? '#ccc' : '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                cursor: isCheckedIn ? 'not-allowed' : 'pointer',
                width: '100%'
              }}
            >
              Check In Now
            </button>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '8px',
            textAlign: 'center',
            flex: 1,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              backgroundColor: '#00c853',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto',
              fontSize: '40px',
              color: 'white'
            }}>
              ✕
            </div>
            <h3 style={{ margin: '0 0 10px 0' }}>Check Out</h3>
            <p style={{ color: '#666', margin: '0 0 20px 0' }}>
              End your work day
            </p>
            <button
              onClick={handleCheckOut}
              disabled={!isCheckedIn}
              style={{
                padding: '12px 24px',
                backgroundColor: !isCheckedIn ? '#ccc' : '#00c853',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                cursor: !isCheckedIn ? 'not-allowed' : 'pointer',
                width: '100%'
              }}
            >
              Check Out Now
            </button>
          </div>
        </div>

        {/* Today's Summary */}
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 20px 0' }}>Today's Summary</h3>
          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: '24px', color: '#4caf50', fontWeight: 'bold' }}>
                {checkInTime ? checkInTime.toLocaleTimeString() : '--:--:--'}
              </div>
              <div style={{ color: '#666', fontSize: '14px' }}>Check In Time</div>
            </div>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: '24px', color: '#00c853', fontWeight: 'bold' }}>
                {checkOutTime ? checkOutTime.toLocaleTimeString() : '--:--:--'}
              </div>
              <div style={{ color: '#666', fontSize: '14px' }}>Check Out Time</div>
            </div>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: '24px', color: '#00c853', fontWeight: 'bold' }}>
                {checkInTime && checkOutTime 
                  ? `${Math.round((checkOutTime - checkInTime) / (1000 * 60 * 60))}h ${Math.round(((checkOutTime - checkInTime) % (1000 * 60 * 60)) / (1000 * 60))}m`
                  : '--h --m'
                }
              </div>
              <div style={{ color: '#666', fontSize: '14px' }}>Total Hours</div>
            </div>
          </div>
        </div>

        {/* Today's Records */}
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 20px 0' }}>Today's Records</h3>
          {records.length === 0 ? (
            <p style={{ color: '#666', textAlign: 'center', padding: '20px' }}>
              No records for today. Check in to start tracking your attendance.
            </p>
          ) : (
            <div>
              {records.map((record, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '10px',
                  borderBottom: '1px solid #eee',
                  gap: '10px'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: record.type === 'check-in' ? '#4caf50' : '#00c853',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px'
                  }}>
                    {record.type === 'check-in' ? '✓' : '✕'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold' }}>
                      {record.type === 'check-in' ? 'Check In' : 'Check Out'}
                    </div>
                    <div style={{ color: '#666', fontSize: '14px' }}>
                      {record.time} - {record.date}
                    </div>
                  </div>
                  <div style={{
                    padding: '4px 8px',
                    backgroundColor: record.type === 'check-in' ? '#e8f5e8' : '#ffebee',
                    color: record.type === 'check-in' ? '#00c853' : '#c62828',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}>
                    {record.type}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CheckInOutSimple
