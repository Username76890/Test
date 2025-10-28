# Café Entertainment Robot Prototype

This project is a web-based prototype that simulates the behavior of a café entertainment robot. It includes a customer-facing frontend for placing orders and an admin-facing dashboard for managing them.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js and npm
*   Access to a Google Cloud project with the Speech-to-Text API enabled
*   A Firebase project with Firestore enabled

### Backend Setup

1.  **Navigate to the backend directory:**
    ```sh
    cd backend
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Set up Firebase Admin SDK:**
    - Download your `serviceAccountKey.json` from your Firebase project settings.
    - Place it in the `backend` directory.

4.  **Set up Google Cloud credentials:**
    - Follow the Google Cloud documentation to set up authentication. Typically, this involves setting the `GOOGLE_APPLICATION_CREDENTIALS` environment variable.

5.  **Start the server:**
    ```sh
    npm start
    ```
    The backend server will be running on `http://localhost:3001`.

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```sh
    cd frontend
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Start the development server:**
    ```sh
    npm start
    ```
    The frontend application will be accessible at `http://localhost:3000`. The admin dashboard is available at `http://localhost:3000/admin`.
