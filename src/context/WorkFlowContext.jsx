import { createContext, useState, useContext, useEffect } from "react";

const WorkflowContext = createContext();

export const WorkflowProvider = ({ children }) => {
    const [workflows, setWorkflows] = useState([]);
    const [currentWorkflow, setCurrentWorkflow] = useState(null);
    const [currentWorkflowId, setCurrentWorkflowId] = useState(null);
    const [isCreatingNew, setIsCreatingNew] = useState(false);

    useEffect(() => {
        const storedWorkflows = JSON.parse(localStorage.getItem("workflows")) || [];
        setWorkflows(storedWorkflows);

        const storedCurrentWorkflow = JSON.parse(localStorage.getItem("currentWorkflow")) || null;
        setCurrentWorkflow(storedCurrentWorkflow);
        setCurrentWorkflowId(storedCurrentWorkflow?.id || null);
    }, []);

    useEffect(() => {
        if (currentWorkflow) {
            setCurrentWorkflowId(currentWorkflow.id);
            localStorage.setItem("currentWorkflow", JSON.stringify(currentWorkflow));
        }
    }, [currentWorkflow]);

    const addWorkflow = (newWorkflow) => {
        setWorkflows((prevWorkflows) => {
            let storedWorkflows = JSON.parse(localStorage.getItem("workflows")) || [];

            let existingIndex = storedWorkflows.findIndex(
                (workflow) => workflow.id === newWorkflow.id
            );

            if (existingIndex !== -1) {
                storedWorkflows[existingIndex].nodes.push(...newWorkflow.nodes);
            } else {
                storedWorkflows.push({ id: newWorkflow.id, nodes: [...newWorkflow.nodes] });
            }

            localStorage.setItem("workflows", JSON.stringify(storedWorkflows));
            return storedWorkflows;
        });

        setCurrentWorkflow(newWorkflow);
    };

    const removeWorkflow = (nodeId) => {
        setCurrentWorkflow((prevWorkflow) => {
            if (!prevWorkflow) return prevWorkflow;
    
            const updatedNodes = prevWorkflow.nodes.filter((node) => node.id !== nodeId);
            const updatedWorkflow = { ...prevWorkflow, nodes: updatedNodes };
    
            // Update local storage
            let storedWorkflows = JSON.parse(localStorage.getItem("workflows")) || [];
            let index = storedWorkflows.findIndex((wf) => wf.id === updatedWorkflow.id);
            
            if (index !== -1) {
                storedWorkflows[index] = updatedWorkflow;
            }
    
            localStorage.setItem("workflows", JSON.stringify(storedWorkflows));
            setWorkflows(storedWorkflows);
    
            return updatedWorkflow;
        });
    };

    return (
        <WorkflowContext.Provider value={{
            workflows, setWorkflows,
            currentWorkflow, setCurrentWorkflow,
            currentWorkflowId, setCurrentWorkflowId,
            isCreatingNew, setIsCreatingNew,
            addWorkflow, removeWorkflow
        }}>
            {children}
        </WorkflowContext.Provider>
    );
};

export const useWorkflows = () => { return useContext(WorkflowContext)};
