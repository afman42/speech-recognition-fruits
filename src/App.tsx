import { useState, ReactElement } from "react"
import { dataFruits } from "./dataFruits"
import PlayGameFruits from "./components/PlayGameFruits"
import ErrorBoundary from "./components/ErrorBoundary"
import SpeechErrorBoundary from "./components/SpeechErrorBoundary"
import type { typeDataFruits } from "./dataFruits"

function App(): ReactElement {
  const [fruitsData, setFruitsData] = useState<typeDataFruits[]>(dataFruits)
  
  return (
    <ErrorBoundary>
      <div className="box">
        <SpeechErrorBoundary>
          <PlayGameFruits 
            dataFruits={fruitsData} 
            setDataFruits={setFruitsData} 
          />
        </SpeechErrorBoundary>
      </div>
    </ErrorBoundary>
  )
}

export default App
