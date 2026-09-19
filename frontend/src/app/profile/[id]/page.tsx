"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';
import { ActivityCalendar } from 'react-activity-calendar';

export default function ProfilePage() {
  const { id } = useParams();
  const { token, userId } = useAuthStore();
  const [profileData, setProfileData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', bio: '', avatar_url: '', github_url: '', linkedin_url: '' });

  // Modal State
  const [modalType, setModalType] = useState<'followers' | 'following' | null>(null);
  const [modalUsers, setModalUsers] = useState<any[]>([]);
  const [isLoadingModal, setIsLoadingModal] = useState(false);

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
          fetchProfile(); // Refresh to show new avatar
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

  if (!profileData) return <div className="p-8">Loading...</div>;

  const isOwnProfile = userId === Number(id);

  // Transform contributions for calendar
  // react-activity-calendar expects { date: 'YYYY-MM-DD', count: number, level: number }
  const calendarData = profileData.contributions.map((c: any) => {
    const d = new Date(c.Date);
    return {
      date: d.toISOString().split('T')[0],
      count: c.Count,
      level: Math.min(c.Count, 4) // max level 4
    };
  });
  
  // Fill empty days for at least the current year if no data
  if (calendarData.length === 0) {
    const today = new Date();
    calendarData.push({ date: today.toISOString().split('T')[0], count: 0, level: 0 });
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-corporate-blue-800 rounded-xl shadow-lg border border-gray-200 dark:border-corporate-blue-700 overflow-hidden">
        
        {/* Header */}
        <div className="bg-corporate-blue-900 p-6 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="relative group">
              <div className="w-24 h-24 bg-corporate-red-500 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-inner overflow-hidden">
                {isEditing && editForm.avatar_url ? (
                  <img src={editForm.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : profileData.profile.AvatarURL ? (
                  <img src={profileData.profile.AvatarURL} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  profileData.student_id.substring(0, 2).toUpperCase()
                )}
              </div>
              {isEditing ? (
                <label className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-xs cursor-pointer opacity-0 group-hover:opacity-100 rounded-full transition-opacity">
                  Upload
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                </label>
              ) : isOwnProfile ? (
                <label className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-xs cursor-pointer opacity-0 group-hover:opacity-100 rounded-full transition-opacity" title="Change Profile Photo">
                  Update
                  <input type="file" accept="image/*" className="hidden" onChange={handleUploadDirectly} />
                </label>
              ) : null}
            </div>
            <div className="text-white">
              <h1 className="text-2xl font-bold">{profileData.profile.Name || profileData.student_id}</h1>
              <p className="text-corporate-blue-200">@{profileData.student_id}</p>
              <div className="flex space-x-4 mt-2 text-sm">
                <button onClick={() => openModal('followers')} className="hover:underline"><strong>{profileData.followers}</strong> Followers</button>
                <button onClick={() => openModal('following')} className="hover:underline"><strong>{profileData.following}</strong> Following</button>
              </div>
            </div>
          </div>
          
          <div>
            {isOwnProfile ? (
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 bg-white text-corporate-blue-900 font-medium rounded-md hover:bg-gray-100 transition-colors"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            ) : (
              <button 
                onClick={handleFollow}
                className={`px-6 py-2 font-medium rounded-md transition-colors ${profileData.is_following ? 'bg-gray-600 text-white hover:bg-gray-700' : 'bg-corporate-red-500 text-white hover:bg-corporate-red-600'}`}
              >
                {profileData.is_following ? 'Unfollow' : 'Follow'}
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="space-y-4 max-w-xl mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                <input type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-corporate-blue-600 rounded-md shadow-sm dark:bg-corporate-blue-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bio</label>
                <textarea value={editForm.bio} onChange={e => setEditForm({...editForm, bio: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-corporate-blue-600 rounded-md shadow-sm dark:bg-corporate-blue-900 dark:text-white" rows={3}></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">GitHub URL</label>
                <input type="url" value={editForm.github_url} onChange={e => setEditForm({...editForm, github_url: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-corporate-blue-600 rounded-md shadow-sm dark:bg-corporate-blue-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">LinkedIn URL</label>
                <input type="url" value={editForm.linkedin_url} onChange={e => setEditForm({...editForm, linkedin_url: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-corporate-blue-600 rounded-md shadow-sm dark:bg-corporate-blue-900 dark:text-white" />
              </div>
              <button type="submit" className="px-4 py-2 bg-corporate-blue-600 text-white rounded hover:bg-corporate-blue-700">Save Changes</button>
            </form>
          ) : (
            <div className="mb-8 text-gray-800 dark:text-gray-200">
              <h3 className="text-lg font-semibold mb-2">About</h3>
              <p className="whitespace-pre-wrap">{profileData.profile.Bio || 'No bio provided.'}</p>
              
              <div className="mt-4 flex space-x-4">
                {profileData.profile.GithubURL && <a href={profileData.profile.GithubURL} target="_blank" rel="noreferrer" className="text-corporate-blue-600 dark:text-corporate-blue-400 hover:underline">GitHub</a>}
                {profileData.profile.LinkedinURL && <a href={profileData.profile.LinkedinURL} target="_blank" rel="noreferrer" className="text-corporate-blue-600 dark:text-corporate-blue-400 hover:underline">LinkedIn</a>}
              </div>
            </div>
          )}

          <div className="border-t border-gray-200 dark:border-corporate-blue-700 pt-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Daily Contributions</h3>
            <div className="p-4 bg-gray-50 dark:bg-corporate-blue-900 rounded-lg overflow-x-auto">
              <ActivityCalendar 
                data={calendarData} 
                theme={{
                  light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
                  dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Followers/Following Modal */}
      {modalType && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-corporate-blue-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-4 border-b border-gray-200 dark:border-corporate-blue-700 flex justify-between items-center bg-gray-50 dark:bg-corporate-blue-900">
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
            
            <div className="p-4 overflow-y-auto flex-1">
              {isLoadingModal ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">Loading...</div>
              ) : modalUsers.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">No {modalType} found.</div>
              ) : (
                <ul className="divide-y divide-gray-200 dark:divide-corporate-blue-700">
                  {modalUsers.map(u => (
                    <li key={u.id}>
                      <a href={`/profile/${u.id}`} className="flex items-center space-x-4 py-3 hover:bg-gray-50 dark:hover:bg-corporate-blue-700 rounded-lg px-2 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-corporate-red-500 flex items-center justify-center text-white overflow-hidden flex-shrink-0">
                          {u.avatar_url ? (
                            <img src={u.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                          ) : (
                            u.student_id.substring(0, 2).toUpperCase()
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {u.name || u.student_id}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
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
