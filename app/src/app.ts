type Result<T> =
  | { type: "success"; content: T }
  | { type: "error"; error: string };

const validate = (
  range: { low: number; up: number },
  query: string
): string | number => {
  const input = parseInt(query);
  if (isNaN(input)) {
    return `${query} is not a number.`;
  }
  if (input < range.low || input > range.up) {
    return `Input ${input} is not within allowed range [${range.low}, ${range.up}]`;
  }
  return input;
};

export const spellNumber = (
  range: { low: number; up: number },
  query: string,
  debug?: boolean
): Result<string> => {
  const validation = validate(range, query);
  if (typeof validation === "string") {
    return { type: "error", error: validation };
  } else {
    const inputParsed = parseNumber(validation);
    if (debug) {
      console.log(inputParsed);
    }
    return { type: "success", content: spellNumberInternal(inputParsed) };
  }
};

export default spellNumber;

const powersOfTen: Array<number> = [4, 3, 2, 1];

type UnitsRange = typeof powersOfTen[number];

type Units = "unit" | "tens" | "hundreds" | "thousands";

const powerOfTenToUnit: { readonly [key in UnitsRange]: Units } = {
  1: "unit",
  2: "tens",
  3: "hundreds",
  4: "thousands",
};

const getUnit = (x: number, power: number): ParsedInput => {
  const digit = Math.floor((x % 10 ** power) / 10 ** (power - 1)) as Digit;
  const units = powerOfTenToUnit[power];
  return { digit, units };
};

type ParsedInput = { digit: Digit; units: Units };

const emptyParsedInput: ParsedInput = { digit: 0, units: "unit" };

const parseNumber = (x: number): Array<ParsedInput> =>
  powersOfTen.map((i: number) => getUnit(x, i));

const spellNumberInternal = (input: Array<ParsedInput>): string =>
  input
    .filter((x) => (x.units !== "unit" ? x.digit !== 0 : true))
    .reduceRight(
      (acc: string, x: ParsedInput, idx: number, arr: Array<ParsedInput>) =>
        dispatch(
          x,
          idx + 1 < arr.length ? arr[idx + 1] : emptyParsedInput,
          acc,
          arr.length == 1
        ),
      ""
    );

const dispatch = (
  current: ParsedInput,
  previous: ParsedInput,
  acc: string,
  showZero: boolean
) => {
  // console.log(current, prev, acc)
  switch (current.units) {
    case "unit":
      return spellUnit(current.digit, showZero);
    case "tens":
      return spellTens(current.digit, previous.digit);
    case "hundreds":
      return join(false, spellHundreds(current.digit), acc);
    case "thousands":
      return join(
        previous.digit !== 0 && previous.units === "hundreds",
        spellThousands(current.digit),
        acc
      );
  }
};

const join = (useSpace: boolean, x: string, y: string) =>
  x === "" ? y : y === "" ? x : useSpace ? `${x} ${y}` : `${x} and ${y}`;

type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

const spellUnit = (x: Digit, showZero: boolean): string => {
  switch (x) {
    case 0:
      return showZero ? "zero" : "";
    case 1:
      return "one";
    case 2:
      return "two";
    case 3:
      return "three";
    case 4:
      return "four";
    case 5:
      return "five";
    case 6:
      return "six";
    case 7:
      return "seven";
    case 8:
      return "eight";
    case 9:
      return "nine";
  }
};

const tensToLetters_ = (digit: Digit): string => {
  switch (digit) {
    case 0:
      return "ten";
    case 1:
      return "eleven";
    case 2:
      return "twelve";
    case 3:
      return "thirteen";
    case 4:
      return "fourteen";
    case 5:
      return "fifteen";
    case 6:
      return "sixteen";
    case 7:
      return "seventeen";
    case 8:
      return "eighteen";
    case 9:
      return "nineteen";
  }
};

const spellTens = (x: Digit, y: Digit): string => {
  switch (x) {
    case 0:
      return "";
    case 1:
      return tensToLetters_(y);
    case 2:
      return y == 0 ? "twenty" : `twenty-${spellUnit(y, false)}`;
    case 3:
      return y == 0 ? "thirty" : `thirty-${spellUnit(y, false)}`;
    case 4:
      return y == 0 ? "fourty" : `fourty-${spellUnit(y, false)}`;
    case 5:
      return y == 0 ? "fifty" : `fifty-${spellUnit(y, false)}`;
    case 6:
      return y == 0 ? "sixty" : `sixty-${spellUnit(y, false)}`;
    case 7:
      return y == 0 ? "seventy" : `seventy-${spellUnit(y, false)}`;
    case 8:
      return y == 0 ? "eighty" : `eighty-${spellUnit(y, false)}`;
    case 9:
      return y == 0 ? "ninety" : `ninety-${spellUnit(y, false)}`;
  }
};
const spellHundreds = (digit: Digit): string =>
  digit === 0 ? "" : `${spellUnit(digit, false)} hundred`;
const spellThousands = (digit: Digit): string =>
  digit === 0 ? "" : `${spellUnit(digit, false)} thousand`;
