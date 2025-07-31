# Use official Node.js or Python image (choose based on your app)
FROM node:20-alpine  # or python:3.11-slim if you're using Python

# Set working directory
WORKDIR /app

# Copy app files
COPY . .

# Install dependencies
RUN npm install        # or `pip install -r requirements.txt` for Python

# Expose configurable port (default 8080)
ENV PORT=8080
EXPOSE 8080

# Start the app
CMD ["npm", "start"]   # or `CMD ["python3", "app.py"]`
