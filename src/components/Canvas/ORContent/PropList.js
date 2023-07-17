import iri_description from '@/ontology/iri-description';
import { useEffect, useState } from 'react';
import PropLine from './PropLine';
import isValidHttpUrl from '@/helpers/isValidHttpUrl';
import { operation } from '@/helpers/Enums';



const PropList = ({ id, cardData, expansionState, links, setLinks, inEdit, setInEdit, setRefetch, token }) => {
    const [enrichedData, setEnrichedData] = useState([])
    const [elemList, setElemList] = useState([])
    const [data, setData] = useState([])
    const [changeList, setChangeList] = useState([])


    useEffect(() => { console.log("updateChangelist monitor:", changeList) }, [changeList])


    useEffect(() => {
        const patchDataCall = async () => {
            if (inEdit == 2) {
                let isChanged = false;
                for (let index in changeList) {
                    if (Object.keys(changeList[index]).length) {
                        isChanged = true;
                        console.log("change in:", index)
                    }
                }
                if (isChanged) {

                    let changeObj = [];
                    for (let index in changeList) {
                        console.log("elem that is viewed at:", index, "content:", changeList[index])
                        if (Object.keys(changeList[index]).length) {
                            console.log("enter in change")
                            if (changeList[index].op == operation.Change) {
                                console.log("addings diffs")
                                changeObj.push(
                                    {
                                        "@type": "api:Operation",
                                        "api:op": { "@id": "api:DELETE" },
                                        "api:s": id,
                                        "api:p": "https://onerecord.iata.org/ns/cargo#" + changeList[index].label,
                                        "api:o": [{
                                            "@type": "api:OperationObject",
                                            "api:hasDatatype": "http://www.w3.org/2001/XMLSchema#string",
                                            "api:hasValue": changeList[index].oldValue
                                        }]
                                    });
                                changeObj.push(
                                    {
                                        "@type": "api:Operation",
                                        "api:op": { "@id": "api:ADD" },
                                        "api:s": id,
                                        "api:p": "https://onerecord.iata.org/ns/cargo#" + changeList[index].label,
                                        "api:o": [{
                                            "@type": "api:OperationObject",
                                            "api:hasDatatype": "http://www.w3.org/2001/XMLSchema#string",
                                            "api:hasValue": changeList[index].newValue
                                        }]
                                    })

                            }
                        }
                    }
                    console.log(changeObj)
                    const body_obj = {
                        "@context": {
                            "cargo": "https://onerecord.iata.org/ns/cargo#",
                            "api": "https://onerecord.iata.org/ns/api#"
                        },
                        "@type": "api:Change",
                        "api:hasLogisticsObject": {
                            "@id": id
                        },
                        "api:hasDescription": "automatic change using neoneplay",
                        "api:hasOperation": changeObj,
                        "api:hasRevision": cardData.headers["latest-revision"]
                    }
                    //make fetch
                    if (Object.keys(body_obj["api:hasOperation"]).length) {
                        console.log("given correct body:", body_obj)
                        let res = await fetch(id, {
                            method: "PATCH",
                            headers: {
                                "Content-Type": "application/ld+json",
                                "Authorization": "Bearer " + token
                            },
                            body: JSON.stringify(body_obj)
                        })
                        console.log("RESPONSE CODE", res.status)
                        if (res.status == 201) {
                            setInEdit(0)
                            setRefetch(true)
                        }
                    } else {
                        console.log("body obj not parsed")
                    }
                }
                return
            }
        }
        patchDataCall()
    }, [inEdit, changeList])


    useEffect(() => {
        const getReadableData = (data) => {
            let propObjList = [];
            let computerList = Object.keys(data.body)
            computerList.map((property) => {
                if (property[0] != "@") {
                    let iri_prefixed = ":" + property.split("#").at(-1)
                    let object = iri_description[iri_prefixed]
                    if (!object) {
                        object = { Label: <span className='text-red-500'>{property.split("#").at(-1)}</span>, Description: "Invalid One Record Property" }
                    }
                    object.val = data.body[property]
                    propObjList.push(object)
                }
            })
            setEnrichedData(propObjList);
        }

        cardData && (cardData.body["@id"] == id) && getReadableData(cardData)
    }, [cardData])

    useEffect(() => {
        console.log("NEW CALL")
        let links = [];
        let data = []

        enrichedData.map((property, index) => {
            // decide what data type it is
            if ((typeof property.val) == "object" && !Array.isArray(property.val)) {
                // is object
                if (Object.keys(property.val).includes("@id") && Object.keys(property.val).includes("@type")) {
                    // is embedded object
                    if (property.Label == "grossWeight") {
                        const line = {
                            label: "Weight",
                            description: property.Description,
                            // value: "↓ embedded ↓",
                            value: `${+property.val["https://onerecord.iata.org/ns/cargo#numericalValue"]["@value"]} ${property.val["https://onerecord.iata.org/ns/cargo#unit"]}`,
                            indentation: 0,
                            isImage: false,
                            isURL: false,
                            isEditable: false
                        };
                        data.push(line);
                    } else {
                        const line = {
                            label: property.Label,
                            description: property.Description,
                            // value: "↓ embedded ↓",
                            value: "",
                            indentation: 0,
                            isImage: false,
                            isURL: false,
                            isEditable: false
                        };
                        data.push(line);
                        Object.keys(property.val).map((key, index) => {
                            if (key[0] == "@") { return }
                            console.log(property.val[key])
                            const iri = key.split("#").at(-1)
                            let description = "no description available"
                            if (iri_description[":" + iri]) {
                                description = iri_description[":" + iri].Description
                            }
                            let value;
                            if (typeof property.val[key] === "object") {
                                value = property.val[key]["@value"]
                            } else if (typeof property.val[key] === "string") {
                                value = property.val[key]
                            }
                            const line = {
                                label: iri,
                                description: description,
                                value: value,
                                indentation: 1,
                                isImage: false,
                                isURL: false,
                                isEditable: true
                            };
                            data.push(line);
                        })
                    }


                } else if (Object.keys(property.val).includes("@id") && isValidHttpUrl(property.val["@id"])) {
                    // is external object DONE
                    links = links.concat([{ loType: property.Label, loLocation: property.val["@id"], displayBelow: true }])
                } else {
                    console.log("Object else")
                }
            } else if (Array.isArray(property.val)) {
                // is list
                if (Object.keys(property.val[0]).includes("@id") && Object.keys(property.val[0]).includes("@type")) {
                    property.val.map((_, list_index) => {
                        const line = {
                            label: (property.Label + " [" + (list_index + 1).toString() + "]"),
                            description: property.Description,
                            value: "",
                            indentation: 0,
                            isImage: false,
                            isURL: false,
                            isEditable: false
                        };
                        data.push(line);


                        Object.keys(property.val[list_index]).map((key, obj_index) => {
                            console.log(property.val[list_index])
                            console.log("Key:", key)
                            // console.log("Key:", key)
                            if (key[0] == "@" && key != "@type") { return }
                            if (key == "@type") { return }

                            const iri = key.split("#").at(-1)
                            let description = "no description available"
                            if (iri_description[":" + iri]) {
                                description = iri_description[":" + iri].Description
                            }
                            let value;
                            if (typeof property.val[list_index][key] === "object") {
                                // if has @id and is valid url add link
                                if (Object.keys(property.val[list_index][key]).includes("@id") && isValidHttpUrl(property.val[list_index][key]["@id"]) && key.split("#").at(-1) == "involvedParties") {
                                    // if (Object.keys(property.val[list_index][key]).includes("@id") && isValidHttpUrl(property.val[list_index][key]["@id"])) {
                                    console.log("WE ARE HERE:", list_index, key)
                                    const linked_obj = property.val[list_index][key]["@id"]
                                    const name = property.val[list_index]["https://onerecord.iata.org/ns/cargo#role"]
                                    links = links.concat([{ loType: name, loLocation: property.val[list_index][key]["@id"], displayBelow: false }])
                                    const line = {
                                        label: name,
                                        description: "List of external linked Objects",
                                        value: linked_obj,
                                        indentation: 1,
                                        isImage: false,
                                        isURL: false,
                                        isEditable: false,
                                        isExtObj: true
                                    };
                                    data.push(line)
                                } else if (Object.keys(property.val[list_index][key]).includes("@id") && isValidHttpUrl(property.val[list_index][key]["@id"])) {
                                    const linked_obj = property.val[list_index][key]["@id"]
                                    const name = key.split("#").at(-1)
                                    links = links.concat([{ loType: name, loLocation: property.val[list_index][key]["@id"], displayBelow: false }])
                                    const line = {
                                        label: name,
                                        description: "List of external linked Objects",
                                        value: linked_obj,
                                        indentation: 1,
                                        isImage: false,
                                        isURL: false,
                                        isEditable: false,
                                        isExtObj: true
                                    };
                                    data.push(line)


                                } else if (Object.keys(property.val[list_index][key]).includes("@value")) {
                                    // if has value display value
                                    value = property.val[list_index][key]["@value"]
                                    const line = {
                                        label: iri,
                                        description: description,
                                        value: value,
                                        indentation: 1,
                                        isImage: false,
                                        isURL: false,
                                        isEditable: true
                                    };
                                    data.push(line);
                                }
                            } else if (typeof property.val[list_index][key] === "string") {
                                value = property.val[list_index][key]
                            }
                        })
                        console.log(property.val)
                    })

                    property.val.map(() => {

                    })
                    // console.log("EMBEDDED OBJECT LIST")
                } else if (Object.keys(property.val[0]).includes("@id") && isValidHttpUrl(property.val[0]["@id"])) {
                    // is list of external object
                    property.val.map((_, index) => {
                        links = links.concat([{ loType: property.Label, loLocation: property.val[index]["@id"], displayBelow: true }])
                    })
                }
            } else if (isValidHttpUrl(property.val)) {
                // is external URL
                const line = {
                    label: property.Label,
                    description: property.Description,
                    value: property.val,
                    indentation: 0,
                    isImage: false,
                    isURL: true,
                    isEditable: false
                };
                data.push(line);
                console.log("external Link")
            } else if ((typeof property.val) === "string") {
                const line = {
                    label: property.Label,
                    description: property.Description,
                    value: property.val,
                    indentation: 0,
                    isImage: false,
                    isURL: false,
                    isEditable: true
                };
                data.push(line);


            } else {
                throw Error("Unknown ONE-RECORD Data")
            }

            // manage links
            if (index + 1 == enrichedData.length) {
                setLinks(links)
            }
            // is link
            // is text
            // console.log("Links:", links)
        })
        if (links.length) {
            const line = {
                label: "Linked Objects",
                description: "List of external linked Objects",
                value: "",
                indentation: 0,
                isImage: false,
                isURL: false,
                isEditable: false
            };
            data.push(line)
            links.map(({ loType, loLocation, displayBelow }) => {
                if (displayBelow) {
                    const line = {
                        label: loType,
                        description: "List of external linked Objects",
                        value: loLocation,
                        indentation: 1,
                        isImage: false,
                        isURL: false,
                        isEditable: false,
                        isExtObj: true
                    };
                    data.push(line)
                }

            })
        }

        setData(data)
        setChangeList([...Array(data.length).fill(0).map(x => ({}))])
        // create Data and Links here

    }, [enrichedData])


    // TODO Lift Data Handling to List Level

    return (
        <>
            {/* <div className={`ml-4 overflow-y-scroll  ${expansionState == 1 ? "" : "h-[128px]"} ${expansionState == 2 ? "" : "h-[78px]"} `} > */}
            <div className={`ml-4 overflow-y-scroll
            ${expansionState == 1 && "max-h-[200px]"} 
            ${expansionState == 2 && "max-h-[300px]"} `}
            >
                {data && data.map((data, index) => {
                    return (
                        <div key={index} className="block w-[319px] overflow-hidden">
                            <PropLine
                                index={index}
                                id={id}
                                data={data}
                                inEdit={inEdit}
                                changeList={changeList}
                                setChangeList={setChangeList}
                            />
                        </div>
                    )
                })}
            </div>
        </>
    )
}

export default PropList;