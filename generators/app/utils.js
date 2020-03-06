'use strict'

const { join, resolve, relative, normalize, parse, toNamespacedPath} = require('path')
const { readdir, stat } = require('fs')
const { promisify } = require('util')

const readdirP = promisify(readdir)
const statP = promisify(stat)

async function getFilesArray(dir, allFiles = []) {
  const files = (await readdirP(dir)).map(file => join(dir, file))
  allFiles.push(...files)
  await Promise.all(
    files.map(async f => (await statP(f)).isDirectory() && getFilesArray(f, allFiles))
  )

  return allFiles.map(file => {
    return file.split(dir).pop().substring(1)
  })
}

module.exports = {getFilesArray}