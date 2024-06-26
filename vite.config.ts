import path from 'path'

export default {
  build: {
    copyPublicDir: false,
    lib: {
      entry: path.resolve(__dirname, 'src', 'index.ts'),
      name: 'AIText',
      fileName: 'aitext'
    }
  }
}
