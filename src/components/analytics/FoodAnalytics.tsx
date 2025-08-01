/**
 * 美食数据分析组件
 * 提供美食记录的统计分析和可视化展示
 */

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { FoodRecord } from '../../types/food';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Award, MapPin, DollarSign, Star, Utensils } from 'lucide-react';

interface FoodAnalyticsProps {
  records: FoodRecord[];
}

const FoodAnalytics: React.FC<FoodAnalyticsProps> = ({ records }) => {
  // 颜色配置
  const COLORS = ['#ea580c', '#fb923c', '#fed7aa', '#ffedd5', '#fef3e2', '#fefbf3'];

  /**
   * 计算基础统计数据
   */
  const basicStats = useMemo(() => {
    if (records.length === 0) return null;

    const totalRecords = records.length;
    const avgRating = records.reduce((sum, record) => sum + record.rating, 0) / totalRecords;
    const avgPrice = records.reduce((sum, record) => sum + record.price, 0) / totalRecords;
    const totalSpent = records.reduce((sum, record) => sum + record.price, 0);
    
    const cuisineCount = records.reduce((acc, record) => {
      acc[record.cuisine] = (acc[record.cuisine] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const favoriteCuisine = Object.entries(cuisineCount).reduce((a, b) => 
      cuisineCount[a[0]] > cuisineCount[b[0]] ? a : b
    )[0];

    const locationCount = records.reduce((acc, record) => {
      acc[record.location] = (acc[record.location] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const favoriteLocation = Object.entries(locationCount).reduce((a, b) => 
      locationCount[a[0]] > locationCount[b[0]] ? a : b
    )[0];

    return {
      totalRecords,
      avgRating: Math.round(avgRating * 10) / 10,
      avgPrice: Math.round(avgPrice * 100) / 100,
      totalSpent: Math.round(totalSpent * 100) / 100,
      favoriteCuisine,
      favoriteLocation,
    };
  }, [records]);

  /**
   * 菜系分布数据
   */
  const cuisineData = useMemo(() => {
    const cuisineCount = records.reduce((acc, record) => {
      acc[record.cuisine] = (acc[record.cuisine] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(cuisineCount)
      .map(([cuisine, count]) => ({ name: cuisine, value: count }))
      .sort((a, b) => b.value - a.value);
  }, [records]);

  /**
   * 评分分布数据
   */
  const ratingData = useMemo(() => {
    const ratingCount = records.reduce((acc, record) => {
      const rating = Math.floor(record.rating);
      acc[rating] = (acc[rating] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    return [1, 2, 3, 4, 5].map(rating => ({
      rating: `${rating}星`,
      count: ratingCount[rating] || 0,
    }));
  }, [records]);

  /**
   * 月度用餐趋势
   */
  const monthlyTrend = useMemo(() => {
    const monthlyCount = records.reduce((acc, record) => {
      const month = new Date(record.date).toLocaleDateString('zh-CN', { year: 'numeric', month: 'short' });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(monthlyCount)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
      .slice(-12); // 最近12个月
  }, [records]);

  /**
   * 价格区间分析
   */
  const priceRangeData = useMemo(() => {
    const ranges = [
      { name: '0-50元', min: 0, max: 50 },
      { name: '51-100元', min: 51, max: 100 },
      { name: '101-200元', min: 101, max: 200 },
      { name: '201-500元', min: 201, max: 500 },
      { name: '500元以上', min: 501, max: Infinity },
    ];

    return ranges.map(range => ({
      name: range.name,
      count: records.filter(record => record.price >= range.min && record.price <= range.max).length,
    }));
  }, [records]);

  /**
   * 推荐指数最高的餐厅
   */
  const topRecommendations = useMemo(() => {
    return records
      .filter(record => record.recommendationIndex >= 4)
      .sort((a, b) => b.recommendationIndex - a.recommendationIndex)
      .slice(0, 5);
  }, [records]);

  if (!basicStats) {
    return (
      <div className="text-center py-16">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <Utensils className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">暂无数据分析</h3>
          <p className="text-gray-500">开始记录美食体验后，这里将显示详细的数据分析</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 基础统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">总记录数</p>
                <p className="text-3xl font-bold">{basicStats.totalRecords}</p>
              </div>
              <Utensils className="w-8 h-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100">平均评分</p>
                <p className="text-3xl font-bold">{basicStats.avgRating}</p>
              </div>
              <Star className="w-8 h-8 text-yellow-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">平均消费</p>
                <p className="text-3xl font-bold">¥{basicStats.avgPrice}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">总消费</p>
                <p className="text-3xl font-bold">¥{basicStats.totalSpent}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 偏好统计 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="w-5 h-5 mr-2 text-orange-600" />
              最爱菜系
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-orange-600">{basicStats.favoriteCuisine}</p>
            <p className="text-gray-600">您最常品尝的菜系</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-orange-600" />
              常去地点
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-orange-600">{basicStats.favoriteLocation}</p>
            <p className="text-gray-600">您最常去的用餐地点</p>
          </CardContent>
        </Card>
      </div>

      {/* 图表分析 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 菜系分布饼图 */}
        <Card>
          <CardHeader>
            <CardTitle>菜系分布</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={cuisineData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {cuisineData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 评分分布柱状图 */}
        <Card>
          <CardHeader>
            <CardTitle>评分分布</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ratingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="rating" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#ea580c" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 月度用餐趋势 */}
        <Card>
          <CardHeader>
            <CardTitle>用餐趋势</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#ea580c" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 价格区间分析 */}
        <Card>
          <CardHeader>
            <CardTitle>消费区间</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={priceRangeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#fb923c" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 推荐餐厅列表 */}
      {topRecommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="w-5 h-5 mr-2 text-orange-600" />
              高推荐指数餐厅
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topRecommendations.map((record, index) => (
                <div key={record.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-gray-800">{record.restaurantName}</p>
                      <p className="text-sm text-gray-600">{record.dishName} • {record.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                    <span className="font-semibold">{record.recommendationIndex}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FoodAnalytics;