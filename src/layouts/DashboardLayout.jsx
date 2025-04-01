import React, { useEffect, useState } from "react";
import { FaBars } from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { AiOutlineEllipsis } from "react-icons/ai";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import { useWorkflows } from "../context/WorkFlowContext";

const DashboardLayout = () => {
  const { setIsCreatingNew, setCurrentWorkflowId, setCurrentWorkflow, setWorkflows } = useWorkflows();
  const navigate = useNavigate();
  const [workflows, setWorkflowData] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMenu, setShowMenu] = useState(null); // State for tracking which menu is shown

  useEffect(() => {
    const storedWorkflows = JSON.parse(localStorage.getItem("workflows")) || [];
    setWorkflowData(storedWorkflows);
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedWorkflows = JSON.parse(localStorage.getItem("workflows")) || [];
      setWorkflowData(updatedWorkflows);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleCreateProcess = () => {
    setIsCreatingNew(true);
    const newWorkflow = { id: uuidv4(), nodes: [] };
    setCurrentWorkflow(newWorkflow);
    setCurrentWorkflowId(newWorkflow.id);

    setWorkflows((prev) => {
      const updatedWorkflows = [...prev, newWorkflow];
      localStorage.setItem("workflows", JSON.stringify(updatedWorkflows));
      return updatedWorkflows;
    });

    localStorage.setItem("currentWorkflow", JSON.stringify(newWorkflow));
    navigate("/createprocess");
  };

  const handleEdit = (workflowId) => {
    navigate(`/editprocess/${workflowId}`);
  };

  const handleDelete = (workflowId) => {
    const updatedWorkflows = workflows.filter((workflow) => workflow.id !== workflowId);
    setWorkflowData(updatedWorkflows);

    // Update localStorage
    localStorage.setItem("workflows", JSON.stringify(updatedWorkflows));
    setWorkflows(updatedWorkflows);
  };

  const toggleExpandRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const filteredWorkflows = workflows.filter((workflow) => {
    const firstNode = workflow.nodes?.[0] || {};
    const workflowName = firstNode.name || "Unnamed Workflow";
    const workflowDescription = firstNode.description || "No Description";
    return (
      workflowName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workflow.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workflowDescription.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="bg-[#fdfbf6] min-h-screen p-4">
      <header className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          <FaBars className="text-gray-700 text-xl cursor-pointer" />
          <h1 className="text-xl font-bold text-gray-900">Workflow Builder</h1>
        </div>
      </header>

      <div className="flex justify-between items-center p-4 bg-[#F9F7F4]">
        <input
          type="text"
          placeholder="Search by Workflow Name/ID/Description"
          className="p-2 border border-gray-300 rounded-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          onClick={handleCreateProcess}
          className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
        >
          + Create New Process
        </button>
      </div>

      <div className="bg-white p-4 shadow-md rounded-md">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#F68B21]">
              <th className="text-left p-2">Workflow Name</th>
              <th className="text-left p-2">ID</th>
              <th className="text-left p-2">Last Edited On</th>
              <th className="text-left p-2">Description</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredWorkflows.length > 0 ? (
              filteredWorkflows.map((workflow) => {
                const firstNode = workflow.nodes?.[0] || {};
                const workflowName = firstNode.name || "Unnamed Workflow";
                const workflowDescription = firstNode.description || "No Description";
                return (
                  <React.Fragment key={workflow.id}>
                    <tr className="border-b">
                      <td className="p-2">{workflowName}</td>
                      <td className="p-2">{workflow.id}</td>
                      <td className="p-2">{workflow.lastEdited || "N/A"}</td>
                      <td className="p-2">{workflowDescription}</td>
                      <td className="flex space-x-2 p-2">
                        <button
                          className="border px-3 py-1 rounded-md"
                          onClick={() => toggleExpandRow(workflow.id)}
                        >
                          {expandedRow === workflow.id ? <IoIosArrowUp /> : <IoIosArrowDown />}
                        </button>
                        <button
                          className="border px-3 py-1 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition"
                          onClick={() => handleEdit(workflow.id)}
                        >
                          Edit
                        </button>
                        <button
                          className="border px-3 py-1 rounded-md text-gray-700"
                          onClick={() => setShowMenu(showMenu === workflow.id ? null : workflow.id)}
                        >
                          <AiOutlineEllipsis />
                        </button>
                        {showMenu === workflow.id && (
                          <div className="bottom bg-white border border-gray-300 rounded-md shadow-md p-3">
                            <button
                              onClick={() => {
                                handleDelete(workflow.id);
                                setShowMenu(null);
                              }}
                              className="text-red-500"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                    {expandedRow === workflow.id && workflow.nodes.length > 0 && (
                      <tr>
                        <td colSpan="5" className="bg-[#fdfbf6] p-4">
                          <div className="relative ml-6 border-l-2 border-orange-400 pl-4">
                            {workflow.nodes.map((node, index) => (
                              <div key={index} className="flex items-center space-x-4 mb-4 relative">
                                <div className="absolute left-[-12px] top-1 bg-orange-500 h-3 w-3 rounded-full"></div>
                                <span className="text-sm text-gray-500">{node.time || "N/A"}</span>
                                <span
                                  className={`px-3 py-1 text-xs font-semibold rounded ${node.status?.trim().toLowerCase() === "pass"
                                      ? "bg-green-200 text-green-700"
                                      : "bg-red-200 text-red-700"
                                    }`}
                                >
                                  {node.status}
                                </span>
                                <FaArrowUpRightFromSquare  onClick={() => handleEdit(workflow.id)} />
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">
                  No workflows found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardLayout;
