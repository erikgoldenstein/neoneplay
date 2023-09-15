import { useEffect, useState } from "react";
;

function EventPanel ({selectedObject}){
    const [showEventPanel, setShowEventPanel] = useState(false)

    useEffect(() => {
        if (selectedObject && selectedObject != ''){
            setShowEventPanel(true);
        }

    }, [selectedObject])

    return (
        <>
            {showEventPanel &&
                <div className="z-20 absolute w-[60%] h-[60%] top-[10%] left-[20%] ">
                    <div className="block bg-slate-100 m-2 p-4 w-full h-full rounded-3xl  overflow-y-scroll no-scrollbar">
                        <button onClick={() => { setShowEventPanel(!showEventPanel) }} className="block ml-auto p-2 bg-violet-400 hover:bg-violet-500 active:bg-violet-600 transition-color duration-200 text-white rounded-full">
                            <svg className="fill-white" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="m249-207-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z" /></svg>
                        </button>
                        <div className="block bg-slate-200 p-2  m-2 ml-0 w-full rounded-3xl ">
                            <span className="text-xl font-medium pl-1">Create Logistics Events</span>
                            <div className="rounded-b-xl bg-slate-300 p-2">
                                <div className="py-2 grid grid-cols-2 gap-2">
                                    <span>Logistic Object Type</span>
                                </div>
                                <button className=" bg-violet-300 text-white font-light p-1 rounded-full w-full hover:bg-violet-400 active:bg-violet-500 transition-color duration-200"
                                >
                                    <svg className="fill-white mx-auto" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M440-200v-240H200v-80h240v-240h80v240h240v80H520v240h-80Z" /></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    );

}

export default EventPanel;