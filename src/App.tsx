import { useState, ReactElement } from "react"
import { dataFruits } from "./dataFruits"
import PlayGameFruits from "./components/PlayGameFruits"
import ErrorBoundary from "./components/ErrorBoundary"
import type { typeDataFruits } from "./dataFruits"

function App(): ReactElement {
  const [fruitsData, setFruitsData] = useState<typeDataFruits[]>(dataFruits)
  
  return (
    <ErrorBoundary>
      <div className="box">
        <PlayGameFruits 
          dataFruits={fruitsData} 
          setDataFruits={setFruitsData} 
        />
      </div>
    </ErrorBoundary>
  )
}

export default App
