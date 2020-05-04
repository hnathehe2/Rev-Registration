interface GradesInit {
    gpa: number;
    A: number;
    B: number;
    C: number;
    D: number;
    F: number;
    I: number;
    S: number;
    Q: number;
    X: number;
}

export default class Grades {
  gpa: number;
  A: number;
  B: number;
  C: number;
  D: number;
  F: number;
  I: number;
  S: number;
  Q: number;
  X: number;
  constructor(init: GradesInit) {
    // None of the properties can be null
    if (init.gpa == null) { throw Error(`Grades.gpa is invalid: ${init.gpa}`); }
    if (init.A == null) { throw Error(`Grades.A is invalid: ${init.A}`); }
    if (init.B == null) { throw Error(`Grades.B is invalid: ${init.B}`); }
    if (init.C == null) { throw Error(`Grades.C is invalid: ${init.C}`); }
    if (init.D == null) { throw Error(`Grades.D is invalid: ${init.D}`); }
    if (init.F == null) { throw Error(`Grades.F is invalid: ${init.F}`); }
    if (init.I == null) { throw Error(`Grades.I is invalid: ${init.I}`); }
    if (init.S == null) { throw Error(`Grades.S is invalid: ${init.S}`); }
    if (init.Q == null) { throw Error(`Grades.Q is invalid: ${init.Q}`); }
    if (init.X == null) { throw Error(`Grades.X is invalid: ${init.X}`); }

    Object.assign(this, init);
  }
}
