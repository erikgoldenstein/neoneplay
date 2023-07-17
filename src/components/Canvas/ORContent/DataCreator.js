
const createDataList = async (data) => {
    let propObjList = [];
    let computerList = Object.keys(await data.body)
    computerList.map((property) => {
        if (property[0] != "@") {
            let iri_prefixed = ":" + property.split("#").at(-1)
            let object = iri_description[iri_prefixed]
            object.val = data.body[property]
            propObjList.push(object)
        }
    })
    return propObjList;
}

export default createDataList;