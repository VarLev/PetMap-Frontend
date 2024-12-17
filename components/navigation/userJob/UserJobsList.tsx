import IconSelectorComponent from '@/components/custom/icons/IconSelectorComponent';
import { JobTypeDto } from '@/dtos/Interfaces/job/IJob';
import userStore from '@/stores/UserStore';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import i18n from '@/i18n';

const UserJobsList = () => {
  const [jobTypes, setJobTypes] = useState<JobTypeDto[]>([]);
  const [expandedTypes, setExpandedTypes] = useState<{ [key: number]: boolean }>({});
  const userId = userStore.currentUser?.id!;

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

  const selectJobName = (jobType: string) => {
    //создать словарь для типов работт и их названий и вернуть название по ключу jobType 
    const jobNamesDictionary: { [key: string]: string } = {
      'UserEdit': 'Заполнение профиля пользователя',
      'FillOnboarding': 'Заполнение онбординга',
      'PetEdit': 'Заполнение профиля питомца',
      'AddFirstWalk': 'Добавление первой прогулки',
      'AddMapPoint': 'Добавление публичной метки на карте',
      'AddMapPointComment': 'Добавление комментария',
      'GetMapBonuses': 'Собрать бонус на карте',
      // Add more job types as needed
    };

    return jobNamesDictionary[jobType];

  }

  const renderJobTypeCard = ({ item }: { item: JobTypeDto }) => {
    const isExpanded = expandedTypes[item.jobType] || false;
    const cardStyle = item.isCompleted ? 'bg-gray-300' : 'bg-white';

    return (
      <View className={`rounded-lg p-4 my-2 mx-4 ${cardStyle}`}>
        <TouchableOpacity onPress={() => toggleExpand(item.jobType)}>
          <View className="items-start justify-start">
            <View className="flex-row items-start">
              {isExpanded ? (
                <IconSelectorComponent iconName="chevron-down-circle-outline" iconSet="Ionicons" />
              ) : (
                <IconSelectorComponent iconName="chevron-up-circle-outline" iconSet="Ionicons" />
              )}
              <Text className="text-base font-nunitoSansBold ml-2">{selectJobName(item.jobTypeName)}</Text>
            </View>
            <Text className="text-base text-gray-600 font-nunitoSansRegular">
              {i18n.t('UserJobsList.reward')}: {item.totalBenefits}
            </Text>
          </View>
        </TouchableOpacity>
        {isExpanded && (
          <View className="mt-1">
            {item.jobs.map((job) => (
              <View key={job.id} className="flex-row items-end">
                <Text
                  className={`text-base font-bold ${
                    job.isCompleted ? 'line-through text-gray-500' : 'text-black'
                  }`}
                >
                  {job.name}
                </Text>
                <Text
                  className={`text-sm ${
                    job.isCompleted ? 'line-through text-gray-500' : 'text-gray-700'
                  }`}
                >
                  {` - ${job.description}`}
                </Text>
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
      ListEmptyComponent={
        <View className="items-center justify-center mt-10">
          <Text className="text-lg font-nunitoSansBold text-gray-600">
            {i18n.t('UserJobsList.noJobs')}
          </Text>
        </View>
      }
    />
  );
};

export default UserJobsList;