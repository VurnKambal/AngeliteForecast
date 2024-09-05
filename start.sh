#!/bin/bash

# Start the npm project
npm start &

# Wait for a few seconds to ensure the npm project starts properly
sleep 5


# Run the Python script
python app.py