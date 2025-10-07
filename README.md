<div align="center">

# 🏥 MedWiz

**Medicaid Provider Asset Configurable Form Builder**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0+-61dafb.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933.svg)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-336791.svg)](https://www.postgresql.org/)

*Streamlining Medicaid provider enrollment and asset management workflows*

[Features](#-features) • [Quick Start](#-quick-start) • [Architecture](#-architecture) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## 📋 Overview

MedWiz is a specialized form builder platform designed for **Medicaid Provider Asset Management** and enrollment processes. Built with modern web technologies, MedWiz empowers healthcare administrators to create, manage, and deploy configurable forms for provider enrollment, credentialing, asset tracking, and compliance documentation.

### Why MedWiz?

- **🎯 Medicaid-Specific**: Purpose-built for provider enrollment and asset management workflows
- **🚀 Rapid Configuration**: Create complex multi-step provider forms in minutes
- **🔒 Compliance-Ready**: Architecture supports HIPAA and Medicaid compliance requirements
- **📋 Asset Tracking**: Comprehensive provider asset and resource management
- **📱 Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices
- **🎨 No-Code Builder**: Visual drag-and-drop interface requires no programming knowledge
- **⚡ Real-Time Validation**: Prevent errors with instant feedback and validation

---

## ✨ Features

### Form Builder
- **Drag & Drop Interface**: Intuitive visual builder with real-time preview
- **Hierarchical Structure**: Organize forms with Workflows → Pages → Sections → SubSections → Fields
- **20+ Field Types**: Text, number, email, phone, date, file upload, signature, TIN/EIN, and more
- **Conditional Logic**: Show/hide fields based on user responses
- **Multi-Step Workflows**: Create paginated enrollment processes

### Provider Asset Management
- **Asset Categorization**: Track facilities, equipment, personnel, and resources
- **Document Management**: Upload and manage provider credentials and certifications
- **Provider Information**: Comprehensive provider demographic and contact data
- **Tax Identification**: Handle TIN, EIN, NPI, and other provider identifiers
- **License Tracking**: Monitor professional licenses and expiration dates

### Validation & Compliance
- **Built-in Validators**: Email, phone, NPI, TIN/EIN, date ranges, and custom rules
- **Real-Time Feedback**: Instant validation as providers complete forms
- **Required Fields**: Enforce data completeness for regulatory compliance
- **Custom Error Messages**: User-friendly, context-aware error messaging
- **Audit Trail**: Track all form interactions for compliance reporting

### Data Management
- **PostgreSQL Backend**: Robust data persistence with Prisma ORM
- **RESTful API**: Well-documented endpoints for all operations
- **Data Export**: Export provider data in multiple formats
- **Version Control**: Track form configuration changes over time
- **Duplicate Detection**: Prevent duplicate provider enrollments

### Developer Experience
- **Full TypeScript**: Type-safe development across frontend and backend
- **Modern Stack**: React 19, Node.js, Express, Prisma
- **Monorepo Architecture**: Organized workspace with shared packages
- **Hot Reload**: Fast development with instant updates
- **Comprehensive API**: Easy integration with state Medicaid systems

---

## 🏗️ Architecture

```
MedWiz/
├── form-builder/                 # Main application
│   ├── packages/
│   │   ├── backend/             # Express.js REST API
│   │   │   ├── src/
│   │   │   │   ├── routes/      # API endpoints
│   │   │   │   ├── controllers/ # Business logic
│   │   │   │   └── middleware/  # Auth, validation, etc.
│   │   │   └── prisma/          # Database schema & migrations
│   │   │
│   │   ├── frontend/            # React application
│   │   │   ├── src/
│   │   │   │   ├── components/  # Reusable UI components
│   │   │   │   ├── pages/       # Route components
│   │   │   │   ├── lib/         # Utilities & helpers
│   │   │   │   └── types/       # TypeScript definitions
│   │   │   └── public/          # Static assets
│   │   │
│   │   └── shared/              # Shared types & utilities
│   │
│   └── package.json             # Workspace configuration
│
└── README.md                    # You are here
```

### Technology Stack

#### Frontend
| Technology | Purpose |
|-----------|---------|
| **React 19** | UI framework with latest features |
| **TypeScript** | Type-safe development |
| **TailwindCSS** | Utility-first styling |
| **@dnd-kit** | Drag-and-drop functionality |
| **React Hook Form** | Form state management |
| **Zod** | Schema validation |
| **Axios** | HTTP client |

#### Backend
| Technology | Purpose |
|-----------|---------|
| **Node.js** | Runtime environment |
| **Express** | Web framework |
| **TypeScript** | Type-safe development |
| **Prisma** | ORM & migrations |
| **PostgreSQL** | Database |
| **Zod** | Request validation |

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **PostgreSQL** 14+ ([Download](https://www.postgresql.org/download/))
- **npm** or **yarn** (comes with Node.js)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/atilahun/medwiz.git
   cd medwiz/form-builder
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd packages/backend && npm install
   cd ../frontend && npm install
   cd ../..
   ```

3. **Configure the database**
   ```bash
   cd packages/backend
   cp .env.example .env
   ```

   Edit `.env` with your PostgreSQL credentials:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/medwiz?schema=public"
   PORT=3001
   NODE_ENV=development
   ```

4. **Initialize the database**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

5. **Start the application**

   From the root `form-builder` directory:
   ```bash
   npm run dev
   ```

   This starts both backend (`:3001`) and frontend (`:3000`)

6. **Open your browser**
   ```
   http://localhost:3000
   ```

---

## 💻 Development

### Running Services Separately

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

### Building for Production

```bash
npm run build
```

This creates optimized production builds for both frontend and backend.

### Database Management

**Create a new migration:**
```bash
cd packages/backend
npx prisma migrate dev --name your_migration_name
```

**Reset database (development only):**
```bash
npx prisma migrate reset
```

**Open Prisma Studio (database GUI):**
```bash
npx prisma studio
```

---

## 📚 Documentation

### API Reference

The backend exposes a RESTful API with the following endpoints:

#### Workflows
```
GET    /api/workflows           # List all workflows
GET    /api/workflows/:id       # Get workflow with full structure
POST   /api/workflows           # Create new workflow
PUT    /api/workflows/:id       # Update workflow
DELETE /api/workflows/:id       # Delete workflow
POST   /api/workflows/:id/duplicate  # Duplicate workflow
```

#### Pages, Sections, Fields, Validations
Similar CRUD endpoints available for all entities in the hierarchy.

Full API documentation: [View API Docs](./form-builder/packages/backend/README.md)

### Database Schema

The application uses a hierarchical data model:

```
Workflow
  └── Page
       └── Section
            └── SubSection (optional)
                 └── Field
                      └── Validation
```

### Adding Custom Field Types

1. Add type to `FieldType` enum in `packages/shared/types.ts`
2. Implement rendering in `packages/frontend/src/components/FormRenderer`
3. Add configuration in `packages/frontend/src/components/FieldTypePanel`
4. Update validation logic if needed

---

## 🎯 Use Cases

- **Provider Enrollment**: Streamline new provider onboarding workflows
- **Asset Registration**: Track facilities, equipment, and resources
- **Credentialing**: Manage provider credentials and certifications
- **Re-enrollment**: Annual or periodic provider re-enrollment processes
- **Compliance Forms**: Create forms for regulatory compliance documentation
- **Provider Updates**: Handle provider information change requests
- **Document Collection**: Gather required provider documentation systematically

---

## 🔒 Security & Compliance

- **Data Validation**: All inputs validated on both client and server
- **SQL Injection Protection**: Prisma ORM prevents SQL injection attacks
- **CORS Configuration**: Configurable cross-origin resource sharing policies
- **Environment Variables**: Sensitive data stored securely in environment variables
- **HIPAA Consideration**: Architecture supports HIPAA compliance requirements
- **Audit Logging**: Track all system interactions for compliance reporting

> **Note**: For production deployment, implement additional security measures including encryption at rest, encryption in transit (TLS/SSL), role-based access controls, and comprehensive audit logging.

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Write meaningful commit messages
- Follow existing code style (TypeScript, ESLint)
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

Built for Medicaid administrators and healthcare professionals who deserve better enrollment tools.

- **React Team** - For the amazing React framework
- **Prisma Team** - For the excellent ORM and database tooling
- **Tailwind CSS** - For the utility-first CSS framework
- **All Contributors** - For making this project better

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/atilahun/medwiz/issues)
- **Discussions**: [GitHub Discussions](https://github.com/atilahun/medwiz/discussions)
- **Email**: atilahun@deloitte.com

---

<div align="center">

**Made with 🏥 for Medicaid Provider Enrollment**

⭐ Star us on GitHub — it helps!

[Report Bug](https://github.com/atilahun/medwiz/issues) • [Request Feature](https://github.com/atilahun/medwiz/issues)

</div>
