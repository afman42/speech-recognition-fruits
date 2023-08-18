import { useState, ReactElement, useEffect } from "react"
import { dataFruits } from "./dataFruits"
import PlayGameFruits from "./components/PlayGameFruits"
import type { typeDataFruits } from "./dataFruits"

function App(): ReactElement {
  const [dataF, setDataF] = useState<typeDataFruits[]>(dataFruits)
  return (
    <div className="box">
      <PlayGameFruits dataFruits={dataF} setDataF={setDataF} />
    </div>
  )
}

export default App
