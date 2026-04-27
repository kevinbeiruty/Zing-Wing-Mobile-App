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
import { getAuth, onAuthStateChanged } from 'firebase/auth';

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
import { getLevel, getRank } from './src/data/mockData';
import app from './src/firebase/firebaseConfig';
import {
  addMissionForUser,
  addPostForUser,
  completeMissionForUser,
  deleteMissionForUser,
  listenPostsForUser,
  listenUserMissions,
  listenUserProfile,
  updateMissionForUser,
} from './src/services/database';
import { darkTheme, lightTheme } from './src/theme/themes';

const RootStack = createNativeStackNavigator();
const DashboardStack = createNativeStackNavigator();
const MissionsStack = createNativeStackNavigator();
const CommunityStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const defaultUserProfile = {
  id: null,
  name: 'You',
  email: '',
  country: 'Lebanon',
  totalXP: 0,
};

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
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [missions, setMissions] = useState([]);
  const [posts, setPosts] = useState([]);
  const [userProfile, setUserProfile] = useState(defaultUserProfile);
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

  const totalXP = userProfile.totalXP || 0;
  const level = getLevel(totalXP);
  const rank = getRank(level);
  const userStats = {
    ...userProfile,
    totalXP,
    level,
    rank,
    completedMissions: missions.filter((mission) => mission.completed).length,
    publicPosts: posts.filter((post) => post.userId === firebaseUser?.uid && post.visibility === 'public').length,
    privatePosts: posts.filter((post) => post.userId === firebaseUser?.uid && post.visibility === 'private').length,
  };

  useEffect(() => {
    const auth = getAuth(app);
    return onAuthStateChanged(auth, setFirebaseUser);
  }, []);

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

  useEffect(() => {
    if (!firebaseUser) {
      setUserProfile(defaultUserProfile);
      setOnboardingAnswers({});
      return undefined;
    }

    return listenUserProfile(
      firebaseUser.uid,
      (profile) => {
        const nextProfile = profile || {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'You',
          email: firebaseUser.email || '',
          country: 'Lebanon',
          totalXP: 0,
        };

        setUserProfile(nextProfile);
        setOnboardingAnswers(nextProfile.onboardingAnswers || {});
      },
      (error) => console.log('User profile listener failed:', error.message)
    );
  }, [firebaseUser]);

  useEffect(() => {
    if (!firebaseUser) {
      setMissions([]);
      return undefined;
    }

    return listenUserMissions(
      firebaseUser.uid,
      setMissions,
      (error) => console.log('Mission listener failed:', error.message)
    );
  }, [firebaseUser]);

  useEffect(() => {
    if (!firebaseUser) {
      setPosts([]);
      return undefined;
    }

    return listenPostsForUser(
      firebaseUser.uid,
      setPosts,
      (error) => console.log('Post listener failed:', error.message)
    );
  }, [firebaseUser]);

  async function addMission(mission) {
    if (!firebaseUser) return;
    await addMissionForUser(firebaseUser.uid, mission);
  }

  async function updateMission(id, updates) {
    if (!firebaseUser) return;
    await updateMissionForUser(firebaseUser.uid, id, updates);
  }

  async function deleteMission(id) {
    if (!firebaseUser) return;
    await deleteMissionForUser(firebaseUser.uid, id);
  }

  async function completeMission(id) {
    if (!firebaseUser) return;

    const mission = missions.find((item) => item.id === id);
    if (!mission || mission.completed) return;

    await completeMissionForUser(firebaseUser.uid, mission);
  }

  async function addPost(post) {
    if (!firebaseUser) return;
    await addPostForUser(firebaseUser.uid, post);
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
          {(props) => <CommunityScreen {...props} posts={posts} currentUserId={firebaseUser?.uid} />}
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
