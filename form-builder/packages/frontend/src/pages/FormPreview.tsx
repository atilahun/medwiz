import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { workflowApi } from '@/lib/api';
import { Workflow } from '@/types/form';
import { FormRenderer } from '@/components/FormRenderer/index.tsx';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export function FormPreview() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [loading, setLoading] = useState(true);
  const [submissionData, setSubmissionData] = useState<any>(null);

  useEffect(() => {
    if (id) {
      fetchWorkflow(id);
    }
  }, [id]);

  const fetchWorkflow = async (workflowId: string) => {
    try {
      const response = await workflowApi.getById(workflowId);
      setWorkflow(response.data);
    } catch (error) {
      console.error('Failed to fetch workflow:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (data: any) => {
    console.log('Form submitted with data:', data);
    setSubmissionData(data);
    // Here you would typically send the data to a backend API
    // For now, we'll just display it
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading form...</div>
      </div>
    );
  }

  if (!workflow) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Form not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-6">
        <div className="mb-6 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => navigate(`/workflows/${id}`)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Editor
          </Button>
          <span className="text-sm text-gray-500">Preview Mode</span>
        </div>

        {submissionData ? (
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Form Submitted Successfully!</h2>
            <p className="text-gray-600 mb-4">Here's the data that was submitted:</p>
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(submissionData, null, 2)}
            </pre>
            <Button
              className="mt-4"
              onClick={() => setSubmissionData(null)}
            >
              Submit Another Response
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md">
            <FormRenderer
              workflow={workflow}
              onSubmit={handleSubmit}
            />
          </div>
        )}
      </div>
    </div>
  );
}