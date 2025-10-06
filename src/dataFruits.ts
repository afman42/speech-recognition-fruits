import {
  apelSvg,
  blueberrySvg,
  pisangSvg,
  stroberiSvg,
  terongSvg,
} from "./assets"

export interface typeDataFruits {
  nama: string
  gambar: string
  seleksi: boolean
}

export const dataFruits: typeDataFruits[] = [
  {
    nama: "apel",
    gambar: apelSvg,
    seleksi: false,
  },
  {
    nama: "blueberry",
    gambar: blueberrySvg,
    seleksi: false,
  },
  {
    nama: "pisang",
    gambar: pisangSvg,
    seleksi: false,
  },
  {
    nama: "stroberi",
    gambar: stroberiSvg,
    seleksi: false,
  },
  {
    nama: "terong",
    gambar: terongSvg,
    seleksi: false,
  },
]
