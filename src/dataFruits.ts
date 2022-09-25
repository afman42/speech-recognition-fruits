import {
  apelSvg,
  blueberrySvg,
  pisangSvg,
  stoberSvg,
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
    nama: "bluberry",
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
    gambar: stoberSvg,
    seleksi: false,
  },
  {
    nama: "terong",
    gambar: terongSvg,
    seleksi: false,
  },
]
