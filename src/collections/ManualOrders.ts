// src/collections/ManualOrders.ts
import type { CollectionConfig } from 'payload'
import type { User } from '../payload-types' // Importa User para tipar el acceso

// --- Función Auxiliar para Acceso - Cualquier Usuario Autenticado ---
// Esta función determina si un usuario está logueado en el admin
const isAuthenticated = ({ req: { user } }: { req: { user?: User | null } }): boolean => {
  return Boolean(user)
}

// --- Definición de la Colección ManualOrders ---
export const ManualOrders: CollectionConfig = {
  slug: 'manual-orders', // Slug único para esta colección
  admin: {
    useAsTitle: 'customerName', // Usar el nombre del cliente como título en el admin
    description: 'Pedidos creados manualmente por administradores.',
    // Columnas visibles en la lista del admin
    defaultColumns: ['id', 'customerName', 'status', 'createdAt'],
    // Permitir buscar por estos campos
    listSearchableFields: ['customerName', 'customerEmail', 'id'],
    // Agrupar en la barra lateral (opcional)
    group: 'Gestión Manual',
  },
  access: {
    // Solo usuarios autenticados pueden crear, leer, actualizar y borrar estos pedidos
    create: isAuthenticated,
    read: isAuthenticated,
    update: isAuthenticated,
    delete: isAuthenticated, // O podrías restringir delete a un rol específico si tuvieras roles
  },
  timestamps: true, // Añadir createdAt y updatedAt
  fields: [
    // --- Datos del Cliente (Editables por el admin) ---
    {
      name: 'customerName',
      label: 'Nombre del Cliente',
      type: 'text',
      required: true,
      admin: { description: 'Nombre completo del cliente.' },
    },
    {
      name: 'customerEmail',
      label: 'Email del Cliente',
      type: 'email',
      required: true, // Es buena idea tener un email
      admin: { description: 'Email para contacto.' },
    },
    {
      name: 'customerPhone',
      label: 'Teléfono del Cliente',
      type: 'text', // Usar 'text' para flexibilidad de formatos
      admin: { description: 'Teléfono de contacto (opcional).' },
    },

    // --- Productos (Entrada Manual) ---
    // Usamos un array para que el admin pueda listar varios productos manualmente
    {
      name: 'manualProducts',
      label: 'Productos',
      type: 'array',
      required: true,
      minRows: 1,
      labels: {
        // Etiquetas para el array
        singular: 'Producto',
        plural: 'Productos',
      },
      fields: [
        // Campos para cada item dentro del array
        {
          name: 'productDescription',
          label: 'Descripción del Producto',
          type: 'textarea', // Permite más espacio para describir
          required: true,
          admin: {
            description:
              'Describe el producto y cualquier detalle relevante (talla, color, SKU si aplica).',
          },
        },
        {
          name: 'quantity',
          label: 'Cantidad',
          type: 'number',
          required: true,
          min: 1,
          defaultValue: 1,
        },
        // Opcional: Podrías añadir un campo de precio unitario aquí si lo necesitas
        {
          name: 'unitPrice',
          label: 'Precio Unitario',
          type: 'number',
          min: 0,
        },
      ],
    },

    // --- Total y Estado (Editables por el admin) ---
    {
      name: 'orderTotal',
      label: 'Monto Total del Pedido',
      type: 'number',
      min: 0,
      admin: {
        description: 'Calcula e ingresa el monto total.',
        step: 0.01,
      },
    },
    {
      name: 'status',
      label: 'Estado del Pedido',
      type: 'select',
      required: true,
      defaultValue: 'recibido', // Estado inicial por defecto
      options: [
        // Los tres estados solicitados
        { label: 'Recibido', value: 'recibido' },
        { label: 'En Proceso', value: 'en_proceso' },
        { label: 'Entregado', value: 'entregado' },
      ],
      // El acceso de update ya está cubierto por el acceso a nivel de colección
      // No se necesita 'access' específico aquí si isAuthenticated es suficiente
      admin: {
        position: 'sidebar', // Conveniente para actualizar
      },
    },
    {
      name: 'adminNotes',
      label: 'Notas Internas (Admin)',
      type: 'textarea',
      admin: {
        description: 'Notas privadas para seguimiento interno.',
      },
    },
  ],
}
