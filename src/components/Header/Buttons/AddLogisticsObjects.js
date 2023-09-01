import { useEffect, useState } from "react";
import Select from 'react-select';
import iri_description from '@/ontology/iri-description';
import useInternalStore from '@/store';

const AddLogisticsObjects = () => {
    const [showPopup, setShowPopup] = useState(false)

    const [LOType, setLOType] = useState("");
    const [server, setServer] = useState("");
    const [createdLO, setCreatedLO] = useState("")
    const { servers } = useInternalStore()

    const LOOptions = Object.values(iri_description).filter((item) => item.Type == 'Class').map((item) => { return { label: item.Label, value: item.Label } })
    const serverOptions = servers.map((item) => { return { label: item.org_name, value: item.host} })


    useEffect(() => {
        console.log(servers)
        setLOType("")
        setServer("")
        setCreatedLO("")
    }, [showPopup])

    const createLO = async () => {
        console.log(server)
        let body_obj = {
            "@context": {
                "cargo": "https://onerecord.iata.org/ns/cargo#",
            },
            "@type": "cargo:" + LOType.value
        }
        let prom = fetch('http://'+server.value+"/logistics-objects", {
            method: "POST",
            headers: {
                "Content-Type": "application/ld+json",
                "Accept": "application/ld+json"
            },
            body: JSON.stringify(body_obj)
        })
        let res = await prom;
        if (res.status == 201) {
            //pass created lo
            let header_obj = {};
            res.headers.forEach((val, key) => { header_obj[key] = val })
            setCreatedLO(header_obj['location'])
        }

    }

    return (
        <>
            <div className='has-tooltip '>
                <span className='tooltip rounded shadow-lg p-1 bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-200 mt-12 -ml-10  duration-200 transition-colors' >Add Logistics Object</span>
                <button onClick={() => { setShowPopup(!showPopup) }}
                    className="p-2 bg-violet-400 hover:bg-violet-600 active:bg-violet-800 dark:bg-violet-500 dark:hover:bg-violet-600 dark:active:bg-violet-800 rounded-full mx-1 my-auto text-white  duration-200 transition-all">
                    <svg className="fill-white" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="24"><path d="M452.116-216.462v-235.962H216.154v-55.96h235.962v-235.962h55.96v235.962h235.962v55.96H508.076v235.962h-55.96Z" /></svg>
                </button>
            </div>
            {showPopup &&
                <div className="z-20 absolute w-[60%] h-[60%] top-[10%] left-[20%] ">
                    <div className="block bg-slate-100 m-2 p-4 w-full h-full rounded-3xl  overflow-y-scroll no-scrollbar">
                        <button onClick={() => { setShowPopup(!showPopup) }} className="block ml-auto p-2 bg-violet-400 hover:bg-violet-500 active:bg-violet-600 transition-color duration-200 text-white rounded-full">
                            <svg className="fill-white" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="m249-207-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z" /></svg>
                        </button>
                        <div className="block bg-slate-200 p-2  m-2 ml-0 w-full rounded-3xl ">
                            <span className="text-xl font-medium pl-1">Create Logistics Object</span>
                            <div className="rounded-b-xl bg-slate-300 p-2">
                                <div className="py-2 grid grid-cols-2 gap-2">
                                    <span>Logistic Object Type</span>
                                    <Select options={LOOptions}
                                        isClearable={true}
                                        isSearchable={true}
                                        onChange={(item) => { if (item != null) { setLOType(item) } }}
                                    />
                                    <span>Servers</span>
                                    <Select options={serverOptions}
                                        isClearable={true}
                                        isSearchable={true}
                                        onChange={(item) => { if (item != null) { setServer(item) } }}
                                    />
                                </div>
                                <button className=" bg-violet-300 text-white font-light p-1 rounded-full w-full hover:bg-violet-400 active:bg-violet-500 transition-color duration-200"
                                    onClick={createLO}>
                                    <svg className="fill-white mx-auto" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M440-200v-240H200v-80h240v-240h80v240h240v80H520v240h-80Z" /></svg>
                                </button>
                            </div>
                        </div>
                        {createdLO != '' &&
                            <>
                                <span>Created LO</span>
                                <div><span>{createdLO}</span></div>
                            </>
                        }
                    </div>
                </div>

            }
        </>
    )

}

export default AddLogisticsObjects;