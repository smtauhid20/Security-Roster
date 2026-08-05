const sSub = "Post-10 (Bangadoba Main Gate)".toLowerCase();
const rSub = "Reliever + Post-10".toLowerCase();

const sNums = sSub.match(/\d+/g) || [];
const rNums = rSub.match(/\d+/g) || [];

console.log(sNums, rNums);
if (sNums.length > 0 && rNums.length > 0) {
    if (sNums.some(num => rNums.includes(num))) {
        console.log("MATCH");
    }
}
