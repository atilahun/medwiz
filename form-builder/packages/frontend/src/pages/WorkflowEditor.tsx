import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { workflowApi } from '@/lib/api';
import { Workflow } from '@/types/form';
import { FormBuilder } from '@/components/FormBuilder';
import { useToast } from '@/components/ui/toast';

export function WorkflowEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchWorkflow(id);
    }
  }, [id]);

  const fetchWorkflow = async (workflowId: string) => {
    try {
      const response = await workflowApi.getById(workflowId);

      // Ensure the workflow has at least one page
      if (!response.data.pages || response.data.pages.length === 0) {
        response.data.pages = [{
          id: `page-${Date.now()}`,
          workflowId: workflowId,
          title: 'Page 1',
          orderIndex: 0,
          sections: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }];
      }

      setWorkflow(response.data);
    } catch (error) {
      console.error('Failed to fetch workflow:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (updatedWorkflow: Workflow) => {
    try {
      await workflowApi.update(updatedWorkflow.id, updatedWorkflow);
      showToast('Workflow saved successfully!', 'success');
      // Update local state with the saved workflow
      setWorkflow(updatedWorkflow);
    } catch (error) {
      console.error('Failed to save workflow:', error);
      showToast('Failed to save workflow. Please try again.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading workflow...</div>
      </div>
    );
  }

  if (!workflow) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Workflow not found</div>
      </div>
    );
  }

  return <FormBuilder workflow={workflow} onSave={handleSave} />;
}