import { useState, ReactElement, useEffect } from "react"
import { dataFruits } from "./dataFruits"
import PlayGameFruits from "./components/PlayGameFruits"
import type { typeDataFruits } from "./dataFruits"

function App(): ReactElement {
  const [dataF, setDataF] = useState<typeDataFruits[]>(dataFruits)
  const [widthPhone, setWidthPhone] = useState<boolean>(false)
  useEffect(() => {
    if (window.innerWidth > 500) {
      setWidthPhone(true)
    }
  }, [])
  if (widthPhone) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          textAlign: "center",
        }}
      >
        Gunakan Smartphone android dan juga install aplikasi bawaan yaitu speech
        to text dari google
      </div>
    )
  }
  return (
    <div className="box">
      <PlayGameFruits dataFruits={dataF} setDataF={setDataF} />
    </div>
  )
}

export default App
