# data-viewer

## Server

```shell
cd server

# Install deps
python3.11 -m venv venv
. venv/bin/activate
pip3 install -r requirements.txt

# Import csv
python import_csv.py

# Run app
python3 -m uvicorn main:app --reload

```

GET http://127.0.0.1:8000/api/events
GET http://127.0.0.1:8000/api/events?sourceip=192.168.0.1
GET http://127.0.0.1:8000/api/events?startDate=2024-06-15T12:00:00&endDate=2024-06-15T12:30:00

## Client

```shell
cd client

# Install deps
npm install

# Run app
npm run dev

```
