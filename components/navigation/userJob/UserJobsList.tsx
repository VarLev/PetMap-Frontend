// UserJobsList.tsx
import IconSelectorComponent from '@/components/custom/icons/IconSelectorComponent';
import { JobTypeDto } from '@/dtos/Interfaces/job/IJob';
import userStore from '@/stores/UserStore';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';

const UserJobsList = () => {
  const [jobTypes, setJobTypes] = useState<JobTypeDto[]>([]);
  const [expandedTypes, setExpandedTypes] = useState<{ [key: number]: boolean }>({});
  const userId = userStore.currentUser?.id!; // Замените на актуальный идентификатор пользователя

  useEffect(() => {
    const fetchJobs = async () => {
      const data = await userStore.getUserJobs(userId);
      setJobTypes(data);
    };

    fetchJobs();
  }, []);

  const toggleExpand = (jobType: number) => {
    setExpandedTypes((prev) => ({
      ...prev,
      [jobType]: !prev[jobType],
    }));
  };

  const renderJobTypeCard = ({ item }: { item: JobTypeDto }) => {
    const isExpanded = expandedTypes[item.jobType] || false;
    const cardStyle = item.isCompleted ? 'bg-gray-300' : 'bg-white';

    return (
      <View className={`rounded-lg p-4 my-2 mx-4 ${cardStyle}`}>
        <TouchableOpacity onPress={() => toggleExpand(item.jobType)}>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            {isExpanded ? (
              <IconSelectorComponent iconName='chevron-down-circle-outline' iconSet='Ionicons' />
            ) : (
              <IconSelectorComponent iconName='chevron-up-circle-outline' iconSet='Ionicons' />
            )}
            <Text className="text-lg font-nunitoSansBold ml-2">{item.jobTypeName}</Text>
          </View>
          <Text className="text-base text-gray-600 font-nunitoSansRegular">Награда: {item.totalBenefits}</Text>
        </View>

        </TouchableOpacity>
        {isExpanded && (
          <View className="mt-1">
            {item.jobs.map((job) => (
              <View key={job.id} className=" flex-row items-end">
                <Text className={`text-base font-bold ${job.isCompleted ? 'line-through text-gray-500' : 'text-black'}`}>{job.name}</Text>
                <Text className={`text-sm ${job.isCompleted ? 'line-through text-gray-500' : 'text-gray-700'}`}> - {job.description}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <FlatList
      data={jobTypes}
      renderItem={renderJobTypeCard}
      keyExtractor={(item) => item.jobType.toString()}
    />
  );
};

export default UserJobsList;
