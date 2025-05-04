# SkyGrouper

> Streamlining group travel planning by bringing everyone’s preferences together in one place.

<details>
<summary>Table of Contents</summary>

* [About The Project](#about-the-project)
* [Features](#features)
* [Built With](#built-with)
* [Getting Started](#getting-started)

  * [Frontend](#frontend)
  * [Backend](#backend)
* [API Endpoints](#api-endpoints)
* [Usage](#usage)
* [Contact](#contact)

</details>

## About The Project

SkyGrouper streamlines group travel planning by letting users create shared trips, invite friends, and coordinate preferences for origins, destinations, dates, budgets, and trip themes. The platform uses a React/TypeScript frontend and a Flask/Python backend with MongoDB for persistent group and user data.

<p align="right">(<a href="#top">back to top</a>)</p>

## Features

* **Group trip creation and invitation**
* **Origin, destination, and date selection** for all group members
* **Budget and theme coordination**
* **Real-time waiting room** for group collaboration
* **Results display** with optimal travel options for the group

<p align="right">(<a href="#top">back to top</a>)</p>

## Built With

* React 18 + TypeScript
* Flask (Python)
* MongoDB
* Vite
* Tailwind CSS
* Axios

<p align="right">(<a href="#top">back to top</a>)</p>

## Getting Started

### Frontend

1. Clone the repository and install dependencies:

   ```bash
   git clone https://github.com/joelcalm/SkyGrouper.git
   cd SkyGrouper
   npm install
   npm run dev
   ```

### Backend

1. Navigate to the backend folder and set up a virtual environment:

   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate   # On Windows: venv\Scripts\activate
   ```

2. Install required Python packages:

   ```bash
   pip install -r requirements.txt
   ```

3. Create a `.env` file with the following variables:

   ```env
   MONGODB_URI=<your-mongodb-connection-string>
   FLASK_ENV=development
   ```

4. Start the Flask server:

   ```bash
   python app.py
   ```

<p align="right">(<a href="#top">back to top</a>)</p>

## API Endpoints

| Method | Endpoint                                                     | Description                 |
| ------ | ------------------------------------------------------------ | --------------------------- |
| POST   | `/api/group-trip`                                            | Create a new group trip     |
| GET    | `/api/group-trip/<group_trip_id>`                            | Retrieve group trip details |
| POST   | `/api/group-trip/<group_trip_id>/user`                       | Add user to trip            |
| PUT    | `/api/group-trip/<group_trip_id>/user/<user_id>/update-step` | Update user progress        |
| PUT    | `/api/group-trip/<group_trip_id>/user/<user_id>/complete`    | Mark user as complete       |

<p align="right">(<a href="#top">back to top</a>)</p>

## Usage

1. Create a group trip and share the invite link with friends.
2. Each participant enters their travel preferences (origin, destination, dates, budget, themes).
3. SkyGrouper aggregates everyone's data in real time and displays the optimal travel options.

<p align="right">(<a href="#top">back to top</a>)</p>

Project Link: [https://github.com/joelcalm/SkyGrouper](https://github.com/joelcalm/SkyGrouper)

<p align="right">(<a href="#top">back to top</a>)</p>
