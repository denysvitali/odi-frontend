# odi-frontend

## Description

odi-frontend is a frontend interface for [odi-backend](https://github.com/denysvitali/odi-backend), a privacy-aware tool designed to scan, OCR process, and index paper documents. This system enables users to digitize their physical documents and make them searchable via OpenSearch.

![ODI Frontend](https://github.com/denysvitali/odi-backend/raw/master/docs/odi-frontend.jpg)

## Prerequisites

- [odi-backend](https://github.com/denysvitali/odi-backend) must be running and accessible from the frontend.

## Running

### Using Docker (Recommended)

The easiest way to get started is using Docker Compose:

```bash
docker-compose up -d
```

This will start the frontend server and connect it to the backend.

### Development Setup

1. Clone the repository:
    ```bash
    git clone https://github.com/denysvitali/odi-frontend.git
    cd odi-frontend
    ```

2. Install dependencies:
    ```bash
    yarn install
    ```

3. Start the development server:
    ```bash
    yarn dev
    ```
