import IconSelectorComponent from '@/components/custom/icons/IconSelectorComponent';
import { JobTypeDto } from '@/dtos/Interfaces/job/IJob';
import userStore from '@/stores/UserStore';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import i18n from '@/i18n'; // <-- импорт вашего инициализированного i18n
import { Divider } from 'react-native-paper';

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
  }, [userId]);

  const toggleExpand = (jobType: number) => {
    setExpandedTypes((prev) => ({
      ...prev,
      [jobType]: !prev[jobType],
    }));
  };

  const selectJobName = (jobType: string) => {
    const jobNamesDictionary: { [key: string]: string } = {
      'UserEdit': i18n.t('UserJobsList.userEditName'),
      'FillOnboarding': i18n.t('UserJobsList.fillOnboardingName'),
      'PetEdit': i18n.t('UserJobsList.petEditName'),
      'AddFirstWalk': i18n.t('UserJobsList.addFirstWalkName'),
      'AddMapPoint': i18n.t('UserJobsList.addMapPointName'),
      'AddMapPointComment': i18n.t('UserJobsList.addMapPointCommentName'),
      'GetMapBonuses': i18n.t('UserJobsList.getMapBonusesName'),
      // и т.д., дополняйте по необходимости
    };

    return jobNamesDictionary[jobType] || jobType; // fallback, если нет в словаре
  };

  const selectJobDescription = (jobDesc: string) => {
    const jobDictionary: { [key: string]: string } = {
      'UserEdit': i18n.t('UserJobsList.userEditDesc'),
      'FillOnboarding': i18n.t('UserJobsList.fillOnboardingDesc'),
      'PetEdit': i18n.t('UserJobsList.petEditDesc'),
      'AddFirstWalk': i18n.t('UserJobsList.addFirstWalkDesc'),
      'AddMapPoint': i18n.t('UserJobsList.addMapPointDesc'),
      'AddMapPointComment': i18n.t('UserJobsList.addMapPointCommentDesc'),
      'GetMapBonuses': i18n.t('UserJobsList.getMapBonusesDesc'),
      // и т.д.
    };
    return jobDictionary[jobDesc] || jobDesc; // fallback
  };

  const renderJobTypeCard = ({ item }: { item: JobTypeDto }) => {
    const isExpanded = expandedTypes[item.jobType] || false;
    // Если задание выполнено, окрашиваем бэкграунд в серый
    const cardStyle = item.isCompleted ? 'bg-gray-300' : 'bg-white';

    return (
      <View className={`rounded-lg p-4 my-2 mx-4 ${cardStyle}`}>
        <TouchableOpacity onPress={() => toggleExpand(item.jobType)}>
          <View className="items-start justify-start">
            <View className="flex-row items-start">
              {isExpanded ? (
                <IconSelectorComponent
                  iconName="chevron-down-circle-outline"
                  iconSet="Ionicons"
                />
              ) : (
                <IconSelectorComponent
                  iconName="chevron-up-circle-outline"
                  iconSet="Ionicons"
                />
              )}
              <Text className="text-base font-nunitoSansBold ml-2">
                {selectJobName(item.jobTypeName)}
              </Text>
            </View>
            <Text className="text-base text-gray-600 font-nunitoSansRegular">
              {i18n.t('UserJobsList.reward')}: {item.totalBenefits}
            </Text>
          </View>
        </TouchableOpacity>
        {isExpanded && (
          <View className="mt-1">
            <Text className="font-nunitoSansRegular ml-2">
              {selectJobDescription(item.jobTypeName)}
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <FlatList
      className="flex-1"
      ListHeaderComponent={
        <View className="px-4 items-center justify-center mt-5">
          <Image
            className="w-24 h-24"
            source={require('@/assets/images/bonuse.png')}
          />
          <Text className="text-lg text-center font-nunitoSansBold text-gray-600">
            {i18n.t('UserJobsList.headerTitle')}
          </Text>
          <View className="mt-2">
            <Text className="text-gray-600">
              {i18n.t('UserJobsList.useBonuses')}
            </Text>
            <View className="ml-2">
              <Text className="text-gray-600">
                {i18n.t('UserJobsList.appImprovements')}
              </Text>
              <Text className="text-gray-600">
                {i18n.t('UserJobsList.discounts')}
              </Text>
            </View>
            <Text className="text-gray-600 mt-2">
              {i18n.t('UserJobsList.assortmentUpdates')}
            </Text>
          </View>
          <View className="h-2" />
          <Divider className="w-full" />
          <View className="h-2" />
        </View>
      }
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
      ListFooterComponent={<View className="h-32" />}
    />
  );
};

export default UserJobsList;