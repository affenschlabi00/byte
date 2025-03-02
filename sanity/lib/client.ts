import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

// Client-seitiger Client (nur Lesen)
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  // Kein Token für client-seitige Operationen
})

// Server-seitiger Client (volle Rechte)
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})
