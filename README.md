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

## Client

```shell
cd client

# Install deps
npm install

# Run app
npm run dev

# Go to browser
http://localhost:5173/

```
