"use client";
import Header from "@/components/Header/Header";
import useInternalStore from "@/store";
import { shallow } from "zustand/shallow";
import { useEffect, useState } from "react";
import Canvas from "@/components/Canvas/Canvas";
import { ReactFlowProvider } from "reactflow";


export default function Home() {
  const [darkMode] = useInternalStore(state => [state.darkMode], shallow)
  const { addNodeFlag } = useInternalStore()
  const [rfInstance, setRfInstance] = useState(null);


  useEffect(() => {
    const style = document.styleSheets[1]
    if (addNodeFlag) {
      style.insertRule(".react-flow .react-flow__pane {cursor: url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'  width='26' height='22' viewport='0 0 26 22' style='fill:rgb(248, 250, 252);stroke-width:1;stroke:rgb(32, 33, 49)'><rect x='1' y='1' width='24' height='20' rx='4' /></svg>\") 16 0,auto;}")
    } else {
      style.deleteRule(0)
    }
  }, [addNodeFlag])


  useEffect(() => {
    if (darkMode) {
      document.querySelector("body").classList.add("dark");
    } else {
      document.querySelector("body").classList.remove("dark");
    }
  }, [darkMode]);



  return (
    <div className={`flex`}>
      <ReactFlowProvider>
        <Canvas setRfInstance={setRfInstance}/>
      </ReactFlowProvider>
      <Header reactFlow={rfInstance}/>
    </div >
  )
}
