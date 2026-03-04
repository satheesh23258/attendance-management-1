import React from 'react'

const TestPage = () => {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <h1>Test Page</h1>
      <p>This is a simple test page to check if routing is working.</p>
      <button onClick={() => window.history.back()}>Go Back</button>
    </div>
  )
}

export default TestPage
