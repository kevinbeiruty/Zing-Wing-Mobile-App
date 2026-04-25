import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider as PaperProvider } from 'react-native-paper';
import * as Notifications from 'expo-notifications';
import { StatusBar } from 'expo-status-bar';

import AddMissionScreen from './src/screens/AddMissionScreen';
import AddPostScreen from './src/screens/AddPostScreen';
import AiMissionScreen from './src/screens/AiMissionScreen';
import CommunityScreen from './src/screens/CommunityScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import LeaderboardScreen from './src/screens/LeaderboardScreen';
import LoginScreen from './src/screens/LoginScreen';
import MissionDetailsScreen from './src/screens/MissionDetailsScreen';
import MissionsScreen from './src/screens/MissionsScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import { currentUser, getLevel, getRank, starterMissions, starterPosts } from './src/data/mockData';
import { darkTheme, lightTheme } from './src/theme/themes';

const RootStack = createNativeStackNavigator();
const DashboardStack = createNativeStackNavigator();
const MissionsStack = createNativeStackNavigator();
const CommunityStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [missions, setMissions] = useState(starterMissions);
  const [posts, setPosts] = useState(starterPosts);
  const [totalXP, setTotalXP] = useState(currentUser.totalXP);
  const [userProfile, setUserProfile] = useState(currentUser);
  const [onboardingAnswers, setOnboardingAnswers] = useState({});
  const [themeLoaded, setThemeLoaded] = useState(false);

  const paperTheme = isDarkMode ? darkTheme : lightTheme;
  const baseNavigationTheme = isDarkMode ? NavigationDarkTheme : NavigationDefaultTheme;
  const navigationTheme = {
    ...baseNavigationTheme,
    colors: {
      ...baseNavigationTheme.colors,
      primary: paperTheme.colors.primary,
      background: paperTheme.colors.background,
      card: paperTheme.colors.surface,
      text: paperTheme.colors.onSurface,
      border: paperTheme.colors.outline,
      notification: paperTheme.colors.notification,
    },
  };

  const level = getLevel(totalXP);
  const rank = getRank(level);
  const userStats = {
    ...userProfile,
    totalXP,
    level,
    rank,
    completedMissions: missions.filter((mission) => mission.completed).length,
    publicPosts: posts.filter((post) => post.userName === 'You' && post.visibility === 'public').length,
    privatePosts: posts.filter((post) => post.userName === 'You' && post.visibility === 'private').length,
  };

  useEffect(() => {
    async function loadThemePreference() {
      const savedMode = await AsyncStorage.getItem('zingWingDarkMode');
      if (savedMode !== null) {
        setIsDarkMode(savedMode === 'true');
      }
      setThemeLoaded(true);
    }

    loadThemePreference();
  }, []);

  useEffect(() => {
    // This native feature uses local storage to remember the theme preference.
    if (themeLoaded) {
      AsyncStorage.setItem('zingWingDarkMode', String(isDarkMode));
    }
  }, [isDarkMode, themeLoaded]);

  function addMission(mission) {
    setMissions((oldMissions) => [mission, ...oldMissions]);
  }

  function updateMission(id, updates) {
    // Later this function will use Firebase Firestore updateDoc().
    setMissions((oldMissions) => oldMissions.map((mission) => (
      mission.id === id ? { ...mission, ...updates } : mission
    )));
  }

  function deleteMission(id) {
    // Later this function will use Firebase Firestore deleteDoc().
    setMissions((oldMissions) => oldMissions.filter((mission) => mission.id !== id));
  }

  function completeMission(id) {
    const mission = missions.find((item) => item.id === id);
    if (!mission || mission.completed) return;

    // This button updates mission.completed and adds XP to the user.
    setMissions((oldMissions) => oldMissions.map((item) => (
      item.id === id ? { ...item, completed: true } : item
    )));
    setTotalXP((oldXP) => oldXP + mission.xp);
  }

  function addPost(post) {
    setPosts((oldPosts) => [post, ...oldPosts]);
  }

  async function scheduleReminder(mission) {
    try {
      // This native feature schedules a local push notification for routine reminders.
      if (Platform.OS === 'web') return;

      const permission = await Notifications.requestPermissionsAsync();
      if (!permission.granted) return;

      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Zing Wing Mission Reminder',
          body: `${mission.title} is waiting at ${mission.reminderTime}.`,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 5,
        },
      });
    } catch (error) {
      console.log('Notification scheduling skipped:', error.message);
    }
  }

  function dashboardStackScreenOptions() {
    return {
      headerStyle: { backgroundColor: paperTheme.colors.surface },
      headerTintColor: paperTheme.colors.onSurface,
    };
  }

  function DashboardStackScreen() {
    return (
      <DashboardStack.Navigator screenOptions={dashboardStackScreenOptions}>
        <DashboardStack.Screen name="Dashboard" options={{ title: 'Zing Wing' }}>
          {(props) => (
            <DashboardScreen
              {...props}
              missions={missions}
              totalXP={totalXP}
              completeMission={completeMission}
            />
          )}
        </DashboardStack.Screen>
        <DashboardStack.Screen name="MissionDetails" options={{ title: 'Mission Details' }}>
          {(props) => (
            <MissionDetailsScreen
              {...props}
              missions={missions}
              completeMission={completeMission}
              updateMission={updateMission}
              deleteMission={deleteMission}
              scheduleReminder={scheduleReminder}
            />
          )}
        </DashboardStack.Screen>
      </DashboardStack.Navigator>
    );
  }

  function MissionsStackScreen() {
    return (
      <MissionsStack.Navigator screenOptions={dashboardStackScreenOptions}>
        <MissionsStack.Screen name="Missions" options={{ title: 'Missions' }}>
          {(props) => (
            <MissionsScreen
              {...props}
              missions={missions}
              completeMission={completeMission}
              deleteMission={deleteMission}
            />
          )}
        </MissionsStack.Screen>
        <MissionsStack.Screen name="AddMission" options={{ title: 'Add Mission' }}>
          {(props) => (
            <AddMissionScreen
              {...props}
              addMission={addMission}
              scheduleReminder={scheduleReminder}
            />
          )}
        </MissionsStack.Screen>
        <MissionsStack.Screen name="MissionDetails" options={{ title: 'Mission Details' }}>
          {(props) => (
            <MissionDetailsScreen
              {...props}
              missions={missions}
              completeMission={completeMission}
              updateMission={updateMission}
              deleteMission={deleteMission}
              scheduleReminder={scheduleReminder}
            />
          )}
        </MissionsStack.Screen>
      </MissionsStack.Navigator>
    );
  }

  function CommunityStackScreen() {
    return (
      <CommunityStack.Navigator screenOptions={dashboardStackScreenOptions}>
        <CommunityStack.Screen name="Community" options={{ title: 'Community' }}>
          {(props) => <CommunityScreen {...props} posts={posts} />}
        </CommunityStack.Screen>
        <CommunityStack.Screen name="AddPost" options={{ title: 'Add Post' }}>
          {(props) => <AddPostScreen {...props} addPost={addPost} userStats={userStats} />}
        </CommunityStack.Screen>
      </CommunityStack.Navigator>
    );
  }

  function MainTabs() {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: paperTheme.colors.primary,
          tabBarStyle: { backgroundColor: paperTheme.colors.surface },
          tabBarIcon: ({ color, size }) => {
            const icons = {
              DashboardTab: 'view-dashboard',
              MissionsTab: 'sword-cross',
              CommunityTab: 'account-group',
              Leaderboard: 'trophy',
            };
            return <MaterialCommunityIcons name={icons[route.name]} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="DashboardTab" component={DashboardStackScreen} options={{ title: 'Dashboard' }} />
        <Tab.Screen name="MissionsTab" component={MissionsStackScreen} options={{ title: 'Missions' }} />
        <Tab.Screen name="CommunityTab" component={CommunityStackScreen} options={{ title: 'Community' }} />
        <Tab.Screen name="Leaderboard" options={{ title: 'Leaderboard' }}>
          {(props) => <LeaderboardScreen {...props} currentUserCountry={userProfile.country} />}
        </Tab.Screen>
      </Tab.Navigator>
    );
  }

  function MainDrawer() {
    return (
      <Drawer.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: paperTheme.colors.surface },
          headerTintColor: paperTheme.colors.onSurface,
          drawerActiveTintColor: paperTheme.colors.primary,
          drawerStyle: { backgroundColor: paperTheme.colors.background },
          drawerLabelStyle: { color: paperTheme.colors.onSurface },
        }}
      >
        <Drawer.Screen name="MainTabs" component={MainTabs} options={{ title: 'Mission Hub' }} />
        <Drawer.Screen name="Profile" options={{ title: 'Profile' }}>
          {(props) => <ProfileScreen {...props} userStats={userStats} />}
        </Drawer.Screen>
        <Drawer.Screen name="Settings" options={{ title: 'Settings' }}>
          {(props) => (
            <SettingsScreen
              {...props}
              isDarkMode={isDarkMode}
              setIsDarkMode={setIsDarkMode}
            />
          )}
        </Drawer.Screen>
        <Drawer.Screen name="AI Mission Generator" options={{ title: 'AI Mission Generator' }}>
          {(props) => <AiMissionScreen {...props} onboardingAnswers={onboardingAnswers} />}
        </Drawer.Screen>
      </Drawer.Navigator>
    );
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <PaperProvider theme={paperTheme}>
        <NavigationContainer theme={navigationTheme}>
          <StatusBar style={isDarkMode ? 'light' : 'dark'} />
          <RootStack.Navigator screenOptions={{ headerShown: false }}>
            <RootStack.Screen name="Welcome" component={WelcomeScreen} />
            <RootStack.Screen name="Login" component={LoginScreen} />
            <RootStack.Screen name="Register">
              {(props) => (
                <RegisterScreen
                  {...props}
                  saveRegisteredUser={(profile) => setUserProfile((oldProfile) => ({ ...oldProfile, ...profile }))}
                />
              )}
            </RootStack.Screen>
            <RootStack.Screen name="Onboarding">
              {(props) => (
                <OnboardingScreen
                  {...props}
                  saveOnboardingAnswers={setOnboardingAnswers}
                />
              )}
            </RootStack.Screen>
            <RootStack.Screen name="MainDrawer" component={MainDrawer} />
          </RootStack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: '100%',
    minHeight: '100vh',
  },
});
