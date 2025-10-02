# Donut Sim

A web application for simulating or visualizing donuts, built with React and PrimeReact.

## ✨ Features

- Interactive user interface built with React
- Styled with PrimeReact and PrimeFlex
- Responsive design
- Easy build and deploy to AWS S3

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- [npm](https://www.npmjs.com/)
- [AWS CLI](https://aws.amazon.com/cli/) (configured with access to the `donut-sim` S3 bucket)

### Installation

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd donut-sim
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally

Start the development server:
```bash
npm start
```
The app will be available at [http://localhost:3000](http://localhost:3000).

## 🏗️ Build & Deploy

### Build

To create a production build:
```bash
npm run build
```

### Deploy

You can deploy to S3 using either of the following methods:

**Option 1: Bash Script**
```bash
./deploy.sh
```

**Option 2: NPM Script**
```bash
npm run deploy
```

Both methods will:
- Build the app
- Sync the `build/` directory to the S3 bucket `donut-sim`
- Remove old files from the bucket

**Note:** Ensure your AWS CLI is configured and you have access to the S3 bucket.

## 📁 Project Structure

- `src/` - Source code (React components, styles)
- `public/` - Static assets and HTML template
- `deploy.sh` - Build and deploy script
- `package.json` - Project configuration and scripts

## 🤝 Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements.

## 📝 License

This project is licensed under the MIT License.
