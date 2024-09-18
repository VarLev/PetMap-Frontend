// useControl.ts
import { useEffect, useContext } from 'react';
import { BonusContex } from '@/contexts/BonusContex'; 
import { Job } from '@/dtos/classes/job/Job';

export const useControl = (controlName: string, value: any, job: Job) => {
  const { filledControls, addFilledControl, completedJobs, addCompletedJobs, removeFilledControl, removeCompletedJob  } = useContext(BonusContex)!;

  useEffect(() => {
    if (!filledControls[controlName] && isFilled(value)) {
      // Поле было пустым и теперь заполнено
      addFilledControl(controlName);
      addCompletedJobs(job);
    } else if (filledControls[controlName] && !isFilled(value)) {
      // Поле было заполнено и теперь очищено
      removeFilledControl(controlName);
      removeCompletedJob(job.id!);
    }
  }, [value]);
};

function isFilled(value: any): boolean {
  if (value == null) return false; // null или undefined
  if (typeof value === 'string') {
    return value.trim() !== '';
  }
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  if (typeof value === 'object') {
    return Object.keys(value).length > 0;
  }
  if (typeof value === 'number') {
    return true; // Числа считаются заполненными
  }
  // Для других типов данных
  return !!value;
}