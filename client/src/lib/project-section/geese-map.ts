import { Project } from "../interfaces"

export const GeeseMap: Project = {
    id: "2",
    title: "Geese-Map",
    description: "[Backend] A Springboot, Java & Python web-app that's a heatmap-based social interaction website, built using five different Microservices.",
    githubUrl: "https://github.com/amJenish/geese-map",
    tags: ["Java", "Springboot", "Python", "mySQL", "IBM Cloud Object Storage", "Roboflow API"],
    featured: true,
    content: `

A backend-focused, microservices-based system that powers a location-based social interaction heatmap. This project emphasizes service-oriented architecture, data pipelines, and applied machine learning integration.

The frontend is maintained in a separate repository and is demonstrated in the project video. As this was a group project, frontend implementation and maintenance were handled by other team members, while I was responsible for backend system design, service implementation, and data processing.

## Key Features
- Microservices-based backend architecture
- Image ingestion and cloud object storage
- Automated image verification via ML APIs
- Metadata extraction for location-based analysis
- Post orchestration and data aggregation for heatmap visualization

## Backend Services
- **AccountService** – User authentication and account management
- **ImageUploadService** – Stores images in IBM Cloud Object Storage and returns reference links
- **ImageVerificationService** – Validates image content using the Roboflow API (coded in python)
- **MetadataExtractionService** – Extracts structured metadata (location, time taken) from images
- **PostService** – Orchestrates post creation and aggregates data for frontend consumption

## Tech Stack
- Java
- Spring Boot
- Python
- IBM Cloud Object Storage
- Roboflow API
- Google Maps API
- RESTful Microservices
    `
  }