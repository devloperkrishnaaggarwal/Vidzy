import { useState } from 'react'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { Footer } from './components/Footer'
import { VideoGenerator } from './components/VideoGenerator'

function App() {
  const [showGenerator, setShowGenerator] = useState(false)

  return (
    <div className="w-full min-h-screen flex flex-col relative font-sans">
      <Navbar onTryNow={() => setShowGenerator(true)} />
      <main className="flex-grow">
        {showGenerator ? (
          <VideoGenerator onBack={() => setShowGenerator(false)} />
        ) : (
          <Hero onTryNow={() => setShowGenerator(true)} />
        )}
      </main>
      <Footer />
    </div>
  )
}

export default App
