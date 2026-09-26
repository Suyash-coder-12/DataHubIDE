"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';
import { ActivityCalendar } from 'react-activity-calendar';
import { 
  Code, Briefcase, Link, Eye, Check, MessageSquare, Star, 
  Shield, Key, Smartphone, Mail, Settings, User, Trophy, Calendar, 
  MapPin, Edit, Monitor, Sun, Moon, ArrowRight, Activity, Zap
} from 'lucide-react';

function ProfilePageContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const { token, userId } = useAuthStore();
  const [profileData, setProfileData] = useState<any>(null);
  
  // Tabs
  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>('profile');
  const [settingsTab, setSettingsTab] = useState<'appearance' | 'security'>('appearance');

  // Edit Mode
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', bio: '', avatar_url: '', github_url: '', linkedin_url: '' });

  // Modals
  const [modalType, setModalType] = useState<'followers' | 'following' | null>(null);
  const [modalUsers, setModalUsers] = useState<any[]>([]);
  const [isLoadingModal, setIsLoadingModal] = useState(false);

  // Appearance Theme state
  const [themeMode, setThemeMode] = useState('dark-default');

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') || 'dark-default';
    setThemeMode(storedTheme);
  }, []);

  const handleThemeChange = (theme: string) => {
    setThemeMode(theme);
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    if (theme.startsWith('dark') || theme === 'soft-dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/users/profile?id=${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfileData(res.data);
      setEditForm({
        name: res.data.profile.Name || '',
        bio: res.data.profile.Bio || '',
        avatar_url: res.data.profile.AvatarURL || '',
        github_url: res.data.profile.GithubURL || '',
        linkedin_url: res.data.profile.LinkedinURL || '',
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token && id) {
      fetchProfile();
    }
  }, [token, id]);

  const handleFollow = async () => {
    try {
      await axios.post('http://localhost:8080/api/users/follow', { target_user_id: Number(id) }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProfile();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/users/profile/update', editForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsEditing(false);
      fetchProfile();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm({ ...editForm, avatar_url: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadDirectly = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          await axios.post('http://localhost:8080/api/users/profile/update', 
            { avatar_url: reader.result as string },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          fetchProfile();
        } catch (err) {
          console.error(err);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const openModal = async (type: 'followers' | 'following') => {
    setModalType(type);
    setIsLoadingModal(true);
    setModalUsers([]);
    try {
      const res = await axios.get(`http://localhost:8080/api/users/${type}?id=${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setModalUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingModal(false);
    }
  };

  if (!profileData) return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-500">Loading profile...</div>;

  const isOwnProfile = userId === Number(id);

  const calendarData = profileData.contributions.length > 0 ? profileData.contributions.map((c: any) => {
    const d = new Date(c.Date);
    return {
      date: d.toISOString().split('T')[0],
      count: c.Count,
      level: Math.min(c.Count, 4)
    };
  }) : [{ date: new Date().toISOString().split('T')[0], count: 0, level: 0 }];

  const renderProfileSidebar = () => (
    <div className="w-full md:w-1/3 lg:w-1/4 space-y-6">
      {/* Avatar & Basic Info */}
      <div className="bg-white dark:bg-corporate-blue-800 rounded-xl shadow-sm border border-gray-200 dark:border-corporate-blue-700 p-6 flex flex-col items-center">
        <div className="relative group w-32 h-32 mb-4">
          <div className="w-full h-full bg-corporate-red-500 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-inner overflow-hidden">
            {isEditing && editForm.avatar_url ? (
              <img src={editForm.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
            ) : profileData.profile.AvatarURL ? (
              <img src={profileData.profile.AvatarURL} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              profileData.student_id.substring(0, 2).toUpperCase()
            )}
          </div>
          {isEditing ? (
            <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white text-xs font-medium cursor-pointer opacity-0 group-hover:opacity-100 rounded-full transition-all">
              <Settings className="w-5 h-5 mb-1" />
              Upload
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            </label>
          ) : isOwnProfile ? (
            <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white text-xs font-medium cursor-pointer opacity-0 group-hover:opacity-100 rounded-full transition-all" title="Change Profile Photo">
              <Edit className="w-5 h-5 mb-1" />
              Update
              <input type="file" accept="image/*" className="hidden" onChange={handleUploadDirectly} />
            </label>
          ) : null}
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{profileData.profile.Name || "Suyash Rathod"}</h1>
        <p className="text-gray-500 dark:text-corporate-blue-200 font-medium mb-3">@{profileData.student_id}</p>
        
        <div className="w-full bg-gray-50 dark:bg-corporate-blue-900 rounded-lg p-3 text-sm text-center mb-4 flex justify-around">
          <div>
            <div className="font-bold text-gray-900 dark:text-white">Rank</div>
            <div className="text-corporate-blue-600 dark:text-corporate-blue-400">2,332,749</div>
          </div>
        </div>

        <div className="flex space-x-6 text-sm font-medium mb-6">
          <button onClick={() => openModal('following')} className="hover:text-corporate-blue-600 dark:hover:text-corporate-blue-400 transition-colors">
            <strong className="text-gray-900 dark:text-white">{profileData.following}</strong> <span className="text-gray-500">Following</span>
          </button>
          <button onClick={() => openModal('followers')} className="hover:text-corporate-blue-600 dark:hover:text-corporate-blue-400 transition-colors">
            <strong className="text-gray-900 dark:text-white">{profileData.followers}</strong> <span className="text-gray-500">Followers</span>
          </button>
        </div>

        {isOwnProfile ? (
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="w-full py-2 bg-gray-100 dark:bg-corporate-blue-700 text-gray-800 dark:text-white font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-corporate-blue-600 transition-colors flex items-center justify-center"
          >
            {isEditing ? 'Cancel Edit' : 'Edit Profile'}
          </button>
        ) : (
          <button 
            onClick={handleFollow}
            className={`w-full py-2 font-semibold rounded-lg transition-colors flex items-center justify-center ${profileData.is_following ? 'bg-gray-200 dark:bg-corporate-blue-700 text-gray-800 dark:text-white hover:bg-gray-300' : 'bg-corporate-red-500 text-white hover:bg-corporate-red-600 shadow-sm'}`}
          >
            {profileData.is_following ? 'Unfollow' : 'Follow'}
          </button>
        )}
      </div>

      {/* Links & Social */}
      <div className="bg-white dark:bg-corporate-blue-800 rounded-xl shadow-sm border border-gray-200 dark:border-corporate-blue-700 p-6 space-y-4">
        <div className="flex items-center text-sm text-gray-700 dark:text-gray-300 hover:text-corporate-blue-600 transition-colors">
          <Link className="w-5 h-5 mr-3 text-gray-400" />
          <a href="https://www.suyashrathod.xyz" target="_blank" rel="noreferrer" className="truncate">https://www.suyashrathod.xyz</a>
        </div>
        <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
          <Code className="w-5 h-5 mr-3 text-gray-400" />
          <span className="truncate">Suyash-coder-12</span>
        </div>
      </div>

      {/* Community Stats */}
      <div className="bg-white dark:bg-corporate-blue-800 rounded-xl shadow-sm border border-gray-200 dark:border-corporate-blue-700 p-6">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4">Community Stats</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center text-gray-600 dark:text-gray-400"><Eye className="w-4 h-4 mr-2" /> Views</div>
            <span className="font-medium text-gray-900 dark:text-white">91</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center text-gray-600 dark:text-gray-400"><Check className="w-4 h-4 mr-2" /> Solution</div>
            <span className="font-medium text-gray-900 dark:text-white">48</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center text-gray-600 dark:text-gray-400"><MessageSquare className="w-4 h-4 mr-2" /> Discuss</div>
            <span className="font-medium text-gray-900 dark:text-white">0</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center text-gray-600 dark:text-gray-400"><Star className="w-4 h-4 mr-2" /> Reputation</div>
            <span className="font-medium text-gray-900 dark:text-white">0</span>
          </div>
        </div>
      </div>

      {/* Languages & Skills */}
      <div className="bg-white dark:bg-corporate-blue-800 rounded-xl shadow-sm border border-gray-200 dark:border-corporate-blue-700 p-6">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4">Languages</h3>
        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-700 dark:text-gray-300">Java</span>
            <span className="text-gray-500"><strong className="text-gray-900 dark:text-white">55</strong> problems solved</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-700 dark:text-gray-300">Python</span>
            <span className="text-gray-500"><strong className="text-gray-900 dark:text-white">7</strong> problems solved</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-700 dark:text-gray-300">C++</span>
            <span className="text-gray-500"><strong className="text-gray-900 dark:text-white">3</strong> problems solved</span>
          </div>
        </div>

        <h3 className="font-bold text-gray-900 dark:text-white mb-4">Skills</h3>
        <div className="space-y-4">
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Advanced</div>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-gray-100 dark:bg-corporate-blue-900 text-gray-700 dark:text-gray-300 rounded text-xs">Dynamic Programming <span className="text-corporate-blue-500 ml-1">x13</span></span>
              <span className="px-2 py-1 bg-gray-100 dark:bg-corporate-blue-900 text-gray-700 dark:text-gray-300 rounded text-xs">Divide and Conquer <span className="text-corporate-blue-500 ml-1">x5</span></span>
              <span className="px-2 py-1 bg-gray-100 dark:bg-corporate-blue-900 text-gray-700 dark:text-gray-300 rounded text-xs">Backtracking <span className="text-corporate-blue-500 ml-1">x4</span></span>
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Intermediate</div>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-gray-100 dark:bg-corporate-blue-900 text-gray-700 dark:text-gray-300 rounded text-xs">Hash Table <span className="text-corporate-blue-500 ml-1">x14</span></span>
              <span className="px-2 py-1 bg-gray-100 dark:bg-corporate-blue-900 text-gray-700 dark:text-gray-300 rounded text-xs">Binary Search <span className="text-corporate-blue-500 ml-1">x10</span></span>
              <span className="px-2 py-1 bg-gray-100 dark:bg-corporate-blue-900 text-gray-700 dark:text-gray-300 rounded text-xs">Math <span className="text-corporate-blue-500 ml-1">x10</span></span>
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Fundamental</div>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-gray-100 dark:bg-corporate-blue-900 text-gray-700 dark:text-gray-300 rounded text-xs">Array <span className="text-corporate-blue-500 ml-1">x34</span></span>
              <span className="px-2 py-1 bg-gray-100 dark:bg-corporate-blue-900 text-gray-700 dark:text-gray-300 rounded text-xs">String <span className="text-corporate-blue-500 ml-1">x20</span></span>
              <span className="px-2 py-1 bg-gray-100 dark:bg-corporate-blue-900 text-gray-700 dark:text-gray-300 rounded text-xs">Two Pointers <span className="text-corporate-blue-500 ml-1">x9</span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProfileMainContent = () => (
    <div className="flex-1 space-y-6">
      {isEditing && (
        <div className="bg-white dark:bg-corporate-blue-800 rounded-xl shadow-sm border border-gray-200 dark:border-corporate-blue-700 p-6 mb-6">
          <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-4">Edit Profile Info</h3>
          <form onSubmit={handleSaveProfile} className="space-y-4 max-w-xl">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
              <input type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-corporate-blue-600 rounded-md shadow-sm dark:bg-corporate-blue-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-corporate-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
              <textarea value={editForm.bio} onChange={e => setEditForm({...editForm, bio: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-corporate-blue-600 rounded-md shadow-sm dark:bg-corporate-blue-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-corporate-blue-500" rows={3}></textarea>
            </div>
            <button type="submit" className="px-5 py-2 bg-corporate-blue-600 text-white font-medium rounded-lg hover:bg-corporate-blue-700 transition-colors shadow-sm">Save Changes</button>
          </form>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Solved Problems */}
        <div className="bg-white dark:bg-corporate-blue-800 rounded-xl shadow-sm border border-gray-200 dark:border-corporate-blue-700 p-6">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex justify-between">
            <span>Solved Problems</span>
          </h3>
          <div className="flex items-center space-x-6">
            <div className="relative w-28 h-28 shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" className="text-gray-100 dark:text-corporate-blue-900" strokeWidth="6" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="#eab308" strokeWidth="6" strokeDasharray={`${(65/4064)*283} 283`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">65</span>
                <span className="text-xs text-gray-500">/4064</span>
                <span className="text-xs font-semibold text-green-500 mt-1">94.49%</span>
              </div>
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-teal-500 font-medium w-12">Easy</span>
                <span className="font-semibold text-gray-900 dark:text-white">9<span className="text-gray-400 font-normal ml-1">/967</span></span>
                <span className="text-gray-500 text-xs w-20 text-right">Beats 25.26%</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-corporate-blue-900 h-1.5 rounded-full overflow-hidden">
                <div className="bg-teal-500 h-full" style={{width: '25%'}}></div>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-yellow-500 font-medium w-12">Med.</span>
                <span className="font-semibold text-gray-900 dark:text-white">40<span className="text-gray-400 font-normal ml-1">/2119</span></span>
                <span className="text-gray-500 text-xs w-20 text-right">Beats 69.71%</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-corporate-blue-900 h-1.5 rounded-full overflow-hidden">
                <div className="bg-yellow-500 h-full" style={{width: '70%'}}></div>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-red-500 font-medium w-12">Hard</span>
                <span className="font-semibold text-gray-900 dark:text-white">16<span className="text-gray-400 font-normal ml-1">/978</span></span>
                <span className="text-gray-500 text-xs w-20 text-right">Beats 72.85%</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-corporate-blue-900 h-1.5 rounded-full overflow-hidden">
                <div className="bg-red-500 h-full" style={{width: '73%'}}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="bg-white dark:bg-corporate-blue-800 rounded-xl shadow-sm border border-gray-200 dark:border-corporate-blue-700 p-6">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex justify-between">
            <span>Badges</span>
            <span className="text-sm font-normal text-gray-500">0</span>
          </h3>
          <div className="flex flex-col items-center justify-center h-28 text-center text-gray-500 bg-gray-50 dark:bg-corporate-blue-900 rounded-lg p-4 border border-dashed border-gray-200 dark:border-corporate-blue-700">
            <Trophy className="w-10 h-10 text-gray-300 dark:text-gray-600 mb-2" />
            <p className="text-sm font-medium">Locked Badge</p>
            <p className="text-xs">Sep LeetCoding Challenge</p>
          </div>
          <p className="text-center text-xs text-gray-400 mt-4">0 upcoming badge</p>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white dark:bg-corporate-blue-800 rounded-xl shadow-sm border border-gray-200 dark:border-corporate-blue-700 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h3 className="font-bold text-gray-900 dark:text-white flex items-center">
            <Activity className="w-5 h-5 mr-2 text-corporate-blue-500" />
            127 submissions in the past one year
          </h3>
          <div className="flex space-x-6 text-sm text-gray-600 dark:text-gray-400 mt-2 sm:mt-0">
            <span>Total active days: <strong className="text-gray-900 dark:text-white">25</strong></span>
            <span>Max streak: <strong className="text-gray-900 dark:text-white">8</strong></span>
          </div>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-corporate-blue-900 rounded-lg overflow-x-auto custom-scrollbar">
          <ActivityCalendar 
            data={calendarData} 
            theme={{
              light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
              dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
            }}
            labels={{
              legend: {
                less: 'Less',
                more: 'More'
              },
              months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
              totalCount: '{{count}} submissions in {{year}}',
            }}
          />
        </div>
      </div>

      {/* Recent AC */}
      <div className="bg-white dark:bg-corporate-blue-800 rounded-xl shadow-sm border border-gray-200 dark:border-corporate-blue-700 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-corporate-blue-700 bg-gray-50 dark:bg-corporate-blue-900 flex justify-between items-center">
          <h3 className="font-bold text-gray-900 dark:text-white flex items-center">
            <Zap className="w-4 h-4 mr-2 text-yellow-500" />
            Recent AC
          </h3>
          <a href="#" className="text-sm text-corporate-blue-600 dark:text-corporate-blue-400 hover:underline flex items-center">
            View all submissions <ArrowRight className="w-4 h-4 ml-1" />
          </a>
        </div>
        <ul className="divide-y divide-gray-100 dark:divide-corporate-blue-700">
          {[
            { name: "Evaluate the Bracket Pairs of a String", time: "2 hours ago" },
            { name: "Brace Expansion II", time: "a day ago" },
            { name: "Smallest Index With Digit Sum Equal to Index", time: "2 days ago" },
            { name: "Find X Value of Array I", time: "5 days ago" },
            { name: "Reverse Degree of a String", time: "6 days ago" },
            { name: "Circle and Rectangle Overlapping", time: "7 days ago" },
            { name: "Maximum Number of Non-Overlapping Substrings", time: "8 days ago" },
            { name: "Find Two Non-overlapping Sub-arrays Each With Target Sum", time: "9 days ago" },
            { name: "Maximum Number of Non-overlapping Palindrome Substrings", time: "11 days ago" },
            { name: "Image Overlap", time: "13 days ago" },
            { name: "First Missing Positive", time: "14 days ago" }
          ].map((item, i) => (
            <li key={i} className="flex justify-between items-center p-4 hover:bg-gray-50 dark:hover:bg-corporate-blue-900/50 transition-colors">
              <span className="font-medium text-gray-800 dark:text-gray-200">{item.name}</span>
              <span className="text-sm text-gray-500">{item.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const renderSettingsContent = () => (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Settings Sidebar */}
      <div className="w-full md:w-64 shrink-0 space-y-1">
        <button 
          onClick={() => setSettingsTab('appearance')}
          className={`w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${settingsTab === 'appearance' ? 'bg-corporate-blue-50 dark:bg-corporate-blue-900 text-corporate-blue-700 dark:text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-corporate-blue-800'}`}
        >
          <Monitor className="w-4 h-4 mr-3" />
          Appearance
        </button>
        <button 
          onClick={() => setSettingsTab('security')}
          className={`w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${settingsTab === 'security' ? 'bg-corporate-blue-50 dark:bg-corporate-blue-900 text-corporate-blue-700 dark:text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-corporate-blue-800'}`}
        >
          <Shield className="w-4 h-4 mr-3" />
          Security & Sign in
        </button>
      </div>

      {/* Settings Main */}
      <div className="flex-1 max-w-3xl">
        {settingsTab === 'appearance' ? (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-corporate-blue-700 pb-4 mb-6">Theme preferences</h2>
              
              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-lg">Light mode</h3>
                  
                  <label className={`block border rounded-xl p-4 cursor-pointer transition-colors ${themeMode === 'light-default' ? 'border-corporate-blue-500 bg-blue-50/50 dark:bg-corporate-blue-900/30' : 'border-gray-200 dark:border-corporate-blue-700 hover:border-gray-300'}`}>
                    <div className="flex items-start">
                      <input type="radio" name="theme" checked={themeMode === 'light-default'} onChange={() => handleThemeChange('light-default')} className="mt-1" />
                      <div className="ml-3">
                        <div className="font-medium text-gray-900 dark:text-white flex items-center">
                          Light default <Sun className="w-4 h-4 ml-2 text-yellow-500" />
                        </div>
                        <p className="text-sm text-gray-500 mt-1">GitHub's standard light theme with full color contrast and brightness.</p>
                      </div>
                    </div>
                  </label>

                  <label className={`block border rounded-xl p-4 cursor-pointer transition-colors ${themeMode === 'light-protanopia' ? 'border-corporate-blue-500 bg-blue-50/50 dark:bg-corporate-blue-900/30' : 'border-gray-200 dark:border-corporate-blue-700 hover:border-gray-300'}`}>
                    <div className="flex items-start">
                      <input type="radio" name="theme" checked={themeMode === 'light-protanopia'} onChange={() => handleThemeChange('light-protanopia')} className="mt-1" />
                      <div className="ml-3">
                        <div className="font-medium text-gray-900 dark:text-white flex items-center">
                          Light protanopia and deuteranopia <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-green-100 text-green-700 rounded border border-green-200">Beta</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">For people who may find it difficult to distinguish between reds and greens.</p>
                      </div>
                    </div>
                  </label>

                  <label className={`block border rounded-xl p-4 cursor-pointer transition-colors ${themeMode === 'light-tritanopia' ? 'border-corporate-blue-500 bg-blue-50/50 dark:bg-corporate-blue-900/30' : 'border-gray-200 dark:border-corporate-blue-700 hover:border-gray-300'}`}>
                    <div className="flex items-start">
                      <input type="radio" name="theme" checked={themeMode === 'light-tritanopia'} onChange={() => handleThemeChange('light-tritanopia')} className="mt-1" />
                      <div className="ml-3">
                        <div className="font-medium text-gray-900 dark:text-white flex items-center">
                          Light tritanopia <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-green-100 text-green-700 rounded border border-green-200">Beta</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">For people who find it difficult to distinguish between blues and greens, as well as yellows and purples.</p>
                      </div>
                    </div>
                  </label>
                </div>

                <div className="space-y-3 pt-6 border-t border-gray-200 dark:border-corporate-blue-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-lg">Dark mode</h3>
                  
                  <label className={`block border rounded-xl p-4 cursor-pointer transition-colors ${themeMode === 'dark-default' ? 'border-corporate-blue-500 bg-blue-50/50 dark:bg-corporate-blue-900/30' : 'border-gray-200 dark:border-corporate-blue-700 hover:border-gray-300'}`}>
                    <div className="flex items-start">
                      <input type="radio" name="theme" checked={themeMode === 'dark-default'} onChange={() => handleThemeChange('dark-default')} className="mt-1" />
                      <div className="ml-3">
                        <div className="font-medium text-gray-900 dark:text-white flex items-center">
                          Dark default <Moon className="w-4 h-4 ml-2 text-blue-400" />
                        </div>
                        <p className="text-sm text-gray-500 mt-1">GitHub's standard dark theme with full color contrast and brightness on a dark background.</p>
                      </div>
                    </div>
                  </label>

                  <label className={`block border rounded-xl p-4 cursor-pointer transition-colors ${themeMode === 'dark-protanopia' ? 'border-corporate-blue-500 bg-blue-50/50 dark:bg-corporate-blue-900/30' : 'border-gray-200 dark:border-corporate-blue-700 hover:border-gray-300'}`}>
                    <div className="flex items-start">
                      <input type="radio" name="theme" checked={themeMode === 'dark-protanopia'} onChange={() => handleThemeChange('dark-protanopia')} className="mt-1" />
                      <div className="ml-3">
                        <div className="font-medium text-gray-900 dark:text-white flex items-center">
                          Dark protanopia and deuteranopia <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-green-100 text-green-700 rounded border border-green-200">Beta</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">For people who may find it difficult to distinguish between reds and greens, with a dark background.</p>
                      </div>
                    </div>
                  </label>

                  <label className={`block border rounded-xl p-4 cursor-pointer transition-colors ${themeMode === 'dark-tritanopia' ? 'border-corporate-blue-500 bg-blue-50/50 dark:bg-corporate-blue-900/30' : 'border-gray-200 dark:border-corporate-blue-700 hover:border-gray-300'}`}>
                    <div className="flex items-start">
                      <input type="radio" name="theme" checked={themeMode === 'dark-tritanopia'} onChange={() => handleThemeChange('dark-tritanopia')} className="mt-1" />
                      <div className="ml-3">
                        <div className="font-medium text-gray-900 dark:text-white flex items-center">
                          Dark tritanopia <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-green-100 text-green-700 rounded border border-green-200">Beta</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">For people who find it difficult to distinguish between blues and greens, as well as yellows and purples, with a dark background.</p>
                      </div>
                    </div>
                  </label>

                  <label className={`block border rounded-xl p-4 cursor-pointer transition-colors ${themeMode === 'soft-dark' ? 'border-corporate-blue-500 bg-blue-50/50 dark:bg-corporate-blue-900/30' : 'border-gray-200 dark:border-corporate-blue-700 hover:border-gray-300'}`}>
                    <div className="flex items-start">
                      <input type="radio" name="theme" checked={themeMode === 'soft-dark'} onChange={() => handleThemeChange('soft-dark')} className="mt-1" />
                      <div className="ml-3">
                        <div className="font-medium text-gray-900 dark:text-white">Soft dark</div>
                        <p className="text-sm text-gray-500 mt-1">A dark theme with reduced contrast for comfortable viewing in low-light environments.</p>
                      </div>
                    </div>
                  </label>

                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-corporate-blue-700 pb-4 mb-6">Sign in methods</h2>
              
              <div className="bg-white dark:bg-corporate-blue-800 rounded-xl border border-gray-200 dark:border-corporate-blue-700 overflow-hidden divide-y divide-gray-200 dark:divide-corporate-blue-700">
                
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-gray-400 mr-4" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Email</div>
                      <div className="text-sm text-green-600 dark:text-green-500">1 verified email configured</div>
                    </div>
                  </div>
                  <button className="text-sm text-corporate-blue-600 dark:text-corporate-blue-400 font-medium">Manage</button>
                </div>
                
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <Key className="w-5 h-5 text-gray-400 mr-4" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Password</div>
                      <div className="text-sm text-gray-500">Configured</div>
                    </div>
                  </div>
                  <button className="text-sm text-corporate-blue-600 dark:text-corporate-blue-400 font-medium">Update</button>
                </div>

                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <Shield className="w-5 h-5 text-gray-400 mr-4" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Passkeys</div>
                      <div className="text-sm text-gray-500">Passwordless sign-in with biometrics or security keys</div>
                    </div>
                  </div>
                  <button className="text-sm font-medium px-3 py-1.5 bg-gray-100 dark:bg-corporate-blue-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-200">Add passkey</button>
                </div>

                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-400 mr-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                    </svg>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Google</div>
                      <div className="text-sm text-green-600 dark:text-green-500">1 account connected</div>
                    </div>
                  </div>
                  <button className="text-sm text-corporate-blue-600 dark:text-corporate-blue-400 font-medium">Manage</button>
                </div>

                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-400 mr-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
                    </svg>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Apple</div>
                      <div className="text-sm text-gray-500">Sign in with your Apple account</div>
                    </div>
                  </div>
                  <button className="text-sm font-medium px-3 py-1.5 bg-gray-100 dark:bg-corporate-blue-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-200">Connect</button>
                </div>

              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-corporate-blue-700 pb-4 mb-4">Two-factor authentication</h2>
              
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-6">
                <div className="flex items-center mb-2">
                  <Check className="w-5 h-5 text-green-600 dark:text-green-500 mr-2" />
                  <span className="font-bold text-green-800 dark:text-green-400 text-lg">Enabled</span>
                </div>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Because of your contributions on GitHub, two-factor authentication is required for your account. Thank you for helping keep the ecosystem safe! <a href="#" className="underline font-medium">Learn more about our two-factor authentication initiative</a>.
                </p>
                <p className="text-sm text-green-700 dark:text-green-300 mt-2">
                  Two-factor authentication adds an additional layer of security to your account by requiring more than just a password to sign in. <a href="#" className="underline font-medium">Learn more about two-factor authentication</a>.
                </p>
              </div>

              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Preferred 2FA method</h3>
                <p className="text-sm text-gray-500 mb-3">Set your preferred method to use for two-factor authentication when signing into GitHub.</p>
                <select className="block w-full max-w-xs px-3 py-2 border border-gray-300 dark:border-corporate-blue-700 rounded-md bg-white dark:bg-corporate-blue-900 text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-corporate-blue-500">
                  <option>SMS/Text message</option>
                  <option>GitHub Mobile</option>
                  <option>Authenticator app</option>
                </select>
              </div>

              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Two-factor methods</h3>
              <div className="bg-white dark:bg-corporate-blue-800 rounded-xl border border-gray-200 dark:border-corporate-blue-700 overflow-hidden divide-y divide-gray-200 dark:divide-corporate-blue-700">
                
                <div className="p-4 flex items-start justify-between">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Authenticator app</div>
                    <div className="text-sm text-gray-500 mt-1">Use an authentication app or browser extension to generate one-time codes.</div>
                  </div>
                  <button className="text-sm font-medium px-3 py-1.5 bg-gray-100 dark:bg-corporate-blue-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-200 ml-4 shrink-0">Add</button>
                </div>
                
                <div className="p-4 flex items-start justify-between bg-orange-50/50 dark:bg-orange-900/10">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white flex items-center">
                      SMS/Text message <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-green-100 text-green-700 rounded border border-green-200">Configured</span>
                    </div>
                    <div className="text-sm text-orange-700 dark:text-orange-400 mt-2 font-medium flex items-center">
                      <Shield className="w-4 h-4 mr-1" /> Less secure
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      We strongly advise against using SMS because it is susceptible to interception, does not provide resistance against phishing attacks, and deliverability can be unreliable. Instead, we recommend configuring an authenticator app and disabling SMS as a 2FA method. You will receive one-time codes at this phone number: <strong>+91 XXXXXX6196</strong>.
                    </div>
                  </div>
                  <button className="text-sm text-corporate-blue-600 dark:text-corporate-blue-400 font-medium ml-4 shrink-0">Edit</button>
                </div>

                <div className="p-4 flex items-start justify-between">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Security keys</div>
                    <div className="text-sm text-gray-500 mt-1">Security keys are webauthn credentials that can only be used as a second factor of authentication.</div>
                  </div>
                  <button className="text-sm font-medium px-3 py-1.5 bg-gray-100 dark:bg-corporate-blue-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-200 ml-4 shrink-0">Add</button>
                </div>

                <div className="p-4 flex items-start justify-between">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white flex items-center">
                      GitHub Mobile <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-green-100 text-green-700 rounded border border-green-200">Configured</span> <span className="ml-2 text-sm font-normal text-gray-500">2 devices</span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">GitHub Mobile can be used for two-factor authentication by installing the GitHub Mobile app and signing in to your account.</div>
                  </div>
                </div>

              </div>

              <div className="mt-8 border-t border-gray-200 dark:border-corporate-blue-700 pt-8">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Recovery options</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md border border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-500">
                  Your two-factor authentication recovery codes have not been downloaded or printed in the last one year. Make sure your recovery codes are up-to-date by viewing and downloading or printing them again.
                </p>
                <div className="flex items-center justify-between border border-gray-200 dark:border-corporate-blue-700 rounded-xl p-4">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white flex items-center">
                      Recovery codes <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-gray-100 dark:bg-corporate-blue-700 text-gray-700 dark:text-gray-300 rounded border border-gray-200 dark:border-corporate-blue-600">Viewed</span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1 max-w-lg">Recovery codes can be used to access your account in the event you lose access to your device and cannot receive two-factor authentication codes.</div>
                  </div>
                  <button className="text-sm font-medium px-4 py-2 bg-gray-100 dark:bg-corporate-blue-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-200 shrink-0">View</button>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#020a13] py-8">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Navigation Tabs */}
        <div className="flex space-x-2 border-b border-gray-200 dark:border-corporate-blue-800 mb-8 pb-px">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 text-sm font-medium flex items-center border-b-2 transition-colors ${activeTab === 'profile' ? 'border-corporate-red-500 text-gray-900 dark:text-white' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700'}`}
          >
            <User className="w-4 h-4 mr-2" /> Overview
          </button>
          {isOwnProfile && (
            <button 
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 text-sm font-medium flex items-center border-b-2 transition-colors ${activeTab === 'settings' ? 'border-corporate-red-500 text-gray-900 dark:text-white' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700'}`}
            >
              <Settings className="w-4 h-4 mr-2" /> Settings
            </button>
          )}
        </div>

        {/* Content Area */}
        {activeTab === 'profile' ? (
          <div className="flex flex-col md:flex-row gap-8">
            {renderProfileSidebar()}
            {renderProfileMainContent()}
          </div>
        ) : (
          renderSettingsContent()
        )}

      </div>
      
      {/* Modals */}
      {modalType && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-corporate-blue-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[80vh] border border-gray-200 dark:border-corporate-blue-700">
            <div className="p-4 border-b border-gray-200 dark:border-corporate-blue-700 flex justify-between items-center bg-gray-50 dark:bg-corporate-blue-900/50">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                {modalType}
              </h3>
              <button 
                onClick={() => setModalType(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto flex-1 custom-scrollbar">
              {isLoadingModal ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400 flex flex-col items-center">
                  <div className="w-8 h-8 border-4 border-corporate-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                  Loading...
                </div>
              ) : modalUsers.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">No {modalType} found.</div>
              ) : (
                <ul className="divide-y divide-gray-100 dark:divide-corporate-blue-700/50">
                  {modalUsers.map(u => (
                    <li key={u.id}>
                      <a href={`/profile?id=${u.id}`} className="flex items-center space-x-4 py-3 hover:bg-gray-50 dark:hover:bg-corporate-blue-700/50 rounded-lg px-3 transition-colors">
                        <div className="w-12 h-12 rounded-full bg-corporate-red-500 flex items-center justify-center text-white overflow-hidden flex-shrink-0 font-bold text-lg shadow-sm">
                          {u.avatar_url ? (
                            <img src={u.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                          ) : (
                            u.student_id.substring(0, 2).toUpperCase()
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                            {u.name || u.student_id}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-corporate-blue-300 truncate">
                            @{u.student_id}
                          </p>
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#020a13] text-gray-500">Loading profile...</div>}>
      <ProfilePageContent />
    </Suspense>
  );
}
