const wbdat = {
    response: {
        Date: "Thu, 01 Jun 2023 20:17:16",
        "Latest-Revision": 1
    },
    body: {
        "@id": "http://ne-one.de/airline/logistics-objects/ac1e5395-c648-4723-81e5-5456d7b61a18",
        "@type": "https://onerecord.iata.org/ns/cargo#Waybill",
        "https://onerecord.iata.org/ns/cargo#coload": {
            "@type": "http://www.w3.org/2001/XMLSchema#boolean",
            "@value": "false"
        },
        "https://onerecord.iata.org/ns/cargo#goodsDescription": "NE:ONE Merchandise Frisbee",
        "https://onerecord.iata.org/ns/cargo#handlingInstructions": {
            "@id": "neone:79fa4c6e-6fda-45ab-a823-68e1194ff096",
            "@type": "https://onerecord.iata.org/ns/cargo#HandlingInstructions",
            "https://onerecord.iata.org/ns/cargo#serviceDescription": "Valuable Cargo",
            "https://onerecord.iata.org/ns/cargo#serviceTypeCode": "VAL"
        }
    }
}

export default wbdat;