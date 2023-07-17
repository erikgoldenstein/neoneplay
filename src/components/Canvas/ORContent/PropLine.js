import { useHover, useFloating, useInteractions, useTransitionStyles } from '@floating-ui/react';
import { useEffect, useState } from 'react';
import { useStore, useReactFlow, MarkerType } from 'reactflow';
import { operation } from '@/helpers/Enums';


const PropLine = ({ index, id, data, inEdit, changeList, setChangeList }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [changedValue, setChangedValue] = useState(data.value);
    const RFI = useReactFlow();

    const position = useStore(s => s.nodeInternals.get(id)?.position);



    // TODO
    // add cahnges to "changeList" when inEdit switch "back" to false, dont forget deletes
    // remove Push? moving out of edit mode is push basically
    // TODO
    // get idea for global update every 10s
    // get idea for global search

    useEffect(() => {
        let updateChangeList;
        if (inEdit == 2 && changeList.length && data && data.isEditable) { // 2 means changes were confirmed, 1 changes are being made, 0 no changes
            const diff = {
                op: operation.Change,
                label: data.label,
                oldValue: data.value,
                newValue: changedValue
            }
            updateChangeList = JSON.parse(JSON.stringify(changeList));
            updateChangeList[index] = diff
            setChangeList(updateChangeList)
        }
    }, [inEdit])



    const { refs, floatingStyles, context } = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
    });


    const hover = useHover(context, {
        delay: {
            // open: 0,
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
                <span
                    ref={refs.setReference} {...getReferenceProps()}
                    className={`inline-flex text-xs overflow-x-hidden break-all font-bold mr-auto w-[47%] my-1 ${" " * 4 * data.indentation}`}>
                    {data.indentation ?
                        ("-".repeat(2 * data.indentation) + (data.indentation && "> ")) : ""}{data.label}:
                </span>
                {isOpen && (
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
                        {(!data.isURL && !data.isExtObj) &&
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
                                    RFI.addNodes({
                                        id: data.value,
                                        type: 'LO',
                                        dragHandle: '#node-header',
                                        data: {
                                            uri: data.value,
                                        },
                                        position: { x: position.x + 400, y: position.y },
                                        // position: { x: 600, y: 600 },
                                    },)
                                    RFI.addEdges({
                                        id: (id + "->" + data.value),
                                        target: data.value,
                                        source: id,
                                        type: 'floating',
                                        markerEnd: {
                                            type: MarkerType.Arrow,
                                        },
                                    });

                                }}

                                className="block w-[167px] m-1 align-bottom text-xs text-left overflow-hidden " >
                                <span className='bg-slate-200 p-2 rounded-2xl hover:bg-slate-300 '>open</span>
                            </span>

                        }
                    </>
                }

                {(inEdit != 0 && data.isEditable) &&
                    // Editing Stage
                    <>
                        <input className='w-[42%] mx-auto  text-xs border-b-[1px] border-slate-400 rounded-md p-[2px] active:outline-none focus:outline-none'
                            onChange={e => setChangedValue(e.target.value)} value={changedValue}
                            type='text' name='' id='' />
                        <button
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