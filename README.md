# 💰 Calculadora de Salario Colombia

Una calculadora de salario moderna y hermosa para Colombia, construida con TypeScript, Bun y Elysia.

## ✨ Características

- 🎯 **Cálculo preciso** de impuestos colombianos (Salud, Pensión, FSP, Retención)
- 💵 **Conversión USD/COP** con tasa personalizable
- 🌟 **Gastos Favoritos** - Tus gastos habituales guardados para acceso rápido
- 📊 **Visualización gráfica** de la distribución del salario
- 🎨 **UI moderna y accesible** con modo oscuro automático
- ⚡ **Súper rápido** gracias a Bun y Elysia

## 🚀 Instalación

```bash
# Instalar dependencias
bun install
```

## 💻 Uso

### Desarrollo (con hot reload)
```bash
bun run dev
```

### Producción
```bash
bun run start
```

### Debug
```bash
bun run debug
```

La aplicación estará disponible en: **http://localhost:3000**

## 🎮 Cómo usar la aplicación

1. **Ingresa tu salario** en USD y la tasa de cambio actual
2. **Selecciona tus gastos favoritos** con un clic (ya están pre-cargados tus gastos habituales)
3. **Agrega gastos adicionales** si lo necesitas
4. **Calcula** y visualiza tu salario neto después de impuestos y gastos
5. **Explora los detalles** de impuestos con el botón expandible

## 📁 Estructura del Proyecto

```
salary-calculator/
├── src/
│   ├── server.ts           # Servidor Elysia con API endpoints
│   └── calculations/       # Lógica de cálculos
│       ├── salary.ts       # Cálculo de salario
│       ├── taxes.ts        # Cálculo de impuestos
│       └── expenses.ts     # Gestión de gastos
├── public/                 # Frontend
│   ├── index.html         # UI principal
│   ├── styles.css         # Estilos hermosos
│   └── app.js            # Lógica del cliente
└── package.json
```

## 🔥 Tus Gastos Favoritos

Los siguientes gastos ya están configurados como favoritos:
- 🏠 **Home**: $1,500,000
- 👨‍👩‍👧 **Mati**: $550,000
- 💳 **Personal use**: $1,000,000
- 💰 **Debts**: $1,000,000
- 🛡️ **Accident insurance**: $250,000
- 💪 **Gym**: $100,000

## 🛠️ API Endpoints

- `GET /` - Sirve la aplicación web
- `POST /api/calculate` - Calcula el salario neto
- `GET /api/favorites` - Obtiene los gastos favoritos
- `GET /api/health` - Health check del servidor

## 📝 Notas

- Los cálculos son aproximados y basados en las regulaciones fiscales colombianas actuales
- Para información precisa, consulta con un contador profesional
- La aplicación funciona completamente offline después de la carga inicial