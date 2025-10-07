import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { workflowApi } from '@/lib/api';
import { Workflow, WorkflowStatus } from '@/types/form';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Plus, Edit, Eye, Copy, Trash2 } from 'lucide-react';

export function WorkflowList() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const fetchWorkflows = async () => {
    try {
      const response = await workflowApi.getAll();
      setWorkflows(response.data);
    } catch (error) {
      console.error('Failed to fetch workflows:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = async () => {
    try {
      const newWorkflow = await workflowApi.create({
        name: 'Untitled Form',
        description: '',
        status: WorkflowStatus.DRAFT,
      });
      navigate(`/workflows/${newWorkflow.data.id}`);
    } catch (error) {
      console.error('Failed to create workflow:', error);
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      const duplicated = await workflowApi.duplicate(id);
      setWorkflows([...workflows, duplicated.data]);
    } catch (error) {
      console.error('Failed to duplicate workflow:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this workflow?')) return;

    try {
      await workflowApi.delete(id);
      setWorkflows(workflows.filter(w => w.id !== id));
    } catch (error) {
      console.error('Failed to delete workflow:', error);
    }
  };

  const getStatusColor = (status: WorkflowStatus) => {
    switch (status) {
      case WorkflowStatus.DRAFT:
        return 'bg-gray-100 text-gray-800';
      case WorkflowStatus.PUBLISHED:
        return 'bg-green-100 text-green-800';
      case WorkflowStatus.ARCHIVED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading workflows...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Form Workflows</h1>
        <Button onClick={handleCreateNew}>
          <Plus className="w-4 h-4 mr-2" />
          Create New Form
        </Button>
      </div>

      {workflows.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-gray-500 mb-4">No workflows created yet</p>
            <Button onClick={handleCreateNew}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Form
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workflows.map(workflow => (
            <Card key={workflow.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{workflow.name}</CardTitle>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(workflow.status)}`}>
                    {workflow.status}
                  </span>
                </div>
                <CardDescription>{workflow.description || 'No description'}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-500 mb-4">
                  <p>{workflow.pages?.length || 0} pages</p>
                  <p>Created: {new Date(workflow.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/workflows/${workflow.id}`)}
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/workflows/${workflow.id}/preview`)}
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    Preview
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDuplicate(workflow.id)}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(workflow.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}