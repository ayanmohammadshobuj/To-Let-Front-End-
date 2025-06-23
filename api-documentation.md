# To-Let API Documentation

This document provides a comprehensive guide to all APIs available in the To-Let project, organized by service.

## Table of Contents
- [Authentication](#authentication)
- [User Service](#user-service)
- [Post Service](#post-service)
- [Notification Service](#notification-service)
- [Chat Service](#chat-service)

## Base URL

All API requests should be made to the base URL: `http://localhost:8080`

The API Gateway routes requests to the appropriate microservices based on the path.

## Authentication

Most endpoints require authentication using JWT tokens. To authenticate:

1. Obtain a JWT token by calling the login endpoint
2. Include the token in the Authorization header of subsequent requests:
   ```
   Authorization: Bearer <your_jwt_token>
   ```

### Authentication Endpoints

#### Login
```
POST /api/auth/login
```

Request body:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "user123",
  "email": "user@example.com",
  "role": "RENTER"
}
```

#### Register
```
POST /api/auth/register
```

Request body:
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890",
  "role": "RENTER"
}
```

Note: The `role` field is optional and defaults to "RENTER" if not provided.

Response:
```
User registered successfully
```

#### Verify Email
```
POST /api/auth/verify-email
```

Request body:
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

Response:
```json
{
  "status": "success",
  "message": "Email verified successfully"
}
```

#### Resend OTP
```
POST /api/auth/resend-otp
```

Request body:
```json
{
  "email": "john@example.com"
}
```

Response:
```json
{
  "status": "success",
  "message": "OTP sent to your email"
}
```

## User Service

### User Management

#### Get User by ID
```
GET /api/users/{userId}
```

Response: User object

#### Update User
```
PUT /api/users/{userId}
```

Request body: User object with updated fields

Response: Updated User object

#### Delete User
```
DELETE /api/users/{userId}
```

Response: 200 OK

#### Verify User (Admin only)
```
POST /api/users/{userId}/verify
```

Response: Updated User object

#### Upload Profile Image
```
POST /api/users/{userId}/profile-image
```

Request: Multipart form with "image" field containing the image file

Response: Updated User object

#### Get Profile Image
```
GET /api/users/{userId}/profile-image
```

Response: Image file

### Address Management

#### Add Address
```
POST /api/users/{userId}/addresses
```

Request body: Address object

Response: Created Address object

#### Get Address
```
GET /api/users/{userId}/addresses/{addressId}
```

Response: Address object

#### Get All Addresses
```
GET /api/users/{userId}/addresses
```

Response: Array of Address objects

#### Update Address
```
PUT /api/users/{userId}/addresses/{addressId}
```

Request body: Address object with updated fields

Response: Updated Address object

#### Delete Address
```
DELETE /api/users/{userId}/addresses/{addressId}
```

Response: 200 OK

#### Set Default Address
```
PUT /api/users/{userId}/addresses/{addressId}/default
```

Response: Updated Address object

#### Get Default Address
```
GET /api/users/{userId}/addresses/default
```

Response: Address object

#### Get Addresses by Type
```
GET /api/users/{userId}/addresses/type/{addressType}
```

Response: Array of Address objects

#### Get Nearby Addresses
```
GET /api/users/{userId}/addresses/nearby?latitude={latitude}&longitude={longitude}&district={district}&radiusInKm={radiusInKm}
```

Parameters:
- latitude: Latitude coordinate
- longitude: Longitude coordinate
- district: (Optional) District name
- radiusInKm: (Optional, default: 10) Search radius in kilometers

Response: Array of AddressDTO objects

### Membership Management

#### Create Membership
```
POST /api/memberships/{userId}?level={membershipLevel}
```

Parameters:
- level: Membership level (enum value)

Response: Created Membership object

#### Get Membership
```
GET /api/memberships/{userId}
```

Response: Membership object

#### Update Membership
```
PUT /api/memberships/{userId}?level={membershipLevel}
```

Parameters:
- level: New membership level (enum value)

Response: Updated Membership object

#### Delete Membership
```
DELETE /api/memberships/{userId}
```

Response: 200 OK

## Post Service

### Post Management

#### Create Post
```
POST /api/posts
```

Request: Multipart form with:
- "post": JSON object with post details
- "images": (Optional) Array of image files

Post JSON structure:
```json
{
  "title": "3 Bedroom Apartment for Rent",
  "description": "Spacious apartment with great view",
  "price": 1500.00,
  "serviceType": "RENT",
  "houseType": "APARTMENT",
  "houseDetails": {
    "bedrooms": 3,
    "bathrooms": 2,
    "kitchens": 1,
    "livingRooms": 1,
    "balconies": 1,
    "diningRooms": 1,
    "area": 1200.0,
    "furnished": true
  },
  "address": {
    "country": "Bangladesh",
    "division": "Dhaka",
    "district": "Dhaka",
    "area": "Gulshan",
    "addressDetails": "Road 12, House 7",
    "zipCode": "1212"
  },
  "location": {
    "latitude": 23.7937,
    "longitude": 90.4066
  },
  "availableFrom": "2023-07-01",
  "expiryDate": "2023-12-31"
}
```

Response: Created Post object

#### Get All Posts
```
GET /api/posts
```

Response: Array of Post objects

#### Get Post by ID
```
GET /api/posts/{id}
```

Response: Post object

#### Get My Posts
```
GET /api/posts/my-posts
```

Response: Array of Post objects belonging to the authenticated user

#### Get Posts by User ID
```
GET /api/posts/user/{userId}
```

Response: Array of Post objects

#### Update Post
```
PUT /api/posts/{id}
```

Request: Multipart form with:
- "post": JSON object with updated post details
- "images": (Optional) Array of image files

Response: Updated Post object

#### Delete Post
```
DELETE /api/posts/{id}
```

Response:
```json
{
  "message": "Post deleted successfully"
}
```

#### Get Trending Posts
```
GET /api/posts/trending
```

Response: Array of trending Post objects

#### Get Recently Viewed Posts
```
GET /api/posts/recently-viewed
```

Response: Array of recently viewed Post objects

## Notification Service

### Notification Management

#### Get User Notifications
```
GET /api/notifications/{userId}
```

Response: Array of Notification objects

#### Get Unread Notifications
```
GET /api/notifications/{userId}/unread
```

Response: Array of unread Notification objects

#### Mark Notification as Read
```
PUT /api/notifications/{notificationId}/read
```

Response: 200 OK

## Chat Service

### Chat Room Management

#### Create Chat Room
```
POST /api/chat-rooms
```

Request body:
```json
{
  "name": "Property Discussion",
  "participants": ["user1", "user2"]
}
```

Response: Created ChatRoom object

#### Get Messages by Chat Room ID
```
GET /api/chat-rooms/{chatRoomId}/messages
```

Response: Array of ChatMessage objects

### Chat Message Management

#### Send Message (REST API)
```
POST /api/chat-messages
```

Request body:
```json
{
  "chatRoomId": 1,
  "senderId": "user1",
  "content": "Hello, I'm interested in your property",
  "timestamp": "2023-06-15T14:30:00"
}
```

Response: Created ChatMessage object

### WebSocket Chat

The application also supports real-time chat via WebSockets.

#### Connect to WebSocket
```
ws://localhost:8080/ws-chat
```

#### Subscribe to Chat Room
```
/topic/chat/{roomId}
```

#### Send Message to Chat Room
```
/chat/{roomId}/sendMessage
```

Message format:
```json
{
  "chatRoomId": 1,
  "senderId": "user1",
  "content": "Hello, I'm interested in your property",
  "timestamp": "2023-06-15T14:30:00"
}
```

## Service Types

Available service types:
- RENT
- SELL
- SERVICE

## House Types

Available house types:
- APARTMENT
- VILLA
- BUNGALOW
- STUDIO
- LOFT
- TOWNHOUSE
- COTTAGE
- FARMHOUSE
- MANSION
- PENTHOUSE
- CONDO
- CHALET
- CABIN
- RANCH
- MOBILE_HOME
- TRAILER_HOME
