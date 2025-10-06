---
layout: single
title: "Defining the NYC Taxi OLTP Core — A Modern ER Skeleton for Analytics-Ready Data _(Draft)_"
excerpt: "A blueprint for transforming the raw NYC Taxi dataset into a clean, normalized OLTP schema—built for integrity, extensibility, and analytical evolution. This is where transactional truth meets analytical clarity."
date: 2025-10-06
classes:
  - center-page
author: michael_lockwood
author_profile: true
sidebar: false
toc: true
toc_label: "SECTIONS"
toc_icon: "list"
categories: [nyc-taxi, database-design]
tags: [OLTP, ERD, normalization, SQL-Server, PostgreSQL, analytics]
header:
  overlay_color: "#000"
  overlay_filter: "0.75"
  overlay_image: /assets/images/default-overlay-wide.jpg 
  caption: "From rides to relational database structure — the NYC Taxi OLTP foundation."
---

# PSEUDOCODE — Step 1: Define OLTP ER Skeleton (NYC Taxi + Passenger)

**Goal:**  
Sketch the minimal normalized OLTP core so that future analytics (facts/dims) drop out cleanly.

**Principles:**  
- Surrogate integer PKs  
- Stable natural keys captured when available  
- Strict FKs  
- Timestamps (`CreatedAt`, `UpdatedAt`)  
- Effective-dating only for true reference domains  

---

## 1️⃣ Entities (tables)

| Entity | Description |
|:--|:--|
| **Ride** | Central business event (one taxi trip) |
| **Passenger** | Person entity (synthetic IDs; no PII) |
| **RidePassenger** | Bridge table supporting `passenger_count ≥ 1` |
| **Driver** | Licensed driver entity |
| **Vehicle** | Cab/medallion or TLC vehicle ID |
| **Vendor** | Trip provider (per data dictionary) |
| **RateCode** | Reference domain |
| **PaymentType** | Reference domain |
| **Location** | TLC TaxiZone (pickup/dropoff) |
| **FareDetail** | Per-ride monetary breakdown (base, tolls, surcharges, tips, tax, total) |
| *later* | `Shift`, `CalendarDate` (for analytics layer) |

---

## 2️⃣ Primary Attributes (minimum)

| Table | Key / Columns (summary) |
|:--|:--|
| **Ride** | `RideID (PK)`, `PickupUTC`, `DropoffUTC`, `TripDistance`, `StoreAndFwdFlag`, `VendorID (FK)`, `RateCodeID (FK)`, `PULocationID (FK)`, `DOLocationID (FK)`, `DriverID (FK)`, `VehicleID (FK)` |
| **Passenger** | `PassengerID (PK)`, `PassengerType (e.g., Adult/Child/Unknown)`, `IsSynthetic (bool)` |
| **RidePassenger** | `RideID (FK)`, `PassengerID (FK)`, `SeatIndex (1..n)` → `PK (RideID, SeatIndex)` |
| **Driver** | `DriverID (PK)`, `LicenseNumber (NK)`, `ActiveFrom`, `ActiveTo` |
| **Vehicle** | `VehicleID (PK)`, `MedallionOrTLCID (NK)`, `ActiveFrom`, `ActiveTo` |
| **Vendor** | `VendorID (PK)`, `Code (NK)`, `Name` |
| **RateCode** | `RateCodeID (PK)`, `Code (NK)`, `Description` |
| **PaymentType** | `PaymentTypeID (PK)`, `Code (NK)`, `Name` |
| **Location** | `LocationID (PK)`, `Borough`, `Zone`, `ServiceZone` |
| **FareDetail** | `RideID (PK/FK)`, `FareAmount`, `Extra`, `MTA`, `TipAmount`, `TollsAmount`, `ImprovementSurcharge`, `CongestionSurcharge`, `AirportFee`, `TotalAmount`, `PaymentTypeID (FK)` |

---

## 3️⃣ Relationships

- `Ride 1..1 ↔ 0..1 FareDetail` (usually 1:1)  
- `Ride 1..* ↔ 1 Passenger` via `RidePassenger` (supports N passengers)  
- `Ride → Vendor / RateCode / Driver / Vehicle / Location` (many→one)  
- Domain tables (`RateCode`, `PaymentType`, `Vendor`) are SCD-light or static  

---

## 4️⃣ Mapping from NYC Columns (yellow/green)

| Source Column | Target Column |
|:--|:--|
| `tpep_pickup_datetime / lpep_pickup_datetime` | → `Ride.PickupUTC` |
| `tpep_dropoff_datetime / lpep_dropoff_datetime` | → `Ride.DropoffUTC` |
| `passenger_count` | → create `passenger_count` rows in `RidePassenger` with synthetic `Passenger` rows (`Type = Unknown` unless enriched) |
| `VendorID` | → `Ride.VendorID` (seed `Vendor`) |
| `RatecodeID` | → `Ride.RateCodeID` (seed `RateCode`) |
| `PULocationID / DOLocationID` | → `Ride.PU/DO LocationID` |
| `payment_type` | → `FareDetail.PaymentTypeID` (seed `PaymentType`) |
| Fare numeric fields | → `FareDetail` columns |
| `store_and_fwd_flag` | → `Ride.StoreAndFwdFlag` |
| `trip_distance` | → `Ride.TripDistance` |
| `congestion_surcharge`, `airport_fee`, etc. | → `FareDetail` |

---

## 5️⃣ Minimal Integrity Rules

- `Ride.DropoffUTC >= Ride.PickupUTC`  
- `RidePassenger.SeatIndex` is contiguous `1..N` per ride and matches original `passenger_count`  
- `FareDetail.TotalAmount ≈ SUM(components)` (with small tolerance)  
- All FKs `NOT NULL` except domains explicitly optional  

---
