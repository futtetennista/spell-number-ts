const validate = (range, query) => {
    const input = parseInt(query);
    if (isNaN(input)) {
        return `${query} is not a number.`;
    }
    if (input <= range.low || input >= range.up + 1) {
        return `Input ${input} is not within allowed range [${range.low}, ${range.up}]`;
    }
    return input;
};
export const translate = (range, query, debug) => {
    const validation = validate(range, query);
    if (typeof validation === "string") {
        return { type: "error", error: validation };
    }
    else {
        const inputParsed = parseNumber(validation);
        if (debug) {
            console.log(inputParsed);
        }
        return { type: "success", content: translateInput(inputParsed) };
    }
};
export default translate;
const powersOfTen = [4, 3, 2, 1];
const powerOfTenToUnit = {
    1: "unit",
    2: "tens",
    3: "hundreds",
    4: "thousands",
};
const getUnit = (x, power) => {
    const digit = Math.floor((x % Math.pow(10, power)) / Math.pow(10, (power - 1)));
    const units = powerOfTenToUnit[power];
    return { digit, units };
};
const emptyParsedInput = { digit: 0, units: "unit" };
const parseNumber = (x) => powersOfTen.map((i) => getUnit(x, i));
const translateInput = (input) => input
    .filter((x) => (x.units !== "unit" ? x.digit !== 0 : true))
    .reduceRight((acc, x, idx, arr) => dispatch(x, idx + 1 < arr.length ? arr[idx + 1] : emptyParsedInput, acc, arr.length == 1), "");
const dispatch = (current, previous, acc, showZero) => {
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
            return join(previous.digit !== 0 && previous.units === "hundreds", translateThousands(current.digit), acc);
    }
};
const join = (useSpace, x, y) => x === "" ? y : y === "" ? x : useSpace ? `${x} ${y}` : `${x} and ${y}`;
const translateUnit = (x, showZero) => {
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
const tensToLetters_ = (digit) => {
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
const translateTens = (x, y) => {
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
const translateHundreds = (digit) => digit === 0 ? "" : `${translateUnit(digit, false)} hundred`;
const translateThousands = (digit) => digit === 0 ? "" : `${translateUnit(digit, false)} thousand`;
//# sourceMappingURL=app.js.map