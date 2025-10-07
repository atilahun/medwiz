# Form Builder Application

A modern, drag-and-drop form builder application with a powerful UI for creating complex multi-step forms.

## Features

- **Visual Form Builder**: Drag-and-drop interface for building forms
- **Hierarchical Structure**: Support for Workflows → Pages → Sections → SubSections → Fields
- **20+ Field Types**: Including text, number, select, date, file upload, and more
- **Validation System**: Built-in validation rules with custom error messages
- **Form Preview**: Real-time preview with working validation
- **Data Persistence**: PostgreSQL database for storing form configurations
- **Modern Tech Stack**: React, TypeScript, Node.js, Prisma

## Project Structure

```
form-builder/
├── packages/
│   ├── backend/          # Express.js API server
│   │   ├── src/
│   │   ├── prisma/       # Database schema
│   │   └── package.json
│   └── frontend/         # React application
│       ├── src/
│       │   ├── components/
│       │   ├── pages/
│       │   └── lib/
│       └── package.json
└── package.json          # Root package.json
```

## Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

## Installation

1. Clone the repository and navigate to the project:
```bash
cd form-builder
```

2. Install dependencies:
```bash
npm install
cd packages/backend && npm install
cd ../frontend && npm install
cd ../..
```

3. Set up the backend environment:
```bash
cd packages/backend
cp .env.example .env
```

Edit `.env` with your database credentials:
```
DATABASE_URL="postgresql://user:password@localhost:5432/formbuilder?schema=public"
PORT=3001
NODE_ENV=development
```

4. Initialize the database:
```bash
cd packages/backend
npx prisma generate
npx prisma migrate dev
```

## Running the Application

### Development Mode

From the root directory:
```bash
npm run dev
```

This will start both the backend (port 3001) and frontend (port 3000) concurrently.

Or run them separately:

**Backend:**
```bash
cd packages/backend
npm run dev
```

**Frontend:**
```bash
cd packages/frontend
npm run dev
```

### Production Build

```bash
npm run build
```

## Usage

1. **Access the application**: Open http://localhost:3000

2. **Create a new form**:
   - Click "Create New Form"
   - Give your workflow a name
   - Start building!

3. **Building forms**:
   - Drag field types from the left panel
   - Drop them into sections
   - Click on fields to edit properties
   - Add sections and subsections as needed
   - Configure validations for each field

4. **Preview forms**:
   - Click the "Preview" button
   - Test form submission
   - View submitted data

## API Endpoints

### Workflows
- `GET /api/workflows` - List all workflows
- `GET /api/workflows/:id` - Get workflow with full structure
- `POST /api/workflows` - Create workflow
- `PUT /api/workflows/:id` - Update workflow
- `DELETE /api/workflows/:id` - Delete workflow
- `POST /api/workflows/:id/duplicate` - Duplicate workflow

### Pages, Sections, Fields, Validations
Similar CRUD endpoints for all entities.

## Database Schema

The application uses a hierarchical data model:

- **Workflows**: Top-level container for forms
- **Pages**: Multi-page form support
- **Sections**: Logical grouping of fields
- **Fields**: Individual form inputs
- **Validations**: Rules for field validation

## Tech Stack

### Frontend
- React 19
- TypeScript
- TailwindCSS
- @dnd-kit (drag-and-drop)
- React Hook Form
- Zod (validation)
- Axios

### Backend
- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- Zod (validation)

## Development

### Adding New Field Types

1. Add the type to `FieldType` enum in both backend and frontend
2. Implement rendering logic in `FormRenderer`
3. Add icon and configuration in `FieldTypePanel`

### Database Changes

After modifying `prisma/schema.prisma`:
```bash
npx prisma migrate dev --name your-migration-name
npx prisma generate
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT