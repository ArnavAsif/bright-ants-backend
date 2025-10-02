# Bright Ants Backend

A modern backend API built with Hono.js for the Bright Ants website, featuring file management, content management for carousel images, testimonials, promotional offers, attorneys, and works, as well as email functionality.

## Features

- RESTful API for managing website content
- File upload and management
- Email sending capabilities with beautiful HTML templates
- Environment variable validation
- CORS enabled for frontend integration
- Graceful shutdown handling

## Prerequisites

- Node.js (v18 or higher)
- pnpm package manager
- PostgreSQL database
- SMTP server access for email functionality

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd bright-ants-backend
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory based on the `.env.example` file:

```bash
cp .env.example .env
```

Then edit the `.env` file with your actual configuration values:

- `DATABASE_URL`: Your PostgreSQL database connection string
- `SMTP_HOST`: Your SMTP server host (e.g., smtp.gmail.com)
- `SMTP_PORT`: Your SMTP server port (e.g., 587)
- `SMTP_SECURE`: Set to "true" for SSL/TLS, "false" for STARTTLS
- `SMTP_USER`: Your email address for SMTP authentication
- `SMTP_PASS`: Your email password or app-specific password
- `EMAIL_TO`: The recipient address for all contact form submissions
- `EMAIL_TO_OVERRIDE`: (Optional) Override recipient for testing purposes

Note: `EMAIL_FROM` is automatically set to the sender's email address from the contact form.

### 4. Database Setup

Ensure your PostgreSQL database is set up and accessible with the credentials provided in `DATABASE_URL`.

To generate new migrations based on schema changes:
```bash
pnpm run migrate
```

### 5. Run the Application

For development:
```bash
pnpm run dev
```

For production:
```bash
pnpm run build
pnpm start
```

The server will start on `http://localhost:3000`.

## API Endpoints

### File Management
- `POST /files` - Upload a file
- `GET /files/:filename` - Retrieve a file
- `DELETE /files/:filename` - Delete a file

### Carousel Images
- `GET /carousel-images` - Get all carousel images
- `POST /carousel-images` - Create a new carousel image
- `PUT /carousel-images/:id` - Update a carousel image
- `DELETE /carousel-images/:id` - Delete a carousel image

### Testimonials
- `GET /testimonials` - Get all testimonials
- `POST /testimonials` - Create a new testimonial
- `PUT /testimonials/:id` - Update a testimonial
- `DELETE /testimonials/:id` - Delete a testimonial

### Promotional Offers
- `GET /promotional-offers` - Get all promotional offers
- `POST /promotional-offers` - Create a new promotional offer
- `PUT /promotional-offers/:id` - Update a promotional offer
- `DELETE /promotional-offers/:id` - Delete a promotional offer

### Attorneys
- `GET /attorneys` - Get all attorneys
- `POST /attorneys` - Create a new attorney
- `PUT /attorneys/:id` - Update an attorney
- `DELETE /attorneys/:id` - Delete an attorney

### Works
- `GET /works` - Get all works
- `POST /works` - Create a new work
- `PUT /works/:id` - Update a work
- `DELETE /works/:id` - Delete a work

### Offers
- `GET /offers` - Get all offers
- `POST /offers` - Create a new offer
- `PUT /offers/:id` - Update an offer
- `DELETE /offers/:id` - Delete an offer

### Email
- `POST /email` - Send an email through the contact form

The email endpoint expects a JSON body with the following structure:
```json
{
  "firstname": "John",
  "lastname": "Doe",
  "email": "john.doe@example.com",
  "message": "Hello, I'm interested in your services..."
}
```

## Email Functionality

The application sends beautifully formatted HTML emails for contact form submissions. Emails feature:
- Responsive design that works on all devices
- Professional gradient header
- Clear sender information (name and email from the form)
- Prominent "Reply to Sender" button with improved visibility
- Clean message body formatting

The `from` address in emails is set to the sender's email address provided in the contact form, making it easy to reply directly to the person who submitted the form.

## Environment Variable Validation

The application validates all required environment variables at startup. If any required variables are missing or invalid, the application will display a detailed error message and exit.

## Development

### Available Scripts

- `pnpm run dev` - Start the development server with hot reloading
- `pnpm run build` - Compile TypeScript to JavaScript
- `pnpm start` - Start the production server
- `pnpm run migrate` - Generate database migrations

### Project Structure

```
src/
├── config/          # Configuration files
├── db/              # Database configuration and schema
├── routes/          # API route handlers
├── utils/           # Utility functions
├── types.ts         # TypeScript types and Zod schemas
└── index.ts         # Application entry point
```

## Database Schema

The application uses the following database tables:

1. **carousel_images** - Stores carousel image information
2. **testimonials** - Stores customer testimonials
3. **promotional_offers** - Stores promotional offers
4. **attorneys** - Stores attorney information
5. **works** - Stores work/portfolio items
6. **offers** - Stores service/product offers with pricing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

[Specify your license here]