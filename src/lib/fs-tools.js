import { dirname, join, extname } from "path";
import { fileURLToPath } from "url";
import fs from 'fs-extra'

const { readJSON, writeJSON, writeFile, createReadStream } = fs

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)),'../data')
const mediaJSONPath = join(dataFolderPath,'media.json')

const publicFolderPath = join(process.cwd(),'./public')

export const readMedia = () => readJSON(mediaJSONPath)
export const writeMedia = (content) => {
    console.log(content)
    writeJSON(mediaJSONPath, content)
}