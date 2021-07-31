// search term
const search = 'rtx 3070';

async function getMag(url) {
    const response = await fetch(url);
    const result = await response.text();
    return result.match(/(?<=productMagCount":)\d+(?=})/gm)[0]
}


async function getLinks() {
    const chunk_url = await fetch(`https://${document.body.innerHTML.match(/assets.x-kom.pl.public-spa.xkom.chunk-app-[A-Za-z0-9]+.es5.min.js/)[0]}`);
    const chunk_response = await chunk_url.text();
    const apiKey = await chunk_response.match(/(?<=xkom",key:")[A-Za-z0-9]+/gm)[0];
    const response = await fetch(`https://mobileapi.x-kom.pl/api/v1/xkom/products?productQuery.criteria.useAutoFuzziness=false&productQuery.childCategorySort=priority%20desc&productQuery.criteria.groupIds=5&productQuery.criteria.searchText=${search}&productQuery.criteria.expand=Features%2CDepartments%2CProductMarks%2CSeo&productQuery.pagination.currentPage=1&productQuery.pagination.pageSize=30&productQuery.sort=Accuracy%20desc`, {
        "headers": {
            "x-api-key": apiKey
        }
    });
    const result = await response.json();
    return result.Items.filter(i => !i.WebUrl.includes("pakiet")).map(i => [i.WebUrl, i.Name.trim(), i.Price]);

}

getLinks().then(result => result.forEach(async (i) => {
    let magcount = await getMag(i[0]);
    console.log(`%csztuk: ${magcount}, %c${i[1]}, cena: %c${i[2]}zł`, 'color: green', 'color: gray', 'color: yellow');
}))



