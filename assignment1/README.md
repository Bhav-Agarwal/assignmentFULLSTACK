# Student Grade Report

A Node.js CLI program that accepts a student's name and scores as command-line arguments and prints a formatted report card.

## 📁 File Structure

```
student-grade-report/
├── solution.js   # Main program
├── .gitignore    # Node gitignore
└── README.md     # This file
```

## 🚀 Usage

```bash
node solution.js <name> <score1> <score2> <score3> [more scores...]
```

### Example

```bash
node solution.js Alice 85 92 78 90 88
```

### Output

```
=============================
       STUDENT REPORT CARD
=============================
Name    : Alice
Scores  : 85, 92, 78, 90, 88
Average : 86.6
Grade   : B
High    : 92
Low     : 78
------------------------------
Status  : PASS
Remark  : Good job
------------------------------
Score Breakdown:
  Score 1   : 85
  Score 2   : 92
  Remaining : 78, 90, 88
=============================
```

## ✅ Requirements

- Node.js (any modern version)
- No external packages needed

## 📌 Validation

If fewer than 3 scores are provided, the program exits with an error:

```bash
node solution.js Alice 80
# Error: Please provide a name and at least 3 scores.
```

## 🧩 Concepts Covered

| Part | Concept |
|------|---------|
| P1a  | `class` & `constructor` |
| P1b  | `get` accessor, loop for average |
| P1c  | `get` accessor, `if/else` for letter grade |
| P1d  | Method, loop for highest/lowest (no `Math.max/min`) |
| P2a  | `process.argv`, type conversion |
| P2b  | Input validation, `process.exit(1)` |
| P3a  | Template literals, `toFixed()` |
| P3b  | Ternary operator, `switch` statement |
| P3c  | Destructuring, rest syntax (`...remaining`) |
