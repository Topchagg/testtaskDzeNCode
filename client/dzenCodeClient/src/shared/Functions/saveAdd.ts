function safeAdd(a:number, b:number,c:number,d:number) {
    const numA = isNaN(a) ? 0 : Number(a);
    const numB = isNaN(b) ? 0 : Number(b);
    const numC = isNaN(b) ? 0 : Number(c);
    const numD = isNaN(d) ? 0 : Number(d);

    // console.log(numA+numB+numC+numD)
    return numA + numB+numC+numD;
}

export default safeAdd