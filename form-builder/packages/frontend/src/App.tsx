import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WorkflowList } from './pages/WorkflowList.tsx';
import { WorkflowEditor } from './pages/WorkflowEditor.tsx';
import { FormPreview } from './pages/FormPreview.tsx';
import { ToastProvider } from './components/ui/toast';

function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={<WorkflowList />} />
          <Route path="/workflows/:id" element={<WorkflowEditor />} />
          <Route path="/workflows/:id/preview" element={<FormPreview />} />
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;