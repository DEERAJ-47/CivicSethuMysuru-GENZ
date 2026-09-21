# Civic Sethu Mysuru

Civic Sethu is a five-layer civic accountability system for Mysuru district. It combines IoT hardware detection, machine learning spam prevention, and a web-based complaint escalation engine.

Built for HackMySuru 1.0 - Phase 1: Civic Governance and Clean Mysuru.

---

## Team Info

Team Name: Genz
Team ID: HM26-9B35
Members:
- Deeraj - Full stack and hardware
- Additional members and roles to be listed

---

## Live Links

Live Web App: https://civic-sethu-mysuru.netlify.app/

GitHub Repository: https://github.com/DEERAJ-47/CivicSethuMysuru-GENZ

Demo Video: https://drive.google.com/file/d/1hLJWKDM7KrIAg9YK7Rx9Jy4ok6A2kRJH/view?usp=sharing

---

## Submission Deliverables

Source Code ZIP
HM26-9B35_source.zip
SHA-256: [PASTE SOURCE ZIP HASH HERE]

Decision Log PDF
Genz(HM26-9B35)_decision-log.pdf
SHA-256: 390B60F88453D808FB09E5106A02CE25AFE2C668C749B585588DD2AFFDD5FBEA

Presentation Deck PDF
Genz(HM26-9B35)_Presentation.pdf
SHA-256: B50511EE7818EDB4AD33429E50EB275A3E0D7EE88AA41AF3A55656EE1678523F

Demo Video MP4
Genz(HM26-9B35)_video.mp4
SHA-256: [PASTE VIDEO HASH HERE]

---

## Video Chapters

Part 1 - Pitch and Offline Tests
00:00 - Introduction to Civic Sethu and Team Genz
00:30 - Hardware demo - sensors, buzzer, LED, camera
02:00 - ML spam filter demonstration
03:00 - Live app walkthrough - login, file complaint, routing
04:00 - Escalation demo with 10-second timers
04:30 - Citizen rate and escalate flow

Part 2 - Code Walkthrough
05:00 - escalation.js - 24-hour timer and auto-escalation logic
06:00 - routing.js - PIN code to authority mapping
07:00 - officers.js - ranking formula and profile computation
08:00 - security_system ML model for image classification
09:00 - GitHub commit history and repo structure

---

## System Architecture

Layer 1 - Hardware Detection
- ESP32 or Arduino with motion sensors
- Buzzer and LED alert triggered on detection
- Camera captures photograph

Layer 2 - ML Verification
- Image classification model validates captured image
- Rejects spam, irrelevant, and duplicate submissions
- Only verified images pass to the web app

Layer 3 - Auto-Filing
- Verified complaint is auto-created in Civic Sethu
- System identifies location type, taluk, and administrative area
- Routes to correct Level 1 authority

Layer 4 - Escalation Engine
- 24-hour timer for normal complaints
- 6-hour timer for urgent complaints
- Auto-escalates on timer expiry

City Chain
- Ward Officer, MCC, Senior MCC, District Administration, Police, MLA or MP

Village Chain
- Gram Panchayat PDO, Taluk Panchayat EO, Zilla Panchayat CEO, District Administration, Police, MLA or MP

Illegal Dumping City Chain
- MCC, Ward or Zone Sanitation, Senior Municipal Admin, DC, KSPCB, MLA or MP

Illegal Dumping Village Chain
- Gram Panchayat, Taluk Admin, Zilla Panchayat, DC, KSPCB, MLA or MP

Layer 5 - Citizen Feedback
- Citizens rate officers from 1 to 5 stars
- Citizens escalate with a written paragraph
- Ratings update officer rank scores live

---

## Problem Categories

- General waste
- App dumping
- Construction waste
- Potholes
- Electricity
- Drainage
- Water

---

## Officer Ranking Formula

Rank Score is computed from:
- Resolution Rate
- Citizen Rating
- Escalations Against
- Publicly Flagged Count
- Average Resolution Days

Rank Bands:
- 90 to 100: A+
- 75 to 89: A
- 60 to 74: B
- 45 to 59: C
- Below 45: D

---

## Tech Stack

Frontend
- HTML5, CSS3, Vanilla JavaScript
- Leaflet.js with OpenFreeMap tiles

Backend Logic
- Browser localStorage for sessions
- In-memory complaint store
- Client-side escalation timer

Data
- GeoJSON administrative boundaries
- 9 taluks, 266 Gram Panchayats, 65 MCC wards
- 8 Urban Local Bodies, 11 MLAs, 2 MPs

Hardware
- ESP32 or Arduino, motion sensors, buzzer, LED, camera module

Machine Learning
- Image classification for garbage and pothole detection
- Spam filtering before upload

---

## How To Run Locally

Clone the repository.

Open a terminal in the Civic Sethu - Escalation folder.

Start a local server.

python -m http.server 8000

Open http://localhost:8000 in a browser.

---

## License

Built for HackMySuru 1.0 Phase 1: Civic Governance and Clean Mysuru.

# CivicSethuMysuru-GENZ

Our hardware detects illegal dumping via sensors, triggering buzzer, LED, and camera. 

ML verifies the photo to prevent spam. 

Verified images auto-file complaints in our web app, which routes them by level—taluk, panchayat, MCC—with a 24-hour escalation timer and citizen rating system.

TEAM DETAILS 

1) DEERAJ .C    -----> Rajarajeswari College of Engineering - MCA DEPARTEMENT
2) NAVATEJA . S -----> Rajarajeswari College of Engineering - BCA DEPARTEMENT
3) PRARTHANA    -----> Rajarajeswari College of Engineering - BCA DEPARTEMENT
4) LAVANYA. R   -----> Rajarajeswari College of Engineering - BCA DEPARTEMENT



LINK :- 
1) WEBSITE LINK :- https://civic-sethu-mysuru.netlify.app/
2) VIDEO LINK :- https://drive.google.com/file/d/1hLJWKDM7KrIAg9YK7Rx9Jy4ok6A2kRJH/view?usp=sharing
3) Submission Deliverables a ) ppt presentation:- https://drive.google.com/file/d/1t3zq8TIEqN474T_qWM-_BBaW4cwuNrNn/view?usp=sharing
4)  Submission Deliverables b ) decision log.:- https://drive.google.com/file/d/1D7_ij6Ib7DQTQc4qPL8jAGXM6QnV_QD_/view?usp=sharing
   
