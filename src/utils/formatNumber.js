const formatNumber = (input) => {
    const number = parseFloat(input);
    if (isNaN(number)) {
        return '-';
    }
    return number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
};

export default formatNumber;
