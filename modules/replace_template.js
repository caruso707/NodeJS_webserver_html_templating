module.exports = (temp, product, slugs) => {
    let output = temp.replace(/{%PRODUCT%}/g, product.productName);
    output = output.replace(/{%EMOJI%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);
    output = output.replace(/{%URL_ID%}/g, slugs[product.id]);
    output = output.replace(/{%LOCATION%}/g, product.from);
    if(!product.organic) {
        output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    }
    return output;
}