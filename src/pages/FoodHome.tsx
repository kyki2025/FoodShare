/**
 * 美食分享应用主页组件
 * 根据用户认证状态显示登录界面或美食记录管理界面
 */

import React, { useState, useEffect } from 'react';
import useAuthStore from '../store/authStore';
import useFoodRecordStore from '../store/foodRecordStore';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import FoodRecordCard from '../components/food/FoodRecordCard';
import FoodRecordForm from '../components/food/FoodRecordForm';
import { Button } from '../components/ui/button';
import { FoodRecord } from '../types/food';
import { Plus, LogOut, Search, Filter, BarChart3, Download, RefreshCw, Utensils } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import FoodExportButtons from '../components/export/FoodExportButtons';
import FoodAnalytics from '../components/analytics/FoodAnalytics';
import SyncStatus from '../components/common/SyncStatus';
import SimpleDataSync from '../components/sync/SimpleDataSync';
import useAutoSync from '../hooks/useAutoSync';

const FoodHome: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { records, loadRecords, addRecord, updateRecord, deleteRecord } = useFoodRecordStore();
  
  const [showLogin, setShowLogin] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<FoodRecord | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCuisine, setFilterCuisine] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [activeTab, setActiveTab] = useState('records');
  const [showDataSync, setShowDataSync] = useState(false);
  
  // 启用自动同步
  const { performAutoSync, syncStatus } = useAutoSync({
    enableAutoSync: true,
    syncInterval: 30 // 30分钟自动同步
  });

  // 加载记录数据
  useEffect(() => {
    if (isAuthenticated) {
      loadRecords();
    }
  }, [isAuthenticated, loadRecords]);

  /**
   * 获取当前用户的美食记录
   */
  const getUserRecords = (): FoodRecord[] => {
    if (!user) return [];
    
    let userRecords = records.filter(record => record.userId === user.id);
    
    // 搜索过滤
    if (searchTerm) {
      userRecords = userRecords.filter(record =>
        record.restaurantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.dishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // 菜系过滤
    if (filterCuisine !== 'all') {
      userRecords = userRecords.filter(record => record.cuisine === filterCuisine);
    }
    
    // 地点过滤
    if (filterLocation !== 'all') {
      userRecords = userRecords.filter(record => record.location === filterLocation);
    }
    
    // 按日期排序
    return userRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  /**
   * 处理保存美食记录
   */
  const handleSaveRecord = (recordData: Omit<FoodRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;

    if (editingRecord) {
      updateRecord(editingRecord.id, recordData);
    } else {
      const newRecord = {
        ...recordData,
        userId: user.id,
      };
      addRecord(newRecord);
    }
    
    setShowForm(false);
    setEditingRecord(undefined);
  };

  /**
   * 处理编辑记录
   */
  const handleEditRecord = (record: FoodRecord) => {
    setEditingRecord(record);
    setShowForm(true);
  };

  /**
   * 处理删除记录
   */
  const handleDeleteRecord = (id: string) => {
    if (window.confirm('确定要删除这条美食记录吗？')) {
      deleteRecord(id);
    }
  };

  /**
   * 处理取消表单
   */
  const handleCancelForm = () => {
    setShowForm(false);
    setEditingRecord(undefined);
  };

  // 如果未认证，显示登录/注册界面
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 flex items-center justify-center p-4">
        {showLogin ? (
          <LoginForm onSwitchToRegister={() => setShowLogin(false)} />
        ) : (
          <RegisterForm onSwitchToLogin={() => setShowLogin(true)} />
        )}
      </div>
    );
  }

  // 如果显示表单，显示创建/编辑界面
  if (showForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 p-4">
        <FoodRecordForm
          record={editingRecord}
          onSave={handleSaveRecord}
          onCancel={handleCancelForm}
        />
      </div>
    );
  }

  const userRecords = getUserRecords();
  const cuisineTypes = [...new Set(records.filter(r => r.userId === user?.id).map(r => r.cuisine))];
  const locations = [...new Set(records.filter(r => r.userId === user?.id).map(r => r.location))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100">
      {/* 顶部导航 */}
      <header className="bg-white shadow-sm border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Utensils className="w-8 h-8 text-orange-600 mr-2" />
              <h1 className="text-2xl font-bold text-orange-700">美食分享</h1>
              <span className="ml-4 text-gray-600">欢迎回来，{user?.username}</span>
              <div className="ml-4">
                <SyncStatus />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setShowDataSync(true)}
                variant="outline" 
                className="text-orange-600 hover:text-orange-700 border-orange-200"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
                {syncStatus === 'syncing' ? '同步中' : '手动同步'}
              </Button>
              <Button
                onClick={() => setShowForm(true)}
                className="bg-orange-600 hover:bg-orange-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                记录美食
              </Button>
              <Button
                variant="outline"
                onClick={logout}
                className="text-gray-600 hover:text-gray-700"
              >
                <LogOut className="w-4 h-4 mr-2" />
                退出登录
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="records" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              美食记录
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              数据分析
            </TabsTrigger>
          </TabsList>

          <TabsContent value="records" className="space-y-8">
            {/* 搜索和过滤 */}
            <div className="mb-8 bg-white p-6 rounded-lg shadow-sm">
              <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="搜索店铺、菜品、地点或标签..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="sm:w-48">
                  <Select value={filterCuisine} onValueChange={setFilterCuisine}>
                    <SelectTrigger>
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="筛选菜系" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">所有菜系</SelectItem>
                      {cuisineTypes.map(cuisine => (
                        <SelectItem key={cuisine} value={cuisine}>{cuisine}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="sm:w-48">
                  <Select value={filterLocation} onValueChange={setFilterLocation}>
                    <SelectTrigger>
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="筛选地点" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">所有地点</SelectItem>
                      {locations.map(location => (
                        <SelectItem key={location} value={location}>{location}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <FoodExportButtons records={userRecords} username={user?.username || ''} />
              </div>
            </div>

            {/* 美食记录列表 */}
            {userRecords.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {userRecords.map(record => (
                  <FoodRecordCard
                    key={record.id}
                    record={record}
                    onEdit={handleEditRecord}
                    onDelete={handleDeleteRecord}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="bg-white rounded-lg shadow-sm p-8">
                  <Utensils className="w-32 h-32 mx-auto mb-6 text-orange-300" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    {searchTerm || filterCuisine !== 'all' || filterLocation !== 'all' ? '没有找到匹配的美食记录' : '还没有美食记录'}
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {searchTerm || filterCuisine !== 'all' || filterLocation !== 'all' ? '试试调整搜索条件' : '开始记录您的第一次美食体验吧'}
                  </p>
                  {(!searchTerm && filterCuisine === 'all' && filterLocation === 'all') && (
                    <Button
                      onClick={() => setShowForm(true)}
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      记录美食
                    </Button>
                  )}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="analytics">
            <FoodAnalytics records={userRecords} />
          </TabsContent>
        </Tabs>
      </main>
      
      {/* 数据同步弹窗 */}
      {showDataSync && (
        <SimpleDataSync
          onClose={() => setShowDataSync(false)}
        />
      )}
    </div>
  );
};

export default FoodHome;