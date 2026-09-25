import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/useToast';
import { USER_SERVICE } from '@/services';

interface AgentOption {
  label: string;
  value: 'none' | 'profile' | 'agent';
}

interface User {
  id: string;
  name: string;
}

interface PropertyAgentReviewStepProps {
  agentDisplayOption: 'none' | 'profile' | 'agent';
  selectedAgentId?: string;
  // reviewNotes?: string;
  onOptionChange: (option: 'none' | 'profile' | 'agent') => void;
  onAgentSelect: (agentId: string) => void;
  // onReviewNotesChange: (notes: string) => void;
}

const options: AgentOption[] = [
  { label: 'None (Agent information box will not be displayed)', value: 'none' },
  { label: 'My profile information', value: 'profile' },
  { label: 'Display agent information', value: 'agent' },
];

const PropertyAgentReviewStep: React.FC<PropertyAgentReviewStepProps> = ({
  agentDisplayOption,
  selectedAgentId,
  // reviewNotes = '',
  onOptionChange,
  onAgentSelect,
  // onReviewNotesChange,
}) => {
  const [agents, setAgents] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (agentDisplayOption === 'agent') {
      setLoading(true);
      USER_SERVICE.getAgents()
        .then((res) => {
          const raw = (res as { data?: unknown }).data;
          const list = Array.isArray(raw)
            ? raw
            : Array.isArray((raw as { data?: unknown[] })?.data)
              ? (raw as { data: unknown[] }).data
              : [];
          setAgents(
            list.map((agent) => {
              const row = agent as { id?: string; _id?: string; name?: string; fullName?: string };
              return { id: row.id || row._id || '', name: row.name || row.fullName || 'Agent' };
            }),
          );
        })
        .catch(err => toast.error(`Failed to load agents: ${err.message}`))
        .finally(() => setLoading(false));
    }
  }, [agentDisplayOption, toast]);

  return (
    <div className="space-y-4 p-[5%]">
      <h2 className="text-lg font-medium mb-2">What to display in agent information box</h2>
      <div className="space-y-2">
        {options.map(opt => (
          <label key={opt.value} className="flex items-center gap-2">
            <input
              type="radio"
              name="agentOption"
              value={opt.value}
              checked={agentDisplayOption === opt.value}
              onChange={() => onOptionChange(opt.value)}
              className="form-radio"
            />
            <span>{opt.label}</span>
          </label>
        ))}
      </div>

      {agentDisplayOption === 'agent' && (
        <div className="mt-4">
          <label className="block font-medium mb-1">Select Agent</label>
          {loading ? (
            <p>Loading agents...</p>
          ) : (
            <select
              value={selectedAgentId || ''}
              onChange={e => onAgentSelect(e.target.value)}
              className="w-full shadow-md p-2 rounded-md"
            >
              <option value="">-- Choose an agent --</option>
              {agents.map(agent => (
                <option key={agent.id} value={agent.id}>
                  {agent.name}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      {/* <div className="mt-4">
        <label className="block font-medium mb-1">Review Notes (Optional)</label>
        <textarea
          className="w-full shadow-md p-2 rounded-md"
          placeholder="Any additional notes or review comments"
          rows={4}
          value={reviewNotes}
          onChange={e => onReviewNotesChange(e.target.value)}
        />
      </div> */}
    </div>
  );
};

export default PropertyAgentReviewStep;
