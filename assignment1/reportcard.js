// Student Grade Report
// Usage: node solution.js <name> <score1> <score2> <score3> [more scores...]

// ─── P2: CLI Input ───────────────────────────────────────────────────────────

// P2a: Parse argv
const name = process.argv[2];
const scores = process.argv.slice(3).map(Number);

// P2b: Validate - need at least 3 scores
if (scores.length < 3) {
  console.error("Error: Please provide a name and at least 3 scores.");
  console.error("Usage: node solution.js <name> <score1> <score2> <score3> [...]");
  process.exit(1);
}

// ─── P1: Student Class ───────────────────────────────────────────────────────

class Student {
  // P1a: Constructor
  constructor(name, scores) {
    this.name = name;       // string
    this.scores = scores;   // number[]
  }

  // P1b: get average — mean using a loop (no reduce)
  get average() {
    let total = 0;
    for (let i = 0; i < this.scores.length; i++) {
      total += this.scores[i];
    }
    return total / this.scores.length;
  }

  // P1c: get letterGrade — based on average
  // Grade scale:
  //   A : 90 – 100
  //   B : 80 – 89
  //   C : 70 – 79
  //   D : 60 – 69
  //   F : below 60
  get letterGrade() {
    const avg = this.average;
    if (avg >= 90) return "A";
    else if (avg >= 80) return "B";
    else if (avg >= 70) return "C";
    else if (avg >= 60) return "D";
    else return "F";
  }

  // P1d: summary() — returns { highest, lowest } using a loop (no Math.max/min)
  summary() {
    let highest = this.scores[0];
    let lowest = this.scores[0];
    for (let i = 1; i < this.scores.length; i++) {
      if (this.scores[i] > highest) highest = this.scores[i];
      if (this.scores[i] < lowest)  lowest  = this.scores[i];
    }
    return { highest, lowest };
  }
}

// ─── P3: Formatted Output ────────────────────────────────────────────────────

// P3b helper: getRemark — switch on letter grade
function getRemark(grade) {
  switch (grade) {
    case "A": return "Outstanding";
    case "B": return "Good job";
    case "C": return "Satisfactory";
    case "D": return "Needs improvement";
    case "F": return "Failed";
    default:  return "Unknown";
  }
}

// ── Build the student object ──
const student = new Student(name, scores);
const { highest, lowest } = student.summary();
const avg   = student.average;
const grade = student.letterGrade;

// P3b: PASS/FAIL via ternary (pass if average ≥ 60)
const status = avg >= 60 ? "PASS" : "FAIL";
const remark = getRemark(grade);

// P3c: Score breakdown — destructure with rest syntax
const [score1, score2, ...remaining] = student.scores;

// P3a: Report card — template literals only, toFixed(1) for average
console.log(`
=============================
       STUDENT REPORT CARD
=============================
Name    : ${student.name}
Scores  : ${student.scores.join(", ")}
Average : ${avg.toFixed(1)}
Grade   : ${grade}
High    : ${highest}
Low     : ${lowest}
------------------------------
Status  : ${status}
Remark  : ${remark}
------------------------------
Score Breakdown:
  Score 1   : ${score1}
  Score 2   : ${score2}
  Remaining : ${remaining.length > 0 ? remaining.join(", ") : "none"}
=============================
`);
