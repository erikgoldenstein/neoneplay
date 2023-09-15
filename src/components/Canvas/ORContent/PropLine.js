import { useHover, useFloating, useInteractions, useTransitionStyles } from '@floating-ui/react';
import { useEffect, useState } from 'react';
import { useStore, useReactFlow, MarkerType } from 'reactflow';
import { operation } from '@/helpers/Enums';
import Select from 'react-select';
import iri_description from '@/ontology/iri-description';


const PropLine = ({ index, id, data, inEdit, changeMap, setChangeMap, addProperty, order, resetIndexOnLabel, deleteLine }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [render, setRender] = useState(false);
    const [changedValue, setChangedValue] = useState(data.value);
    const RFI = useReactFlow();

    const position = useStore(s => s.nodeInternals.get(id)?.position);
    const [deleteElement, setDeleteElement] = useState(false);


    const options = Object.values(iri_description).filter((item) => item.Type != 'Class' && item.Type != 'EmbeddedObject').map((item) => { return { label: item.Label, value: item.Label } })

    useEffect(() => {
        if (!inEdit) {
            if (data.value != changedValue) {
                setChangedValue(data.value);
            }
            setDeleteElement(false)
        }
    }, [inEdit])

    const changeMapUpdate = (value) => {
        setChangedValue(value)
        if( data.isAddedLine) {
            data.value = value
        }
        if (inEdit) {
            const updateChangeMap = { ...changeMap };
            if (data.value != value || data.isAddedLine) {
                const diff = {
                    op: (data.isAddedLine ? operation.Add : operation.Change),
                    label: data.label,
                    oldValue: (data.isAddedLine ? '' : data.value),
                    newValue: value,
                    parent: data.parent,
                    type: data.type
                }
                updateChangeMap[data.parent + '_' + data.label + '_' + data.index] = diff
            } else {
                delete updateChangeMap[data.parent + '_' + data.label + '_' + data.index]
            }
            setChangeMap(updateChangeMap)
        }

    }
    const setNewlineLabel = () => {
        let obj = iri_description[':' + data.label]
        if (obj != null) {
            data.type = obj.TypeIRI
            data.description = obj.Description
            data.index = 0
            let childNode = iri_description[':' + obj.TypeIRI.split('#').pop()]
            resetIndexOnLabel(data)
            if (childNode && childNode.Type == "EmbeddedObject") {
                //Create a label for the new embedded node
                changeMapUpdate("_:b" + Math.floor(Math.random() * 30000))
            } else {
                setRender(!render)
            }
        }
    }

    const deleteLineAndChange = () => {
        const updateChangeMap = { ...changeMap };
        delete updateChangeMap[data.parent + '_' + data.label + '_' + data.index]
        setChangeMap(updateChangeMap)
        deleteLine(data)
    }

    const deleteValue = () => {
        if (!deleteElement) {
            const diff = {
                op: operation.Delete,
                label: data.label,
                oldValue: data.value,
                newValue: "",
                parent: data.parent,
                type: data.type
            }
            const updateChangeMap = { ...changeMap };
            updateChangeMap[data.parent + '_' + data.label + '_' + data.index] = diff
            setChangeMap(updateChangeMap)
        } else {
            const updateChangeMap = { ...changeMap };
            delete updateChangeMap[data.parent + '_' + data.label + '_' + data.index]
            setChangeMap(updateChangeMap)
        }
        setDeleteElement(!deleteElement)
    }

    const { refs, floatingStyles, context } = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
    });

    const selectStyles = {
        option: (base) => ({
            ...base,
            fontSize: '11px',
            fontWeight: 'bold',
            borderRadius: '8px'
        }),
        control: (base) => ({
            ...base,
            width: '100%',
            fontSize: '11px',
            fontWeight: 'bold',
            borderRadius: '8px'
        }),
        container: (base) => ({
            ...base,
            width: "100%"
        }),
    }

    const hover = useHover(context, {
        delay: {
            open: 1000,
            close: 0
        }
    });

    const { getReferenceProps, getFloatingProps } = useInteractions([
        hover,
    ]);

    return (data &&
        <div className="w-full">
            <div className="flex w-full">
                {data.label != '' && <span
                    ref={refs.setReference} {...getReferenceProps()}
                    className={`${data.isAddedLine ? "text-lime-400" : ""} inline-flex text-xs overflow-x-hidden break-all font-bold mr-auto w-[47%] my-1 ${" " * 4 * data.indentation}`}>
                    {data.indentation ?
                        ("-".repeat(2 * data.indentation) + (data.indentation && "> ")) : ""}{data.label}{((data.index > 0) ? ' [' + data.index + ']' : '')}:
                </span>
                }
                {data.description != '' && isOpen && (
                    <div
                        ref={refs.setFloating}
                        style={{ ...floatingStyles, fontSize: "0.67rem", lineHeight: "0.9rem" }}
                        {...getFloatingProps()}
                        className=' bg-slate-200 drop-shadow-lg p-2 rounded-lg z-10 w-[200px] backdrop-blur'
                    >
                        {data.description}
                    </div>
                )}

                {(!inEdit || !data.isEditable) &&
                    <>
                        {(!data.isURL && !data.isExtObj && !data.isEmbeddedObj) &&
                            <span className="block w-[167px] m-1 align-bottom text-xs text-left  overflow-hidden" >
                                {data.value}
                            </span>
                        }
                        {(data.isURL && !data.isExtObj) &&
                            <span className="block w-[167px] m-1 align-bottom text-xs text-left overflow-hidden " >
                                <a className='bg-slate-200 p-2 rounded-2xl hover:bg-slate-300 ' target='_blank' href={data.value}>reference</a>
                            </span>
                        }
                        {data.isExtObj &&
                            <span
                                onClick={(e) => {
                                    if (RFI.getNode(data.value) == null) {
                                        RFI.addNodes({
                                            id: data.value,
                                            type: 'LO',
                                            dragHandle: '#node-header',
                                            data: {
                                                uri: data.value,
                                            },
                                            position: { x: position.x + 400, y: position.y },
                                        },)
                                    }
                                    if (RFI.getEdge(id + "->" + data.value) == null) {
                                        RFI.addEdges({
                                            id: (id + "->" + data.value),
                                            target: data.value,
                                            source: id,
                                            type: 'floating',
                                            markerEnd: {
                                                type: MarkerType.Arrow,
                                            },
                                        });

                                    }
                                }}

                                className="block w-[167px] m-1 align-bottom text-xs text-left overflow-hidden " >
                                <span className='bg-slate-200 p-2 rounded-2xl hover:bg-slate-300 '>open</span>
                            </span>

                        }
                    </>
                }

                {(inEdit != 0 && data.isEditable && !data.isAddedLine) &&
                    // Editing Stage
                    <>
                        <input className='w-[42%] mx-auto  text-xs border-b-[1px] border-slate-400 rounded-md p-[2px] active:outline-none focus:outline-none'
                            defaultValue={changedValue} onBlur={e => changeMapUpdate(e.target.value)}
                            type='text' name='' id='' />
                    </>
                }
                {(inEdit != 0 && data.isEmbeddedObj && !data.isAddedLine) &&
                    <button onClick={() => addProperty(data.value, data.indentation, order)}
                        className='p-[3px] mt-0.5 border-[1px] border-slate-400 rounded-lg mr-1'>
                        <svg xmlns="http://www.w3.org/2000/svg" height="14" viewBox="0 -960 960 960" width="14"><path d="M452.116-216.462v-235.962H216.154v-55.96h235.962v-235.962h55.96v235.962h235.962v55.96H508.076v235.962h-55.96Z" /></svg>
                    </button>
                }
                {(inEdit != 0 && data.isDeletable && !data.isAddedLine) &&
                    <>
                        <button onClick={deleteValue}
                            className='p-[3px] mt-0.5 border-[1px] border-red-300 rounded-lg mr-0'>
                            {!deleteElement &&
                                <svg className="fill-red-600" xmlns="http://www.w3.org/2000/svg" height="14" viewBox="0 -960 960 960" width="14"><path d="M326.732-172.078q-24.957 0-42.613-17.656t-17.656-42.613v-461.23h-47.192v-47.896h166.344v-41.833h189.577v41.769h166.345v47.96h-47.192v460.885q0 25.782-17.566 43.198t-42.703 17.416H326.732Zm319.653-521.499H314.423v461.23q0 5.385 3.462 8.847 3.462 3.462 8.847 3.462h307.344q4.616 0 8.462-3.847 3.847-3.846 3.847-8.462v-461.23ZM404.193-290.923h47.961v-331.962h-47.961v331.962Zm104.461 0h47.96v-331.962h-47.96v331.962ZM314.423-693.577v473.539V-693.577Z" /></svg>
                            }
                            {deleteElement &&
                                <svg className="fill-red-600 rotate-45" xmlns="http://www.w3.org/2000/svg" height="14" viewBox="0 -960 960 960" width="14"><path d="M452.116-216.462v-235.962H216.154v-55.96h235.962v-235.962h55.96v235.962h235.962v55.96H508.076v235.962h-55.96Z" /></svg>
                            }
                        </button>
                    </>
                }

                {(inEdit != 0 && data.isAddedLine && data.label == '') &&
                    <div className='nodrag text-sm mt-1 mb-1 flex grow'>
                        <div className='flex grow'>
                            <Select options={options}
                                isClearable={true}
                                isSearchable={true}
                                onChange={(item) => { if (item != null) { data.label = item.label; setNewlineLabel() } }}
                                styles={selectStyles} />
                        </div>
                    </div>
                }

                {(inEdit != 0 && data.isAddedLine && data.label != '') &&
                    <>
                        {(iri_description[':' + data.label].Type == "DataProperty" || iri_description[':' + data.type.split('#').pop()].Type != "EmbeddedObject") &&
                            <input className='w-[42%] mx-auto  text-xs border-b-[1px] border-slate-400 rounded-md p-[2px] active:outline-none focus:outline-none'
                                defaultValue={changedValue} onBlur={e => changeMapUpdate(e.target.value)}
                                type='text' name='' id='' />
                        }
                        {(iri_description[':' + data.type.split('#').pop()] && iri_description[':' + data.type.split('#').pop()].Type == "EmbeddedObject") &&
                            <span className='w-[42%] mx-auto  text-xs mt-1'>Create Object</span>
                        }
                        <button onClick={deleteLineAndChange}
                            className='p-[3px] mt-0.5 border-[1px] border-red-300 rounded-lg mr-0'>
                            <svg className="fill-red-600" xmlns="http://www.w3.org/2000/svg" height="14" viewBox="0 -960 960 960" width="14"><path d="M326.732-172.078q-24.957 0-42.613-17.656t-17.656-42.613v-461.23h-47.192v-47.896h166.344v-41.833h189.577v41.769h166.345v47.96h-47.192v460.885q0 25.782-17.566 43.198t-42.703 17.416H326.732Zm319.653-521.499H314.423v461.23q0 5.385 3.462 8.847 3.462 3.462 8.847 3.462h307.344q4.616 0 8.462-3.847 3.847-3.846 3.847-8.462v-461.23ZM404.193-290.923h47.961v-331.962h-47.961v331.962Zm104.461 0h47.96v-331.962h-47.96v331.962ZM314.423-693.577v473.539V-693.577Z" /></svg>
                        </button>
                    </>
                }
            </div >
        </div >
    )
}
export default PropLine;