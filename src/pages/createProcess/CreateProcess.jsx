import { useState, useRef, useEffect } from "react";
import { FaSave } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import { IoIosAdd } from "react-icons/io";
import { v4 as uuidv4 } from "uuid";
import { AiFillCheckCircle, AiFillCloseCircle, AiOutlineDelete } from "react-icons/ai";
import { useWorkflows } from "../../context/WorkflowContext"; // Import the workflow context
import ZoomControl from "../../components/ZoomControl";
import { useNavigate } from "react-router-dom";

export default function CreateProcess() {
    const [zoom, setZoom] = useState(100);
    const [showNodeModal, setShowNodeModal] = useState(false);
    const [showWorkflowModal, setShowWorkflowModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedNodeType, setSelectedNodeType] = useState(null);
    const [workflowData, setWorkflowData] = useState({ name: "", description: "", status: "pass" });
    const [tempWorkflow, setTempWorkflow] = useState(null);
    const nodeButtonRef = useRef(null);
    const nodeModalRef = useRef(null);

    const { workflows, addWorkflow, removeWorkflow, setWorkflows, isCreatingNew, setIsCreatingNew, currentWorkflow, setCurrentWorkflow, currentWorkflowId, setCurrentWorkflowId } = useWorkflows();


    console.log("Processed Workflows:", JSON.stringify(workflows, null, 2));

    console.log(currentWorkflow,'currentWorkflow')
    useEffect(() => {
        if (isCreatingNew) {
            const newWorkflow = { id: uuidv4(), nodes: [] };
            setCurrentWorkflow(newWorkflow);
        }
    }, [isCreatingNew]);
    
    useEffect(() => {
        const storedWorkflows = JSON.parse(localStorage.getItem("workflows")) || [];
        setWorkflows(storedWorkflows);
    
        if (storedWorkflows.length > 0) {
            const lastWorkflow = storedWorkflows[storedWorkflows.length - 1];
            setCurrentWorkflow(lastWorkflow);
            setCurrentWorkflowId(lastWorkflow.id); // ✅ Store ID
        } else {
            const newWorkflow = { id: uuidv4(), nodes: [] };
            setCurrentWorkflow(newWorkflow);
            setCurrentWorkflowId(newWorkflow.id);
        }
    }, []);
    
    
    
    
    // useEffect(() => {
    //     if (currentWorkflow) {
    //         console.log("Current Workflow:", currentWorkflow);
    //     }
    // }, [currentWorkflow]);
    const handleCreateWorkflow = (workflowData) => {
        addWorkflow(workflowData);
        setCurrentWorkflow(workflowData);
    };
    // Close node modal when clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (nodeModalRef.current && !nodeModalRef.current.contains(event.target) && !nodeButtonRef.current.contains(event.target)) {
                setShowNodeModal(false);
            }
        };

        // Add event listener
        document.addEventListener("mousedown", handleClickOutside);

        // Cleanup event listener on component unmount
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const navigate = useNavigate();
   
   

    const handleGoBack = () => {
        setIsCreatingNew(false);  // Reset flag when going back
        navigate("/dashboard");
    };

    // const handleCreateProcess = () => {
    //     setIsCreatingNew(true);
    //     setCurrentWorkflow({ id: uuidv4(), nodes: [] });
    // };
    // Step 1: Open node selection modal and store the selected node type
    const openNodeSelectionModal = () => {
        setSelectedNodeType(null);
        setWorkflowData({ name: "", description: "", status: "pass" });
        setShowNodeModal(true);
    };

    const handleNodeSelection = (nodeType) => {
        setSelectedNodeType(nodeType); // Store the selected node type
        setShowNodeModal(false); // Close the node selection modal
        setShowWorkflowModal(true); // Open the second modal to enter name and description
    };

    // Step 2: Handle saving workflow data (name and description) but do not display yet
    const handleSaveWorkflow = () => {
        setTempWorkflow({
            type: selectedNodeType,
            status: "pass",
            time: new Date().toISOString(),
        });
        setShowWorkflowModal(false);
        setShowConfirmModal(true);
    };

    // Step 3: Handle confirmation and display the saved data on the UI

    const handleConfirmSave = (confirm) => {
        if (!tempWorkflow) return;
    
        const newNode = {
            ...tempWorkflow,
            id: uuidv4(),
            status: confirm ? "pass" : "fail",
            name: workflowData.name,
            description: workflowData.description,
        };
    
        setCurrentWorkflow((prevWorkflow) => {
            if (!prevWorkflow) return { id: uuidv4(), nodes: [newNode] };
    
            const updatedWorkflow = { ...prevWorkflow, nodes: [...prevWorkflow.nodes, newNode] };
    
            // Update local storage
            let storedWorkflows = JSON.parse(localStorage.getItem("workflows")) || [];
            
            let index = storedWorkflows.findIndex(wf => wf.id === updatedWorkflow.id);
            if (index !== -1) {
                storedWorkflows[index] = updatedWorkflow; // Update existing
            } else {
                storedWorkflows.push(updatedWorkflow); // Add new
            }
    
            localStorage.setItem("workflows", JSON.stringify(storedWorkflows));
            setWorkflows(storedWorkflows);
    
            return updatedWorkflow;
        });
    
        setShowConfirmModal(false);
        setTempWorkflow(null);
        setWorkflowData({ name: "", description: "", status: "pass" });
    };
    
    
    const [visibleNodes, setVisibleNodes] = useState({});

    useEffect(() => {
        const timers = {};
        currentWorkflow?.nodes?.forEach((workflow) => {
            timers[workflow.id] = setTimeout(() => {
                setVisibleNodes((prev) => ({ ...prev, [workflow.id]: true }));
            }, 3000);
        });
    
        return () => {
            Object.values(timers).forEach(clearTimeout);
        };
    }, [currentWorkflow?.nodes]);


    return (
        <div className="h-screen bg-[#f9f3e8] relative p-4">
            {/* Top Bar */}
            <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-lg shadow-md w-fit">

                <button onClick={handleGoBack} className="flex items-center gap-1 text-black font-medium">
                    <IoArrowBack /> Go Back
                </button>

                <span className="font-medium">Untitled</span>
                <button className="text-yellow-500 text-lg">
                    <FaSave />
                </button>
            </div>

            {/* Workflow Canvas */}
            <div className="flex items-center justify-center h-full relative">
                <div
                    className="relative flex flex-col items-center gap-4"
                    style={{ transform: `scale(${zoom / 100})`, transition: "transform 0.3s ease-in-out" }}
                >
                    {/* Start Node */}
                    <div className="relative">
                        <div className="w-24 h-24 bg-green-700 rounded-full flex items-center justify-center border-4 border-green-900">
                            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                                Start
                            </div>
                        </div>
                    </div>

                    {/* Add Node Button */}
                    <button
                        ref={nodeButtonRef}
                        className="w-12 h-12 bg-white border border-black flex items-center justify-center rounded-full"
                        onClick={openNodeSelectionModal}
                    >
                        <IoIosAdd />
                    </button>

                    {/* Display selected workflows only when confirmed */}

                    {/* {currentWorkflow?.nodes?.map((workflow) => (
                        <div key={workflow.id} className="w-72 h-24 bg-white border border-green-700 shadow-md rounded-2xl flex items-center justify-between p-3">
                            <div className="text-lg font-semibold text-gray-800">{workflow.type}</div>
                            <AiOutlineDelete className="text-gray-500 text-2xl cursor-pointer hover:text-red-500" onClick={() => removeWorkflow(workflow.id)} />
                        </div>
                    ))} */}

{currentWorkflow?.nodes?.map((workflow) => (
    <div key={workflow.id} className="w-72 h-24 bg-white border border-green-700 shadow-md rounded-2xl flex items-center justify-between p-3">
        <div className="text-lg font-semibold text-gray-800">{workflow.type}</div>
        {visibleNodes[workflow.id] ? (
            <AiOutlineDelete
                className="text-gray-500 text-2xl cursor-pointer hover:text-red-500"
                onClick={() => removeWorkflow(workflow.id)}
            />
        ) : (
            workflow.status === "pass" ? (
                <AiFillCheckCircle className="text-green-500 text-2xl" />
            ) : (
                <AiFillCloseCircle className="text-red-500 text-2xl" />
            )
        )}
    </div>
))}



                    {/* End Node */}
                    <div className="relative">
                        <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center border-4 border-red-800">
                            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white font-semibold">
                                End
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Node Selection Modal */}
            {showNodeModal && (
                <div
                    ref={nodeModalRef}
                    className="absolute bg-white p-6 shadow-xl rounded-2xl w-56 transform -translate-x-1/2 left-3/4 top-50 transition-all duration-300"
                >
                    <h2 className="text-center text-lg font-semibold text-gray-700 mb-4">Select Node Type</h2>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            className="p-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
                            onClick={() => handleNodeSelection("API Call")}
                        >
                            API Call
                        </button>
                        <button
                            className="p-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition"
                            onClick={() => handleNodeSelection("Email")}
                        >
                            Email
                        </button>
                        <button
                            className="p-3 bg-purple-500 text-white rounded-lg shadow-md hover:bg-purple-600 transition col-span-2"
                            onClick={() => handleNodeSelection("Text Box")}
                        >
                            Text Box
                        </button>
                    </div>
                </div>
            )}


            {/* Workflow Modal */}
            {showWorkflowModal && (
                <div
                    ref={nodeModalRef}
                    className="absolute bg-white p-6 shadow-2xl rounded-2xl w-96 border border-gray-300"
                    style={{ top: "100px", left: "80%", transform: "translateX(-50%)" }}
                >
                    <h2 className="text-xl font-bold bg-gradient-to-r from-green-500 to-green-700 text-white py-2 px-4 rounded-t-xl text-center">
                        Save Your Workflow
                    </h2>
                    <div className="p-4">
                        <label className="block text-gray-700 font-semibold mt-2">Name</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                            placeholder="Enter workflow name"
                            value={workflowData.name}
                            onChange={(e) => setWorkflowData({ ...workflowData, name: e.target.value })}
                        />
                        <label className="block text-gray-700 font-semibold mt-2">Description</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                            placeholder="Enter description"
                            value={workflowData.description}
                            onChange={(e) => setWorkflowData({ ...workflowData, description: e.target.value })}
                        />
                        <div className="flex justify-between mt-6">
                            <button
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-all"
                                onClick={() => setShowWorkflowModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
                                onClick={handleSaveWorkflow}
                            >
                                Save Workflow
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* Confirm Modal */}
            {showConfirmModal && (
                <div
                    className="absolute bg-white p-6 shadow-2xl rounded-2xl w-80 border border-gray-300"
                    style={{ top: "250px", left: "80%", transform: "translateX(-50%)" }}
                >
                    <h2 className="text-xl font-bold text-center text-gray-800">Confirm Save</h2>
                    <p className="text-gray-700 text-center mt-2 font-semibold">
                        Are you sure you want to save?
                    </p>
                    <div className="flex justify-center gap-4 mt-6">
                        <button
                            className="px-5 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-all"
                            onClick={() => handleConfirmSave(false)}
                        >
                            No
                        </button>
                        <button
                            className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
                            onClick={() => handleConfirmSave(true)}
                        >
                            Yes
                        </button>
                    </div>
                </div>
            )}
            <ZoomControl zoom={zoom} setZoom={setZoom} />
        </div>
    );
}