// FormContext.tsx
import { Job } from '@/dtos/classes/job/Job';
import React, { createContext, useState } from 'react';

interface BonusFieldType {
  filledControls: { [key: string]: boolean };
  addFilledControl: (controlName: string) => void;
  removeFilledControl: (controlName: string) => void;
  completedJobs: Job[];
  addCompletedJobs: (job: Job) => void;
  removeCompletedJob: (jobId: number) => void;
}

export const BonusContex = createContext<BonusFieldType | null>(null);

export const BonusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [filledControls, setFilledControls] = useState<{ [key: string]: boolean }>({});
  const [completedJobs, setCompletedJobs] = useState<Job[]>([]);

  const addFilledControl = (controlName: string) => {
    setFilledControls((prev) => ({ ...prev, [controlName]: true }));
  };

  const addCompletedJobs = (job: Job) => {
    setCompletedJobs((prev) => [...prev, job]);
  };

  const removeFilledControl = (controlName: string) => {
    setFilledControls((prev) => {
      const updatedControls = { ...prev };
      delete updatedControls[controlName];
      return updatedControls;
    });
  };

  const removeCompletedJob = (jobId: number) => {
    setCompletedJobs((prev) => prev.filter((job) => job.id !== jobId));
  };

  return (
    <BonusContex.Provider
      value={{ filledControls, addFilledControl, completedJobs, addCompletedJobs, removeFilledControl, removeCompletedJob }}
    >
      {children}
    </BonusContex.Provider>
  );
};
