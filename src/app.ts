import express from "express";

const app = express();

app.get("/translate", (req, res) => {
  const inputQ = req.query;
  const input = parseInt(inputQ["input"] as string);
  const inputParsed = parseNumber(input);
  // console.log(inputParsed)
  const inputTranslated = translateInput(inputParsed);
  // console.log(inputTranslated)
  res.send(inputTranslated);
});

export const runServer = (port: number) => app.listen(port);
export default runServer;

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

const translateInput = (input: Array<ParsedInput>): string =>
  input
    .filter((x) => (x.units !== "unit" ? x.digit !== 0 : true))
    .reduceRight(
      (acc: string, x: ParsedInput, i: number, arr: Array<ParsedInput>) =>
        dispatch(
          x,
          i + 1 < arr.length ? arr[i + 1] : emptyParsedInput,
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
      return translateUnit(current.digit, showZero);
    case "tens":
      // return /* current.digit === 0 ? acc : */ translateTens(
      return translateTens(current.digit, previous.digit);
    case "hundreds":
      return join(false, translateHundreds(current.digit), acc);
    case "thousands":
      return join(
        previous.digit !== 0 && previous.units === "hundreds",
        translateThousands(current.digit),
        acc
      );
  }
};

const join = (useSpace: boolean, x: string, y: string) =>
  x === "" ? y : y === "" ? x : useSpace ? `${x} ${y}` : `${x} and ${y}`;

type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

const translateUnit = (x: Digit, showZero: boolean): string => {
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

const translateTens = (x: Digit, y: Digit): string => {
  switch (x) {
    case 0:
      return "";
    case 1:
      return tensToLetters_(y);
    case 2:
      return y == 0 ? "twenty" : `twenty-${translateUnit(y, false)}`;
    case 3:
      return y == 0 ? "thirty" : `thirty-${translateUnit(y, false)}`;
    case 4:
      return y == 0 ? "fourty" : `fourty-${translateUnit(y, false)}`;
    case 5:
      return y == 0 ? "fifty" : `fifty-${translateUnit(y, false)}`;
    case 6:
      return y == 0 ? "sixty" : `sixty-${translateUnit(y, false)}`;
    case 7:
      return y == 0 ? "seventy" : `seventy-${translateUnit(y, false)}`;
    case 8:
      return y == 0 ? "eighty" : `eighty-${translateUnit(y, false)}`;
    case 9:
      return y == 0 ? "ninety" : `ninety-${translateUnit(y, false)}`;
  }
};
const translateHundreds = (digit: Digit): string =>
  digit === 0 ? "" : `${translateUnit(digit, false)} hundred`;
const translateThousands = (digit: Digit): string =>
  digit === 0 ? "" : `${translateUnit(digit, false)} thousand`;
