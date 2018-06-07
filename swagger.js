swagger: '2.0'
info:
description: Online Booking API
version: 1.0.0
title: MyBookingApp
contact:
email: labelleaffranchie@gmail.com
#schemes:
#-http
paths:


/signup:
post:
  tags: auth
  summary: createaccount
  consumes:
  - application/json
  produces:
  - application/json
  parameters:
  - in: body
    name: body
    required: true
    schema:
      $ref: '#/definitions/userSchema'
  responses:
  200:
    description: User created
  403:
    description: Username already exist
  400:
    description: Username should be a valid email
  412:
    description: Missing required fields




/login:
  post:
    tags:
      - auth
    summary: login
    description: a professionnal login to his account
    consumes:
      - application/json
    produces:
      - application/json
    parameters:
    - in: body
      name: body
      description: user required credentials
      type: array
      items:
        type: string
        enum:
        - username
        - password
        schema:
          $ref: '#/definitions/userSchema'
    responses:
      200:
        description: Token delivered
      400:
        description: Wrong password
      412:
        description: Missing required fields




/:
  post:
    tags:
    - slots
summary: create slots with available status
consumes:
- application/json
produces:
- application/json
parameters:
- name: body
in: body
required: true
type: array
schema:
$ref: '#/definitions/slotSchema'
responses:
200:
  description: new slot well saved
security:
- token

/apt:
  get:
  tags:
  - apt
  summary: get back the apt
  description: apt are objects with clients and appointment details
  produces:
  - application/json
  responses:
    200:
      description: Here is the client list
      schema:
      type: array
      items:
      $ref: '#/definitions/aptSchema'
    404:
      description: No Appointment found
  security:
    - token

/:
get:
  tags:
  - clients
  summary: get back the slots
  description: slots are object with a status
  produces:
  - application/json
  responses:
      200:
      description: Here is the Slot list
      schema:
      type: array
      items:
      $ref: '#/definitions/slotSchema'
      204:
        description: No availabilities


/:
get:
tags:
- slots
summary: get back the slots
responses:
  200:
    description: Here is the Slot list
    schema:
    type: array
    items:
      $ref: '#/definitions/slotSchema'
  404:
    description: No Slot found
    security:
    - token





    
/client/apt:
  post:
    tags:
    - apt
  summary: create apt and provide slot id
  consumes:
  - application/json
  produces:
  - application/json
  parameters:
  - name: body
  in: body
  description: 
  required: true
  type: array
  items:
    type: mixed
    enum:
    -slot_id
    -lastname
    -email
    -time

  schema:
  $ref: '#/definitions/slotSchema'
  $ref: '#/definitions/aptSchema'
  responses:
  200:
  description: OK
  400:
  description: missing fields
  403:
  description: unvalid fields
  
definitions:
userSchema:
type: object
properties:
username: 
type: string
required: true
password: 
type: string
required: true
firstname:
type: String
lastname: 
type: string
token:
type: string
creationDate:
type: Date
slotSchema:
type: object
properties:
start:
type: string
required: true
end:
type: string
required: true
duration : 
type: number
required: true
status :
type: string
required: true
aptSchema:
type: object
properties:
lastname :
type: string
required: true
email : 
type: string
required: true
time: 
type : string
required: true
duration:
type : number
required: true
externalDocs:
description: Find out more about Swagger
url: http://swagger.io
# Added by API Auto Mocking Plugin
host: virtserver.swaggerhub.com
basePath: /SandrinePradier/MyBookingAppBack/1.0.0