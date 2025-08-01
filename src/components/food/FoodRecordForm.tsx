/**
 * 美食记录表单组件
 * 用于创建和编辑美食记录信息
 */

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { FoodRecord } from '../../types/food';
import { Save, X, Star } from 'lucide-react';
import ImageUpload from '../ui/image-upload';

interface FoodRecordFormProps {
  record?: FoodRecord;
  onSave: (record: Omit<FoodRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const FoodRecordForm: React.FC<FoodRecordFormProps> = ({ record, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    date: record?.date || new Date().toISOString().split('T')[0],
    restaurantName: record?.restaurantName || '',
    dishes: record?.dishes || [{ name: '' }],
    cuisine: record?.cuisine || '',
    location: record?.location || '',
    address: record?.address || '',
    price: record?.price || 0,
    rating: record?.rating || 5,
    tasteRating: record?.tasteRating || 5,
    serviceRating: record?.serviceRating || 5,
    environmentRating: record?.environmentRating || 5,
    recommendationIndex: record?.recommendationIndex || 5,
    dishDescription: record?.dishDescription || '',
    specialFeatures: record?.specialFeatures || '',
    diningEnvironment: record?.diningEnvironment || '',
    serviceExperience: record?.serviceExperience || '',
    notes: record?.notes || '',
    imageUrls: record?.imageUrls || [],
    tags: record?.tags || [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tagInput, setTagInput] = useState('');

  /**
   * 处理表单字段变化
   */
  const handleChange = (field: string, value: string | number | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 清除对应字段的错误
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  /**
   * 添加标签
   */
  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      handleChange('tags', [...formData.tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  /**
   * 删除标签
   */
  const removeTag = (tagToRemove: string) => {
    handleChange('tags', formData.tags.filter(tag => tag !== tagToRemove));
  };

  /**
   * 添加推荐菜品
   */
  const addDish = () => {
    handleChange('dishes', [...formData.dishes, { name: '' }]);
  };

  /**
   * 删除推荐菜品
   */
  const removeDish = (index: number) => {
    if (formData.dishes.length > 1) {
      const newDishes = formData.dishes.filter((_, i) => i !== index);
      handleChange('dishes', newDishes);
    }
  };

  /**
   * 更新推荐菜品
   */
  const updateDish = (index: number, value: string) => {
    const newDishes = [...formData.dishes];
    newDishes[index] = { name: value };
    handleChange('dishes', newDishes);
  };

  /**
   * 验证表单数据
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.restaurantName.trim()) {
      newErrors.restaurantName = '请输入店铺名称';
    }
    
    // 验证至少有一个菜品且菜品名称不为空
    const hasValidDish = formData.dishes.some(dish => dish.name.trim());
    if (!hasValidDish) {
      newErrors.dishName = '请至少输入一个菜品名称';
    }
    
    if (!formData.cuisine) {
      newErrors.cuisine = '请选择菜系';
    }
    if (!formData.location.trim()) {
      newErrors.location = '请输入地点';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * 处理表单提交
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSave(formData);
  };

  const cuisineTypes = [
    '川菜', '粤菜', '鲁菜', '苏菜', '浙菜', '闽菜', '湘菜', '徽菜',
    '东北菜', '西北菜', '京菜', '沪菜', '豫菜', '晋菜', '陕菜',
    '日料', '韩料', '泰菜', '越南菜', '印度菜', '意大利菜', '法菜',
    '美式', '墨西哥菜', '中东菜', '其他'
  ];

  const renderStarRating = (value: number, onChange: (value: number) => void, label: string) => (
    <div className="space-y-2">
      <Label className="text-lg">{label}</Label>
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className={`p-1 ${star <= value ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400 transition-colors`}
          >
            <Star className="w-6 h-6 fill-current" />
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">
          {value === 5 ? '极佳' : value === 4 ? '很好' : value === 3 ? '良好' : value === 2 ? '一般' : '需改进'}
        </span>
      </div>
    </div>
  );

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-orange-700">
          {record ? '编辑美食记录' : '记录今日美食'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 基本信息 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-lg">日期</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                className="text-base"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="restaurantName" className="text-lg">店铺名称 *</Label>
              <Input
                id="restaurantName"
                placeholder="例如：海底捞火锅"
                value={formData.restaurantName}
                onChange={(e) => handleChange('restaurantName', e.target.value)}
                className={`text-base ${errors.restaurantName ? 'border-red-500' : ''}`}
              />
              {errors.restaurantName && <p className="text-red-500 text-sm">{errors.restaurantName}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-lg">推荐菜品 *</Label>
                <Button
                  type="button"
                  onClick={addDish}
                  variant="outline"
                  size="sm"
                  className="text-orange-600 border-orange-600 hover:bg-orange-50"
                >
                  ➕ 添加菜品
                </Button>
              </div>
              <div className="space-y-3">
                {formData.dishes.map((dish, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">菜品 {index + 1}</span>
                      {formData.dishes.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removeDish(index)}
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          删除
                        </Button>
                      )}
                    </div>
                    <Input
                      placeholder="例如：麻辣牛肉锅"
                      value={dish.name}
                      onChange={(e) => updateDish(index, e.target.value)}
                      className="text-base"
                    />
                  </div>
                ))}
              </div>
              {errors.dishName && <p className="text-red-500 text-sm">{errors.dishName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cuisine" className="text-lg">菜系 *</Label>
              <Select value={formData.cuisine} onValueChange={(value) => handleChange('cuisine', value)}>
                <SelectTrigger className={`text-base ${errors.cuisine ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder="请选择菜系" />
                </SelectTrigger>
                <SelectContent>
                  {cuisineTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.cuisine && <p className="text-red-500 text-sm">{errors.cuisine}</p>}
            </div>
          </div>

          {/* 位置和价格信息 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location" className="text-lg">地点 *</Label>
              <Input
                id="location"
                placeholder="例如：北京朝阳区"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                className={`text-base ${errors.location ? 'border-red-500' : ''}`}
              />
              {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-lg">详细地址</Label>
              <Input
                id="address"
                placeholder="例如：三里屯太古里"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className="text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price" className="text-lg">人均消费 (元)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
                className="text-base"
                placeholder="50"
              />
            </div>
          </div>

          {/* 评分系统 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderStarRating(formData.rating, (value) => handleChange('rating', value), '综合评分')}
            {renderStarRating(formData.tasteRating, (value) => handleChange('tasteRating', value), '口味评分')}
            {renderStarRating(formData.serviceRating, (value) => handleChange('serviceRating', value), '服务评分')}
            {renderStarRating(formData.environmentRating, (value) => handleChange('environmentRating', value), '环境评分')}
            {renderStarRating(formData.recommendationIndex, (value) => handleChange('recommendationIndex', value), '推荐指数')}
          </div>

          {/* 详细描述 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dishDescription" className="text-lg">菜品描述</Label>
              <Textarea
                id="dishDescription"
                placeholder="描述菜品的外观、口感、特点..."
                value={formData.dishDescription}
                onChange={(e) => handleChange('dishDescription', e.target.value)}
                rows={3}
                className="text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialFeatures" className="text-lg">特色亮点</Label>
              <Textarea
                id="specialFeatures"
                placeholder="这道菜或这家店的特色是什么..."
                value={formData.specialFeatures}
                onChange={(e) => handleChange('specialFeatures', e.target.value)}
                rows={3}
                className="text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="diningEnvironment" className="text-lg">就餐环境</Label>
              <Textarea
                id="diningEnvironment"
                placeholder="描述餐厅的装修、氛围、位置等..."
                value={formData.diningEnvironment}
                onChange={(e) => handleChange('diningEnvironment', e.target.value)}
                rows={3}
                className="text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="serviceExperience" className="text-lg">服务感受</Label>
              <Textarea
                id="serviceExperience"
                placeholder="描述服务员的态度、服务质量等..."
                value={formData.serviceExperience}
                onChange={(e) => handleChange('serviceExperience', e.target.value)}
                rows={3}
                className="text-base"
              />
            </div>
          </div>

          {/* 标签系统 */}
          <div className="space-y-2">
            <Label className="text-lg">标签</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-sm flex items-center"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-orange-600 hover:text-orange-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="space-y-2">
              <div className="space-y-2">
                <Label className="text-sm">选择预设标签</Label>
                <Select onValueChange={(value) => {
                  if (value && !formData.tags.includes(value)) {
                    handleChange('tags', [...formData.tags, value]);
                  }
                }}>
                  <SelectTrigger className="text-base">
                    <SelectValue placeholder="选择标签..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="辣">🌶️ 辣</SelectItem>
                    <SelectItem value="甜">🍯 甜</SelectItem>
                    <SelectItem value="酸">🍋 酸</SelectItem>
                    <SelectItem value="咸">🧂 咸</SelectItem>
                    <SelectItem value="鲜">🐟 鲜</SelectItem>
                    <SelectItem value="香">🌿 香</SelectItem>
                    <SelectItem value="实惠">💰 实惠</SelectItem>
                    <SelectItem value="高档">💎 高档</SelectItem>
                    <SelectItem value="约会">💕 约会</SelectItem>
                    <SelectItem value="聚餐">👥 聚餐</SelectItem>
                    <SelectItem value="商务">💼 商务</SelectItem>
                    <SelectItem value="家庭">👨‍👩‍👧‍👦 家庭</SelectItem>
                    <SelectItem value="网红">📸 网红</SelectItem>
                    <SelectItem value="传统">🏮 传统</SelectItem>
                    <SelectItem value="创新">✨ 创新</SelectItem>
                    <SelectItem value="健康">🥗 健康</SelectItem>
                    <SelectItem value="素食">🥬 素食</SelectItem>
                    <SelectItem value="海鲜">🦐 海鲜</SelectItem>
                    <SelectItem value="烧烤">🍖 烧烤</SelectItem>
                    <SelectItem value="火锅">🍲 火锅</SelectItem>
                    <SelectItem value="小吃">🥟 小吃</SelectItem>
                    <SelectItem value="甜品">🍰 甜品</SelectItem>
                    <SelectItem value="饮品">🥤 饮品</SelectItem>
                    <SelectItem value="夜宵">🌙 夜宵</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">自定义标签</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="输入自定义标签..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="text-base"
                  />
                  <Button type="button" onClick={addTag} variant="outline">
                    添加
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* 美食图片 */}
          <div className="space-y-2">
            <Label className="text-lg">美食图片</Label>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    const currentUrls = formData.imageUrls.filter(url => url.trim());
                    let processedCount = 0;
                    const newUrls: string[] = [];
                    
                    files.forEach(file => {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const imageUrl = event.target?.result as string;
                        if (imageUrl) {
                          newUrls.push(imageUrl);
                        }
                        processedCount++;
                        
                        // 当所有文件都处理完成后，一次性更新状态
                        if (processedCount === files.length) {
                          handleChange('imageUrls', [...currentUrls, ...newUrls]);
                        }
                      };
                      reader.readAsDataURL(file);
                    });
                    
                    // 清空input，允许重复选择相同文件
                    e.target.value = '';
                  }}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <div className="text-gray-600">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="mt-2 text-sm">点击选择多张图片</p>
                    <p className="text-xs text-gray-500">支持 JPG、PNG 格式</p>
                  </div>
                </label>
              </div>
              
              {formData.imageUrls.filter(url => url.trim()).length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {formData.imageUrls.filter(url => url.trim()).map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`美食图片 ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newUrls = formData.imageUrls.filter((_, i) => i !== index);
                          handleChange('imageUrls', newUrls);
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 用餐心得 */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-lg">用餐心得</Label>
            <Textarea
              id="notes"
              placeholder="记录您的用餐感受、推荐理由、注意事项等..."
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={4}
              className="text-base"
            />
          </div>

          {/* 提交按钮 */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
            >
              <X className="w-4 h-4 mr-2" />
              取消
            </Button>
            <Button
              type="submit"
              className="bg-orange-600 hover:bg-orange-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {record ? '更新记录' : '保存记录'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default FoodRecordForm;