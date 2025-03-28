import { useState, useRef, useEffect } from "react";
import { FaSave } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import { IoIosAdd } from "react-icons/io";
import { v4 as uuidv4 } from "uuid";
import { AiFillCheckCircle, AiFillCloseCircle, AiOutlineDelete } from "react-icons/ai";
import { useWorkflows } from "../../context/WorkflowContext"; // Import the workflow context
import { useNavigate, useParams } from "react-router-dom";

export default function EditProcess() {
    const [zoom, setZoom] = useState(100);
    const [showNodeModal, setShowNodeModal] = useState(false);
    const [showWorkflowModal, setShowWorkflowModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedNodeType, setSelectedNodeType] = useState(null);
    const [workflowData, setWorkflowData] = useState({ name: "", description: "", status: "pass" });
    const [tempWorkflow, setTempWorkflow] = useState(null);
    const [currentWorkflow, setCurrentWorkflow] = useState(null);
    const [workflowId, setWorkflowId] = useState(null);
    const [editNode, setEditNode] = useState(null);  // To store the node being edited

    const nodeButtonRef = useRef(null);
    const nodeModalRef = useRef(null);
    const navigate = useNavigate();
    const { id } = useParams(); // Extract workflow id from URL

    const { workflows, setWorkflows } = useWorkflows();

    // Load workflow data from local storage based on `id` passed in the URL
    useEffect(() => {
        const storedWorkflows = JSON.parse(localStorage.getItem("workflows")) || [];
        setWorkflows(storedWorkflows);
        const foundWorkflow = storedWorkflows.find((workflow) => workflow.id === id);

        if (foundWorkflow) {
            setCurrentWorkflow(foundWorkflow);
            setWorkflowId(id);
        } else {
            // Navigate back if workflow is not found
            navigate("/dashboard");
        }
    }, [id, navigate, setWorkflows]);

    // Handle node modal
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (nodeModalRef.current && !nodeModalRef.current.contains(event.target) && !nodeButtonRef.current.contains(event.target)) {
                setShowNodeModal(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Open node selection modal
    const openNodeSelectionModal = () => {
        setSelectedNodeType(null);
        setWorkflowData({ name: "", description: "", status: "pass" });
        setShowNodeModal(true);
    };

    // Handle node selection (for creating new node)
    const handleNodeSelection = (nodeType) => {
        setSelectedNodeType(nodeType);
        setShowNodeModal(false);
        setShowWorkflowModal(true);
    };

    // Handle editing an existing node
    const handleEditNode = (node) => {
        setEditNode(node);  // Store the node to be edited
        setWorkflowData({
            name: node.name,
            description: node.description,
            status: node.status,
        });
        setSelectedNodeType(node.type);  // Set selected node type from the existing node
        setShowNodeModal(true); // Open modal to edit the node
    };

    // Save or update workflow data and show confirmation modal
    // Save or update workflow data and show confirmation modal
    const handleSaveWorkflow = () => {
        const newNode = {
            id: editNode ? editNode.id : uuidv4(),  // Use existing ID if editing, else generate new ID
            type: selectedNodeType,
            status: "pass",
            name: workflowData.name,
            description: workflowData.description,
            time: new Date().toISOString(),
        };

        if (editNode) {
            // Update existing node
            setCurrentWorkflow((prevWorkflow) => {
                const updatedNodes = prevWorkflow.nodes.map((node) =>
                    node.id === editNode.id ? newNode : node
                );

                const updatedWorkflow = { ...prevWorkflow, nodes: updatedNodes };

                // Update local storage
                let storedWorkflows = JSON.parse(localStorage.getItem("workflows")) || [];
                const index = storedWorkflows.findIndex((wf) => wf.id === updatedWorkflow.id);
                if (index !== -1) {
                    storedWorkflows[index] = updatedWorkflow;
                } else {
                    storedWorkflows.push(updatedWorkflow);
                }

                localStorage.setItem("workflows", JSON.stringify(storedWorkflows));
                setWorkflows(storedWorkflows);

                return updatedWorkflow;
            });
        } else {
            // Add new node
            setCurrentWorkflow((prevWorkflow) => {
                const updatedWorkflow = {
                    ...prevWorkflow,
                    nodes: [...prevWorkflow.nodes, newNode],
                };

                // Update local storage
                let storedWorkflows = JSON.parse(localStorage.getItem("workflows")) || [];
                const index = storedWorkflows.findIndex((wf) => wf.id === updatedWorkflow.id);
                if (index !== -1) {
                    storedWorkflows[index] = updatedWorkflow;
                } else {
                    storedWorkflows.push(updatedWorkflow);
                }

                localStorage.setItem("workflows", JSON.stringify(storedWorkflows));
                setWorkflows(storedWorkflows);

                return updatedWorkflow;
            });
        }

        // Reset modal states
        setShowWorkflowModal(false);  // Close the modal
        setShowConfirmModal(true);
        setTempWorkflow(null);
        setEditNode(null); // Clear the edit node state
    };


    // Go back to the dashboard
    const handleGoBack = () => {
        navigate("/dashboard");
    };

    // Handle confirmation of saving workflow
    const handleConfirmSave = (confirmed) => {
        setCurrentWorkflow((prevWorkflow) => {
            if (!prevWorkflow) return prevWorkflow; // Prevent errors
    
            const updatedNodes = prevWorkflow.nodes.map((node) =>
                node.id === editNode?.id ? { ...node, status: confirmed ? "pass" : "fail" } : node
            );
    
            const updatedWorkflow = { ...prevWorkflow, nodes: updatedNodes };
    
            // Update local storage
            let storedWorkflows = JSON.parse(localStorage.getItem("workflows")) || [];
            const index = storedWorkflows.findIndex((wf) => wf.id === updatedWorkflow.id);
            if (index !== -1) {
                storedWorkflows[index] = updatedWorkflow;
            }
            localStorage.setItem("workflows", JSON.stringify(storedWorkflows));
    
            return updatedWorkflow;
        });
    
        // Now update workflows in the context (outside the state update)
        setWorkflows((prev) => {
            let updatedWorkflows = prev.map((wf) => 
                wf.id === workflowId ? { ...wf, nodes: wf.nodes.map((node) => 
                    node.id === editNode?.id ? { ...node, status: confirmed ? "pass" : "fail" } : node
                )} : wf
            );
            return updatedWorkflows;
        });
    
        setShowConfirmModal(false); // Close the modal after confirmation
        setEditNode(null); // Reset edit node state
    };
    
    


    return (
        <div className="h-screen bg-[#f9f3e8] relative p-4">
            {/* Top Bar */}
            <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-lg shadow-md w-fit">
                <button onClick={handleGoBack} className="flex items-center gap-1 text-black font-medium">
                    <IoArrowBack /> Go Back
                </button>
                <span className="font-medium">{currentWorkflow?.name || "Untitled"}</span>
                <button className="text-yellow-500 text-lg">
                    <FaSave />
                </button>
            </div>

            {/* Workflow Canvas */}
            <div className="flex items-center justify-center h-full relative">
                <div className="relative flex flex-col items-center gap-4" style={{ transform: `scale(${zoom / 100})`, transition: "transform 0.3s ease-in-out" }}>
                    <div className="relative">
                        <div className="w-24 h-24 bg-green-700 rounded-full flex items-center justify-center border-4 border-green-900">
                            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                                Start
                            </div>
                        </div>
                    </div>

                    {/* Add Node Button */}
                    <button ref={nodeButtonRef} className="w-12 h-12 bg-white border border-black flex items-center justify-center rounded-full" onClick={openNodeSelectionModal}>
                        <IoIosAdd />
                    </button>

                    {/* Render workflow nodes */}
                    {currentWorkflow?.nodes?.map((workflow) => (
                        <div
                            key={workflow.id}
                            className="w-72 h-24 bg-white border border-green-700 shadow-md rounded-2xl flex items-center justify-between p-3 cursor-pointer"
                            onClick={() => handleEditNode(workflow)} // Handle click to edit node
                        >
                            <div className="text-lg font-semibold text-gray-800">{workflow.type}</div>
                            <AiOutlineDelete className="text-gray-500 text-2xl cursor-pointer hover:text-red-500" />
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
                <div ref={nodeModalRef} className="absolute bg-white p-6 shadow-xl rounded-2xl w-56 transform -translate-x-1/2 left-3/4 top-50 transition-all duration-300">
                    <h2 className="text-center text-lg font-semibold text-gray-700 mb-4">Select Node Type</h2>
                    <div className="grid grid-cols-2 gap-3">
                        <button className="p-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition" onClick={() => handleNodeSelection("API Call")}>
                            API Call
                        </button>
                        <button className="p-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition" onClick={() => handleNodeSelection("Email")}>
                            Email
                        </button>
                        <button className="p-3 bg-purple-500 text-white rounded-lg shadow-md hover:bg-purple-600 transition col-span-2" onClick={() => handleNodeSelection("Text Box")}>
                            Text Box
                        </button>
                    </div>
                </div>
            )}

            {/* Workflow Modal */}
            {showWorkflowModal && (
                <div ref={nodeModalRef} className="absolute bg-white p-6 shadow-2xl rounded-2xl w-96 border border-gray-300" style={{ top: "100px", left: "80%", transform: "translateX(-50%)" }}>
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
                    </div>

                    <div className="flex justify-between">
                        <button className="px-4 py-2 bg-blue-500 text-white rounded-md" onClick={handleSaveWorkflow}>
                            Save
                        </button>
                        <button className="px-4 py-2 bg-red-500 text-white rounded-md" onClick={() => setShowWorkflowModal(false)}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div className="absolute bg-white p-6 shadow-2xl rounded-2xl w-96 border border-gray-300" style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                    <h2 className="text-xl font-bold text-center">Confirm Save</h2>
                    <p className="text-center text-gray-600 mt-4">Are you sure you want to save this workflow?</p>
                    <div className="flex justify-between mt-4">
                        <button
                            className="px-4 py-2 bg-green-500 text-white rounded-md"
                            onClick={() => handleConfirmSave(true)}
                        >
                            Confirm
                        </button>
                        <button
                            className="px-4 py-2 bg-gray-300 text-white rounded-md"
                            onClick={() => handleConfirmSave(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
