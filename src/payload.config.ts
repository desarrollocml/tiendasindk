// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Orders } from './collections/Orders'
import { Products } from './collections/Products'
import { ManualOrders } from './collections/ManualOrders'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  // --- CONFIGURACIÓN CORS ---
  // Asegúrate de que esta sección exista y contenga tu origen:
  cors: [
    'http://127.0.0.1:5501', // ¡Tu origen exacto!
    'http://localhost:5501',
    'https://front-silk-theta.vercel.app', // Añadir localhost también es buena idea
    // Puedes añadir más orígenes si los necesitas
  ],
  // --- FIN CONFIGURACIÓN CORS ---
  collections: [Users, Media, Orders, Products, ManualOrders],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
})
