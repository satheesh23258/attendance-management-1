import React from 'react'

const BasicTest = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f0f0f0',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center'
    }}>
      <h1>Basic Test Component</h1>
      <p>If you can see this, React is working!</p>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        marginTop: '20px',
        border: '2px solid #4CAF50'
      }}>
        <h2>✅ React is Working</h2>
        <p>Current URL: {window.location.href}</p>
        <p>Time: {new Date().toLocaleString()}</p>
        <button 
          onClick={() => alert('Button clicked!')}
          style={{
            padding: '15px 30px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          Click Me
        </button>
      </div>
    </div>
  )
}

export default BasicTest
