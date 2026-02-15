# VersionDB

### A Version Controlled Relational Database System

VersionDB is a lightweight relational database system with built in
version control features inspired by modern snapshot based storage
systems and the object model used in Git.

This project is developed as a DBMS lab project to explore multi version
storage, branching, and time travel queries within a relational database
environment.

------------------------------------------------------------------------

## Project Objective

Traditional relational databases overwrite data during updates.
VersionDB introduces:

-   Snapshot based commits\
-   Branching support\
-   Time travel queries\
-   Merge and conflict detection

The goal is to combine core database concepts with version control
mechanisms in a single lightweight system.

------------------------------------------------------------------------

## Features

-   Table creation\
-   Insert, Update, Delete operations\
-   Commit system using full database snapshots\
-   Branch creation and switching\
-   Checkout previous versions\
-   Diff between commits\
-   Merge with conflict detection\
-   Commit history tracking

------------------------------------------------------------------------

## Core Concepts Used

-   Relational Data Model\
-   File based Storage Engine\
-   Hash based Object Storage\
-   Copy on Write Snapshots\
-   Directed Acyclic Graph commit structure\
-   Multi Version Storage

------------------------------------------------------------------------

## Project Structure

    mydb/
    │
    ├── objects/          # Stores commit snapshots
    ├── refs/             # Branch pointers
    │   └── main
    ├── HEAD              # Current branch reference
    └── db/               # Working database state
        └── data.json

------------------------------------------------------------------------

## How It Works

1.  Data is stored in the working directory db.
2.  On commit:
    -   Database snapshot is serialized.
    -   A SHA 256 hash is generated.
    -   Snapshot is stored inside objects.
    -   Branch pointer is updated.
3.  Branches are references to commit hashes.
4.  Checkout restores database state from a selected commit.

------------------------------------------------------------------------

## Tech Stack

-   Language: C or Python\
-   Storage: File based system\
-   Hashing: SHA 256\
-   Backend: SQLite optional\
-   Development Environment: Linux

------------------------------------------------------------------------

## Academic Relevance

VersionDB demonstrates:

-   Snapshot isolation principles\
-   Versioned storage design\
-   Branch based data evolution\
-   Conflict detection strategies

This project focuses on database engine architecture rather than
application level CRUD systems.

------------------------------------------------------------------------

## Future Improvements

-   Row level versioning similar to MVCC\
-   Storage deduplication optimization\
-   Index support\
-   Performance benchmarking\
-   Graph visualization of commit history

------------------------------------------------------------------------

