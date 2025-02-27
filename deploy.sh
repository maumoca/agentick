#!/bin/bash

# Agentick Dashboard Deployment Script
# This script helps deploy the Agentick Dashboard to Genezio

# Text formatting
BOLD="\033[1m"
GREEN="\033[0;32m"
YELLOW="\033[0;33m"
BLUE="\033[0;34m"
RED="\033[0;31m"
NC="\033[0m" # No Color

echo -e "${BOLD}${BLUE}=== Agentick Dashboard Deployment Script ===${NC}\n"

# Check if Genezio is installed
if ! command -v genezio &> /dev/null; then
    echo -e "${YELLOW}Genezio CLI is not installed. Installing now...${NC}"
    npm install -g genezio
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}Failed to install Genezio CLI. Please install it manually with 'npm install -g genezio'${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}Genezio CLI installed successfully!${NC}\n"
else
    echo -e "${GREEN}Genezio CLI is already installed.${NC}\n"
fi

# Check if user is logged in to Genezio
echo -e "${BLUE}Checking Genezio login status...${NC}"
genezio whoami &> /dev/null

if [ $? -ne 0 ]; then
    echo -e "${YELLOW}You are not logged in to Genezio. Please login or create an account.${NC}"
    genezio login
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}Failed to login to Genezio. Please try again later or visit https://genezio.com to create an account.${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}Successfully logged in to Genezio!${NC}\n"
else
    echo -e "${GREEN}Already logged in to Genezio.${NC}\n"
fi

# Load environment variables from .env file
echo -e "${BLUE}Loading environment variables from .env file...${NC}"
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
    echo -e "${GREEN}Environment variables loaded successfully!${NC}\n"
else
    echo -e "${RED}Error: .env file not found. Make sure you have created a .env file with your Firebase credentials.${NC}"
    exit 1
fi

# Confirm deployment
echo -e "${YELLOW}You are about to deploy the Agentick Dashboard to Genezio.${NC}"
echo -e "${YELLOW}This will create a new deployment with the following configuration:${NC}"
echo -e "  - Project name: ${BOLD}agentick-dashboard${NC}"
echo -e "  - Region: ${BOLD}us-east-1${NC}"
echo -e "  - Firebase project: ${BOLD}${REACT_APP_FIREBASE_PROJECT_ID}${NC}"
echo -e ""
read -p "Do you want to continue? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}Deployment cancelled.${NC}"
    exit 1
fi

# Deploy to Genezio
echo -e "\n${BLUE}Deploying to Genezio...${NC}"
genezio deploy

if [ $? -ne 0 ]; then
    echo -e "${RED}Deployment failed. Please check the error message above.${NC}"
    exit 1
fi

echo -e "\n${GREEN}${BOLD}Deployment successful!${NC}"
echo -e "${GREEN}Your Agentick Dashboard is now deployed and accessible via the URL provided above.${NC}"
echo -e "\n${BLUE}Note: If you make changes to your Firebase credentials, you'll need to update the environment variables in the Genezio dashboard or redeploy.${NC}"
