export function formatCurrency(priceCents){
    if(priceCents < 0){
        priceCents= 0;
    }
    return (Math.round(priceCents)/100).toFixed(2);
}